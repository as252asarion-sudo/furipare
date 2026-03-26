'use client'
import { useEffect, useState } from 'react'
import { getInvoices } from '@/lib/store'
import type { Invoice } from '@/lib/types'
import PageHeader from '@/components/PageHeader'
import InvoiceForm from '@/components/InvoiceForm'

export default function EditInvoicePage({ params }: PageProps<'/invoices/[id]'>) {
  const [invoice, setInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      const inv = getInvoices().find(x => x.id === id)
      setInvoice(inv ?? null)
    })
  }, [params])

  if (!invoice) return <div className="p-8 text-slate-400">読み込み中...</div>

  return (
    <div className="p-8">
      <PageHeader title="請求書 編集" backHref="/invoices" />
      <InvoiceForm initial={invoice} />
    </div>
  )
}
