export const metadata = {
  title: '利用規約 | フリパレ',
}

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2">利用規約</h1>
      <p className="text-sm text-gray-500 mb-10">最終更新日：2026年4月9日</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">1. 総則</h2>
        <p className="text-gray-700 leading-relaxed">
          本利用規約（以下「本規約」）は、ウラヤハカンパニー（以下「当社」）が提供するフリパレ（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意のうえ本サービスをご利用ください。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">2. サービス概要</h2>
        <p className="text-gray-700 leading-relaxed">
          フリパレは、フリーランス・個人事業主向けに見積書・請求書・契約書などのビジネス書類を作成・管理できるSaaSサービスです。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">3. 利用条件</h2>
        <p className="text-gray-700 leading-relaxed">
          本サービスは、18歳以上かつ日本国内在住のフリーランス・個人事業主を対象としています。これらの条件を満たさない方はご利用いただけません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">4. 料金プラン</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>無料プラン：¥0／月（基本機能をご利用いただけます）</li>
          <li>アドバンスプラン：¥1,980／月（税込）（すべての機能をご利用いただけます）</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-2">
          料金・プラン内容は予告なく変更される場合があります。変更時はサービス上で事前に告知します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">5. 支払い</h2>
        <p className="text-gray-700 leading-relaxed">
          アドバンスプランの料金は、申込月より毎月自動的に課金されます。お支払いはクレジットカード（Visa・Mastercard・American Express・JCB）のみご利用いただけます。決済はStripe, Inc.が処理します。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">6. キャンセル・返金</h2>
        <p className="text-gray-700 leading-relaxed">
          アドバンスプランはいつでも解約できます。解約後は次回請求日まで引き続きご利用いただけます。サービスの性質上、原則として既にお支払いいただいた料金の返金はお受けしておりません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">7. 禁止事項</h2>
        <p className="text-gray-700 leading-relaxed mb-2">ユーザーは以下の行為を行ってはなりません。</p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>法令または公序良俗に違反する行為</li>
          <li>不正アクセスやサーバーへの過度な負荷をかける行為</li>
          <li>他のユーザーや第三者の権利を侵害する行為</li>
          <li>本サービスのコンテンツを商業目的で無断転用・複製する行為</li>
          <li>その他、当社が不適切と判断する行為</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">8. 免責事項</h2>
        <p className="text-gray-700 leading-relaxed">
          当社は、本サービスの停止・中断・データの損失・その他本サービスの利用に起因して生じた損害について、当社の故意または重大な過失による場合を除き、責任を負いません。また、本サービスは現状有姿で提供されるものであり、特定の目的への適合性を保証するものではありません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">9. 準拠法・管轄裁判所</h2>
        <p className="text-gray-700 leading-relaxed">
          本規約は日本法に準拠します。本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">10. お問い合わせ</h2>
        <p className="text-gray-700 leading-relaxed">
          本規約に関するご質問は、下記までお問い合わせください。
        </p>
        <p className="mt-2 text-gray-700">
          メール：<a href="mailto:as252asarion@gmail.com" className="text-indigo-600 underline">as252asarion@gmail.com</a>
        </p>
      </section>
    </main>
  )
}
