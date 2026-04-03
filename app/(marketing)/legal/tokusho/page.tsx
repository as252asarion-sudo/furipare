export const metadata = {
  title: '特定商取引法に基づく表記 | フリパレ',
}

export default function TokushoPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-8">特定商取引法に基づく表記</h1>
      <table className="w-full text-sm border-collapse">
        <tbody>
          {rows.map(({ label, value }) => (
            <tr key={label} className="border-t border-gray-200">
              <th className="py-4 pr-6 text-left align-top font-medium text-gray-600 whitespace-nowrap w-40">
                {label}
              </th>
              <td className="py-4 text-gray-800 whitespace-pre-wrap">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

const rows = [
  { label: '販売者名', value: 'ウラヤハカンパニー\n（個人情報は請求があり次第開示いたします）' },
  { label: '所在地', value: '東京都豊島区\n（住所は請求があり次第開示いたします）' },
  { label: '電話番号', value: '090-4788-1704\n（受付時間：平日 10:00〜18:00）' },
  { label: 'メールアドレス', value: 'as252asarion@gmail.com' },
  { label: 'サービス名', value: 'フリパレ' },
  { label: 'サービス内容', value: 'フリーランス向け見積書・請求書・契約書作成SaaS' },
  { label: 'サービスURL', value: 'https://www.furipare.com' },
  { label: '販売価格', value: '無料プラン：¥0／月\nアドバンスプラン：¥1,980／月（税込）' },
  { label: '支払方法', value: 'クレジットカード（Visa・Mastercard・American Express・JCB）' },
  { label: '支払時期', value: '月額プランは申込月より毎月自動課金' },
  { label: '役務の提供時期', value: '決済完了後、即時提供' },
  { label: '返品・キャンセル', value: 'サービスの性質上、原則として返金はお受けしておりません。\nアドバンスプランはいつでも解約可能です。解約後は次回請求日まで引き続きご利用いただけます。' },
  { label: '動作環境', value: '最新バージョンのChrome・Safari・Firefox・Edgeを推奨' },
]
