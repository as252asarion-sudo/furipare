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
