export const metadata = {
  title: 'プライバシーポリシー | フリパレ',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-gray-500 mb-10">最終更新日：2026年4月9日</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">1. 事業者</h2>
        <p className="text-gray-700 leading-relaxed">
          ウラヤハカンパニー（以下「当社」）は、フリパレ（以下「本サービス」）の運営にあたり、ユーザーの個人情報を適切に保護するため、本プライバシーポリシーを定めます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">2. 収集する情報</h2>
        <p className="text-gray-700 leading-relaxed mb-2">当社は以下の情報を収集する場合があります。</p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>メールアドレス（アカウント登録時）</li>
          <li>氏名・会社名（書類作成時にユーザーが入力した情報）</li>
          <li>利用状況・アクセスログ（IPアドレス、ブラウザ種別、操作履歴など）</li>
          <li>決済情報（クレジットカード情報は当社では保持せず、Stripeが処理します）</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">3. 利用目的</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>本サービスの提供・運営</li>
          <li>お問い合わせ・サポート対応</li>
          <li>サービスの改善・新機能開発</li>
          <li>法令に基づく対応</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">4. 第三者提供</h2>
        <p className="text-gray-700 leading-relaxed mb-2">
          当社は、法令に基づく場合を除き、ユーザーの個人情報を第三者に提供しません。ただし、本サービスの運営にあたり以下の外部サービスを利用しており、それぞれのプライバシーポリシーに従ってデータが処理されます。
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Stripe, Inc.（決済処理）</li>
          <li>Vercel Inc.（ホスティング・インフラ）</li>
          <li>Supabase, Inc.（認証・データベース）</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">5. データの保管・削除</h2>
        <p className="text-gray-700 leading-relaxed">
          ユーザーが作成した書類データは、お使いのブラウザのlocalStorageに保存されます。当社のサーバーには保存されません。アカウント情報の削除をご希望の場合は、下記お問い合わせ先までメールにてご連絡ください。合理的な期間内に対応いたします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">6. Cookie・アクセス解析</h2>
        <p className="text-gray-700 leading-relaxed">
          本サービスでは、サービスの品質改善を目的として、Cookieおよびアクセス解析ツールを使用する場合があります。ブラウザの設定からCookieを無効化することができますが、一部機能が正常に動作しない場合があります。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">7. ポリシーの変更</h2>
        <p className="text-gray-700 leading-relaxed">
          本ポリシーを変更する場合は、本サービス上で事前に告知します。変更後も本サービスをご利用いただいた場合、変更後のポリシーに同意したものとみなします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">8. お問い合わせ</h2>
        <p className="text-gray-700 leading-relaxed">
          個人情報の取り扱いに関するご質問・削除のご依頼は、下記までお問い合わせください。
        </p>
        <p className="mt-2 text-gray-700">
          メール：<a href="mailto:as252asarion@gmail.com" className="text-indigo-600 underline">as252asarion@gmail.com</a>
        </p>
      </section>
    </main>
  )
}
