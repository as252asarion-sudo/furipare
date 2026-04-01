import { notFound } from 'next/navigation'
import { getContract } from '@/lib/contracts'
import PageHeader from '@/components/PageHeader'
import ContractForm from '@/components/ContractForm'

export default async function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contract = await getContract(id)

  if (!contract) notFound()

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="契約書 編集" backHref="/contracts" />
      <ContractForm initial={contract} />
    </div>
  )
}
