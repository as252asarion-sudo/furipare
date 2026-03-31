import PageHeader from '@/components/PageHeader'
import ClientForm from '@/components/ClientForm'

export default function NewClientPage() {
  return (
    <div className="p-4 md:p-8">
      <PageHeader title="クライアント追加" backHref="/clients" />
      <ClientForm />
    </div>
  )
}
