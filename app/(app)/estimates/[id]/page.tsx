import { notFound } from 'next/navigation'
import { getEstimate } from '@/lib/quotes'
import PageHeader from '@/components/PageHeader'
import EstimateForm from '@/components/EstimateForm'

export default async function EditEstimatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const estimate = await getEstimate(id)

  if (!estimate) notFound()

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="見積書 編集" backHref="/estimates" />
      <EstimateForm initial={estimate} />
    </div>
  )
}
