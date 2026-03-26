export type Profession = 'designer' | 'writer' | 'video' | 'engineer' | 'other'

export const PROFESSIONS: Record<Profession, string> = {
  designer: 'デザイナー',
  writer: 'ライター',
  video: '動画編集者',
  engineer: 'エンジニア',
  other: 'その他',
}

export interface Client {
  id: string
  name: string
  contactName: string
  email: string
  address: string
  createdAt: string
}

export interface EstimateItem {
  description: string
  quantity: number
  unit: string
  unitPrice: number
}

export interface Estimate {
  id: string
  clientId: string
  projectName: string
  profession: Profession
  items: EstimateItem[]
  taxRate: number
  withholdingTax: boolean
  note: string
  validUntil: string
  status: 'draft' | 'sent' | 'approved' | 'rejected'
  createdAt: string
}

export interface Invoice {
  id: string
  estimateId?: string
  clientId: string
  projectName: string
  profession: Profession
  items: EstimateItem[]
  taxRate: number
  withholdingTax: boolean
  note: string
  dueDate: string
  status: 'unpaid' | 'paid' | 'overdue'
  createdAt: string
}

export interface Contract {
  id: string
  clientId: string
  projectName: string
  profession: Profession
  startDate: string
  endDate: string
  amount: number
  revisionCount: number
  copyrightOwner: 'client' | 'freelancer'
  portfolioAllowed: boolean
  note: string
  status: 'draft' | 'sent' | 'signed'
  createdAt: string
}

export interface AppData {
  clients: Client[]
  estimates: Estimate[]
  invoices: Invoice[]
  contracts: Contract[]
  myName: string
  myAddress: string
  myEmail: string
  myBankInfo: string
}
