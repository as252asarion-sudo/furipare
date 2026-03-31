'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Receipt } from 'lucide-react'
import { getInvoices, deleteInvoice } from '@/lib/store'
import type { Invoice } from '@/lib/types'
import PageHeader from '@/components/PageHeader'
import DocumentList from '@/components/DocumentList'
import InvoiceLimitModal from '@/components/InvoiceLimitModal'

const STATUS_MAP = {
  unpaid: { label: '未払い', cls: 'bg-yellow-100 text-yellow-700' },
  paid: { label: '入金済み', cls: 'bg-green-100 text-green-700' },
  overdue: { label: '期日超過', cls: 'bg-red-100 text-red-700' },
}

const FREE_PLAN_LIMIT = 3

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showLimitModal, setShowLimitModal] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const invs = getInvoices().map(inv =>
      inv.status === 'unpaid' && inv.dueDate < today ? { ...inv, status: 'overdue' as const } : inv
    )
    setInvoices(invs)
  }, [])

  function handleDelete(id: string) {
    if (!confirm('削除しますか？')) return
    deleteInvoice(id)
    setInvoices(getInvoices())
  }

  function handleNewClick(e: React.MouseEvent) {
    if (getInvoices().length >= FREE_PLAN_LIMIT) {
      e.preventDefault()
      setShowLimitModal(true)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="請求書"
        description="クライアントへの請求を管理します"
        action={
          <Link
            href="/invoices/new"
            onClick={handleNewClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={14} /> 新規作成
          </Link>
        }
      />
      <DocumentList
        rows={invoices}
        editBase="/invoices"
        statusMap={STATUS_MAP}
        onDelete={handleDelete}
        emptyLabel="請求書がありません"
        emptyIcon={<Receipt size={40} className="mx-auto opacity-30" />}
      />
      {showLimitModal && <InvoiceLimitModal onClose={() => setShowLimitModal(false)} />}
    </div>
  )
}
