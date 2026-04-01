import Link from 'next/link'
import { Plus, Receipt } from 'lucide-react'
import { getInvoices, deleteInvoice } from '@/lib/invoices'
import PageHeader from '@/components/PageHeader'
import DocumentList from '@/components/DocumentList'
import InvoicesNewButton from '@/components/InvoicesNewButton'

const STATUS_MAP = {
  unpaid: { label: '未払い', cls: 'bg-yellow-100 text-yellow-700' },
  paid: { label: '入金済み', cls: 'bg-green-100 text-green-700' },
  overdue: { label: '期日超過', cls: 'bg-red-100 text-red-700' },
}

export default async function InvoicesPage() {
  const today = new Date().toISOString().slice(0, 10)
  const rawInvoices = await getInvoices()
  const invoices = rawInvoices.map(inv =>
    inv.status === 'unpaid' && inv.dueDate < today ? { ...inv, status: 'overdue' as const } : inv
  )
  const count = invoices.length

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="請求書"
        description="クライアントへの請求を管理します"
        action={<InvoicesNewButton count={count} />}
      />
      <DocumentList
        rows={invoices}
        editBase="/invoices"
        statusMap={STATUS_MAP}
        deleteAction={deleteInvoice}
        emptyLabel="請求書がありません"
        emptyIcon={<Receipt size={40} className="mx-auto opacity-30" />}
      />
    </div>
  )
}
