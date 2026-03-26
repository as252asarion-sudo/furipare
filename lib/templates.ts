import { Profession, EstimateItem } from './types'

export interface Template {
  items: EstimateItem[]
  contractClauses: string[]
  revisionDefault: number
}

export const TEMPLATES: Record<Profession, Template> = {
  designer: {
    items: [
      { description: 'デザイン制作費', quantity: 1, unit: '式', unitPrice: 50000 },
      { description: '修正対応（●回まで込み）', quantity: 1, unit: '式', unitPrice: 0 },
      { description: '最終データ納品', quantity: 1, unit: '式', unitPrice: 0 },
    ],
    contractClauses: [
      '成果物の著作権は、代金の支払い完了をもってクライアントに帰属します。',
      '修正は●回まで本見積に含みます。超過分は1回あたり●円で別途請求します。',
      '納品物のポートフォリオ掲載については、クライアントの事前承諾を要します。',
      '公序良俗に反する用途への使用を禁止します。',
    ],
    revisionDefault: 3,
  },
  writer: {
    items: [
      { description: '記事執筆（●文字）', quantity: 1, unit: '本', unitPrice: 30000 },
      { description: '構成案作成', quantity: 1, unit: '式', unitPrice: 5000 },
      { description: 'リサーチ・取材費', quantity: 1, unit: '式', unitPrice: 0 },
    ],
    contractClauses: [
      '成果物の著作権は、代金の支払い完了をもってクライアントに帰属します。',
      '二次使用・転載・改変については、事前に書面での承諾を要します。',
      'AI生成コンテンツを含む場合は、事前にクライアントへ通知・承諾を得るものとします。',
      '公開後の削除・修正依頼には応じかねます（軽微な誤字修正を除く）。',
    ],
    revisionDefault: 2,
  },
  video: {
    items: [
      { description: '動画編集費（●分）', quantity: 1, unit: '本', unitPrice: 30000 },
      { description: 'テロップ挿入', quantity: 1, unit: '式', unitPrice: 5000 },
      { description: 'BGM・SE選定', quantity: 1, unit: '式', unitPrice: 3000 },
      { description: 'カラーグレーディング', quantity: 1, unit: '式', unitPrice: 5000 },
    ],
    contractClauses: [
      '修正は●回まで本見積に含みます。超過分は1回あたり●円で別途請求します。',
      '使用素材・BGMの著作権処理はクライアントの責任において行うものとします。',
      '納品形式はMP4（H.264）、解像度●とします。別形式での納品は別途費用が発生します。',
      '公開後の削除・再編集依頼は別途費用が発生します。',
    ],
    revisionDefault: 2,
  },
  engineer: {
    items: [
      { description: '要件定義・設計', quantity: 3, unit: '人日', unitPrice: 40000 },
      { description: '開発実装', quantity: 10, unit: '人日', unitPrice: 40000 },
      { description: 'テスト・デバッグ', quantity: 2, unit: '人日', unitPrice: 40000 },
      { description: '納品・ドキュメント作成', quantity: 1, unit: '人日', unitPrice: 40000 },
    ],
    contractClauses: [
      '本契約に基づき開発されたソースコードの著作権は、代金の支払い完了をもってクライアントに帰属します。',
      '開発に使用したオープンソースライブラリは各ライセンスに従います。',
      '仕様変更が生じた場合は、別途見積もりを提示し、クライアントの承諾を得た上で対応します。',
      '瑕疵担保責任の期間は納品後●ヶ月とします。',
      '保守・運用サポートは本契約の対象外とし、別途契約が必要です。',
    ],
    revisionDefault: 1,
  },
  other: {
    items: [
      { description: '業務委託費', quantity: 1, unit: '式', unitPrice: 50000 },
    ],
    contractClauses: [
      '本業務に関する著作権・知的財産権の帰属については、別途協議の上定めます。',
      '成果物の検収期間は納品後●日以内とします。',
      '本契約に定めのない事項については、甲乙誠意をもって協議し解決するものとします。',
    ],
    revisionDefault: 2,
  },
}
