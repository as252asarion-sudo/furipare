# 開発知見ログ（furipare 固有）

furipare 開発で得た再発防止メモ。横断的な学びは `~/.claude/LEARNINGS.md` へ。
運用ルールは `~/.claude/CLAUDE.md`。

## エントリの型
```
## [YYYY-MM-DD] 短いタイトル
- 問題 / 原因 / 解決 / 再発防止
```

---

## [2026-06-17] Next.js は訓練データと別物として扱う
- 問題: 既知の Next.js の前提で書くと API・規約・ファイル構成が食い違う
- 原因: このバージョンは breaking changes を含み、訓練データと異なる
- 解決: コードを書く前に `node_modules/next/dist/docs/` の該当ガイドを読む
- 再発防止: Next.js 関連の実装前に必ず該当ドキュメントを確認し、deprecation 通知に従う

## [2026-07-02] YouTube字幕の非公式スクレイピングはもう機能しない
- 問題: `app/api/ailog/fetch-url` にYouTube字幕取得を実装しようとしたが、`timedtext` URLを直接叩いても本文が常に空（200だが0バイト）で返る
- 原因: YouTubeが2025年頃からPoToken（BotGuard由来の証明トークン）を要求するようになり、非公式スクレイピングでは字幕テキストを取得できなくなった。`bgutils-js`で正規のPoToken生成手順を実装しても、`get_transcript` (InnerTube API) は10回中10回 `FAILED_PRECONDITION` で失敗（[LuanRT/YouTube.js#1102](https://github.com/LuanRT/YouTube.js/issues/1102) で同様の既知バグ報告あり）
- 解決: サードパーティAPI（Supadata `https://api.supadata.ai/v1/transcript`、`x-api-key`ヘッダー認証、無料枠あり）に切り替えて解決。動画タイトルはYouTube公式の`oembed`エンドポイント（PoToken不要・安定）で取得
- 再発防止: YouTube動画ページ・字幕の直接スクレイピングは試みる前に「PoToken必須化で機能しない」ことを前提に検討する。実装前に必ず実データで動作検証（`node`で単発スクリプトを書いて疎通確認）してから本実装に進む

## [2026-07-05] Geminiアプリの共有リンクはshare.gemini.google短縮URLで飛んでくる
- 問題: Gemini公式アプリの共有機能から実機でリンクを貼ったところ「対応していないURL」と判定された
- 原因: `app/api/ailog/fetch-url`は入力URL文字列に`gemini.google.com/share/`が含まれるかで判定していたが、Geminiアプリの共有機能はGoogle公式のURL短縮サービス（`share.gemini.google/xxx`、レスポンスヘッダーに`LinkShortenerUi`）経由でリンクを発行するため、ドメインが一致せず判定漏れしていた
- 解決: `res.url`（fetchがリダイレクトを追った後の最終URL）も判定対象に加えた。Node.jsのfetchはデフォルトでリダイレクトを追うため、最終的にgemini.google.com/share/に着地すればそちらで拾える
- 再発防止: 外部サービスの「共有」機能が生成するURLは、Web版の直接リンクと形式が違う（短縮URL経由）ことがある。ドメイン文字列の完全一致で判定するのではなく、リダイレクト後の実URLも見るか、実機の共有機能で発行される実際のURLを一度確認してから判定ロジックを書く

## [2026-07-05] LLMに生JSONを書かせると長文・複数段落でパースが壊れる
- 問題: `app/api/ailog/analyze`で長尺YouTube動画の要約を保存すると、summaryが空・カテゴリが「その他」のまま保存される（`lib/store.tsx`の`addLog`がAI解析失敗を握りつぶす仕様のため気づきにくい）
- 原因: プロンプトで「## 見出し」付きの複数段落要約をJSON文字列として書かせていたが、モデルが生成するJSON内の改行が正しくエスケープされないことがあり`JSON.parse`が失敗していた（本番ログには500しか残らず、詳細な例外は`console.error`していなかったため特定に時間がかかった）
- 解決: Anthropicのtool use（`tools`+`tool_choice: {type:'tool', name:...}`）に切り替え、SDKに構造化データのJSONエンコードを任せる形にした。`response.content`から`type: 'tool_use'`のブロックを探し`.input`をそのまま使う（正規表現でJSON片を抜き出して`JSON.parse`する自前実装をやめた）
- 再発防止: LLMに複数行・長文を含む構造化データ（JSON等）を「テキストとして」書かせるのは避け、tool use / structured outputで返させる。またAPI側のcatchブロックでは`console.error`で詳細を残す（500とだけ返るとVercelログから原因が追えない）。クライアント側でAI解析が失敗した場合に静かにフォールバックする設計は、ユーザーに気づかれないまま不具合が放置されるリスクがある点も認識しておく

## [2026-07-05] tool use化しても、max_tokens不足で引数が途中切れするとNOT NULL違反でクラッシュする
- 問題: tool use化（上記エントリ）で直したはずが、同じ40分超動画で今度は`NOT NULL constraint failed: logs.summary`でアプリがクラッシュした
- 原因: 「本文の情報量に見合った十分な文量」という指示で生成される要約が長すぎ、`max_tokens`(2048)に到達してtool useの引数生成が途中で切れ、`summary`フィールドが埋まる前に打ち切られてundefinedのままDBにINSERTされた（SQLiteのNOT NULL制約でクラッシュ）
- 解決: 長文ティアのmax_tokensを4096に引き上げ、かつJSON Schemaの`properties`順を`summary`が先頭に来るよう並び替え（途中切れの影響を最も重要なフィールドが受けにくくする）。さらに`result.summary`/`result.title`が欠けていた場合のフォールバックをAPI側に追加し、クラッシュを防ぐ
- 再発防止: LLMに「十分な文量」のように可変長の出力を求める時は、max_tokensに十分な余裕を持たせる。tool useで構造化出力させても、max_tokens到達によるレスポンス途中切れは起こりうるので、必須フィールドが欠けた場合のフォールバックは必ず入れる。DBのNOT NULLカラムに直結する値は特に、API層で型・空文字チェックをしてから渡す
