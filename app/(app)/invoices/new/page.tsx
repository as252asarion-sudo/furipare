import { redirect } from 'next/navigation'
import { checkLimit } from '@/lib/checkLimit'
import PageHeader from '@/components/PageHeader'
import InvoiceForm from '@/components/InvoiceForm'

export default async function NewInvoicePage() {
  const result = await checkLimit('invoices')
  if (!result.ok) {
    redirect('/invoices')
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="請求書 新規作成" backHref="/invoices" />
      <InvoiceForm />
    </div>
  )
}
