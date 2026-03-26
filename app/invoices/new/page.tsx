import PageHeader from '@/components/PageHeader'
import InvoiceForm from '@/components/InvoiceForm'

export default function NewInvoicePage() {
  return (
    <div className="p-8">
      <PageHeader title="請求書 新規作成" backHref="/invoices" />
      <InvoiceForm />
    </div>
  )
}
