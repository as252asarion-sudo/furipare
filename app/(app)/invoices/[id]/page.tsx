import { notFound } from 'next/navigation'
import { getInvoice } from '@/lib/invoices'
import PageHeader from '@/components/PageHeader'
import InvoiceForm from '@/components/InvoiceForm'

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await getInvoice(id)

  if (!invoice) notFound()

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="請求書 編集" backHref="/invoices" />
      <InvoiceForm initial={invoice} />
    </div>
  )
}
