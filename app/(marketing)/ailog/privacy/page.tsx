export const metadata = {
  title: 'プライバシーポリシー | AIログ',
}

export default function AilogPrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-gray-500 mb-2">アプリ名：AIログ</p>
      <p className="text-sm text-gray-500 mb-10">最終更新日：2026年6月1日</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">1. 事業者</h2>
        <p className="text-gray-700 leading-relaxed">
          ウラヤハカンパニー（以下「当社」）は、AIログ（以下「本アプリ」）の運営にあたり、ユーザーの個人情報を適切に保護するため、本プライバシーポリシーを定めます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">2. 収集する情報</h2>
        <p className="text-gray-700 leading-relaxed mb-2">本アプリは以下の情報を利用します。</p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>ユーザーが貼り付けたテキスト（AIによる要約・分類目的のみ）</li>
          <li>ユーザーが作成したログ・ノートデータ（端末内にのみ保存）</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">3. 利用目的</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>テキストをAIで要約・カテゴリ分類・タイトル生成するため</li>
          <li>複数のログからノート（まとめ）を生成するため</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">4. 外部サービスへの送信</h2>
        <p className="text-gray-700 leading-relaxed mb-2">
          ユーザーが入力したテキストは、AI解析のためAnthropicのAI API（Claude）に送信されます。送信されたテキストデータはAnthropicのプライバシーポリシーに従って処理されます。テキストは解析目的以外に使用されず、当社のサーバーには保存されません。
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Anthropic, PBC（AI解析処理）</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">5. データの保管</h2>
        <p className="text-gray-700 leading-relaxed">
          ログ・ノートなどのユーザーデータは、お使いの端末内にのみ保存されます。当社のサーバーには送信・保存されません。アプリをアンインストールするとすべてのデータが削除されます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">6. 第三者への提供</h2>
        <p className="text-gray-700 leading-relaxed">
          当社は、法令に基づく場合を除き、ユーザーの情報を第三者に提供しません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">7. ポリシーの変更</h2>
        <p className="text-gray-700 leading-relaxed">
          本ポリシーを変更する場合は、本ページ上で告知します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">8. お問い合わせ</h2>
        <p className="text-gray-700 leading-relaxed">
          個人情報の取り扱いに関するご質問は、下記までお問い合わせください。
        </p>
        <p className="mt-2 text-gray-700">
          メール：<a href="mailto:as252asarion@gmail.com" className="text-indigo-600 underline">as252asarion@gmail.com</a>
        </p>
      </section>
    </main>
  )
}
