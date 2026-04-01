import { redirect } from 'next/navigation'
import { getInvoiceCount } from '@/lib/invoices'
import PageHeader from '@/components/PageHeader'
import InvoiceForm from '@/components/InvoiceForm'

const FREE_PLAN_LIMIT = 3

export default async function NewInvoicePage() {
  const count = await getInvoiceCount()
  if (count >= FREE_PLAN_LIMIT) {
    redirect('/invoices')
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="請求書 新規作成" backHref="/invoices" />
      <InvoiceForm />
    </div>
  )
}
