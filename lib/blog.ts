export type BlogPost = {
  slug: string
  title: string
  description: string
  publishedAt: string
  content: string // Markdown風のHTMLを直接書く
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'fukugyo-seikyusho-kakikata',
    title: '副業の請求書の書き方を完全解説｜源泉徴収の計算方法も',
    description: '副業で初めて請求書を書く方向けに、書き方の基本から源泉徴収の計算・フリパレでの作成方法までわかりやすく解説します。',
    publishedAt: '2026-03-27',
    content: `
<h2>副業で請求書が必要になったら</h2>
<p>会社員として副業を始めると、取引先から「請求書を送ってください」と言われることがあります。でも初めての請求書、何を書けばいいのかわからない方も多いはず。この記事では、副業の請求書に必要な項目から源泉徴収の計算方法まで、わかりやすく解説します。</p>

<h2>副業の請求書に必要な項目</h2>
<p>請求書には以下の項目が必要です。</p>
<ul>
  <li><strong>書類のタイトル</strong>：「請求書」と明記する</li>
  <li><strong>発行日</strong>：請求書を作成・送付した日付</li>
  <li><strong>請求番号</strong>：管理のための通し番号（任意だが推奨）</li>
  <li><strong>請求先の情報</strong>：会社名・担当者名</li>
  <li><strong>自分の情報</strong>：氏名・住所・連絡先</li>
  <li><strong>請求内容の明細</strong>：作業内容・単価・数量・金額</li>
  <li><strong>合計金額</strong>：税込で記載</li>
  <li><strong>振込先口座</strong>：金融機関名・口座種別・口座番号</li>
  <li><strong>支払い期限</strong>：例「〇月〇日までにお振込みください」</li>
</ul>

<h2>源泉徴収とは？副業で関係するケース</h2>
<p>デザイナー・ライター・エンジニアなど、個人として「特定の業務」を請け負う場合、報酬から源泉徴収税が差し引かれることがあります。</p>
<p>源泉徴収の税率は <strong>報酬の10.21%</strong>（100万円超の部分は20.42%）です。</p>
<p>たとえば、5万円の報酬を請求する場合：</p>
<ul>
  <li>報酬：50,000円</li>
  <li>源泉徴収額：50,000円 × 10.21% ＝ 5,105円</li>
  <li>実際の振込金額：50,000円 − 5,105円 ＝ <strong>44,895円</strong></li>
</ul>
<p>請求書には「源泉徴収税額」を明記し、合計金額から差し引いた「お振込み金額」を記載するのが一般的です。</p>

<h2>インボイス制度（適格請求書）への対応</h2>
<p>2023年10月から始まったインボイス制度。取引先が消費税の仕入税額控除を受けるには、適格請求書発行事業者（登録番号あり）からの請求書が必要になりました。</p>
<p>副業の規模が小さい場合は免税事業者のままでも問題ないケースが多いですが、法人クライアントとの取引が多い場合は登録を検討しましょう。</p>

<h2>請求書の管理が大変になってきたら</h2>
<p>副業の案件が増えてくると、請求書・見積書・契約書の管理が煩雑になりがちです。Excelで管理していると「どのファイルが最新か」「どの案件の請求書か」がわからなくなることも。</p>
<p><strong>フリパレ</strong>は、フリーランス・副業ワーカーのために作られた無料の書類管理ツールです。見積書・請求書・契約書をブラウザだけで作成・管理でき、源泉徴収の自動計算・PDF出力にも対応しています。</p>
    `,
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts
}
