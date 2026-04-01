import { notFound } from 'next/navigation'
import { getClient } from '@/lib/clients'
import PageHeader from '@/components/PageHeader'
import ClientForm from '@/components/ClientForm'

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const client = await getClient(id)

  if (!client) notFound()

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="クライアント編集" backHref="/clients" />
      <ClientForm initial={client} />
    </div>
  )
}
