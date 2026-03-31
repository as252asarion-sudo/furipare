import PageHeader from '@/components/PageHeader'
import ContractForm from '@/components/ContractForm'

export default function NewContractPage() {
  return (
    <div className="p-4 md:p-8">
      <PageHeader title="契約書 新規作成" backHref="/contracts" />
      <ContractForm />
    </div>
  )
}
