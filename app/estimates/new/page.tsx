import PageHeader from '@/components/PageHeader'
import EstimateForm from '@/components/EstimateForm'

export default function NewEstimatePage() {
  return (
    <div className="p-8">
      <PageHeader title="見積書 新規作成" backHref="/estimates" />
      <EstimateForm />
    </div>
  )
}
