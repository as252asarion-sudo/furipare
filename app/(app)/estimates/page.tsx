import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { getEstimates, deleteEstimate } from '@/lib/quotes'
import PageHeader from '@/components/PageHeader'
import DocumentList from '@/components/DocumentList'

const STATUS_MAP = {
  draft: { label: '下書き', cls: 'bg-neutral-100 text-neutral-600' },
  sent: { label: '送付済み', cls: 'bg-brand-subtle text-brand-primary' },
  approved: { label: '承認済み', cls: 'bg-success-bg text-success-text' },
  rejected: { label: '却下', cls: 'bg-danger-bg text-danger-text' },
}

export default async function EstimatesPage() {
  const estimates = await getEstimates()

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="見積書"
        description="クライアントへの見積もりを管理します"
        action={
          <Link href="/estimates/new" className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
            <Plus size={14} /> 新規作成
          </Link>
        }
      />
      <DocumentList
        rows={estimates}
        editBase="/estimates"
        statusMap={STATUS_MAP}
        deleteAction={deleteEstimate}
        emptyLabel="見積書がありません"
        emptyIcon={<FileText size={40} className="mx-auto opacity-30" />}
      />
    </div>
  )
}
