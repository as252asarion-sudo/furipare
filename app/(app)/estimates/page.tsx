'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { getEstimates, deleteEstimate } from '@/lib/store'
import type { Estimate } from '@/lib/types'
import PageHeader from '@/components/PageHeader'
import DocumentList from '@/components/DocumentList'

const STATUS_MAP = {
  draft: { label: '下書き', cls: 'bg-slate-100 text-slate-600' },
  sent: { label: '送付済み', cls: 'bg-blue-100 text-blue-700' },
  approved: { label: '承認済み', cls: 'bg-green-100 text-green-700' },
  rejected: { label: '却下', cls: 'bg-red-100 text-red-700' },
}

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([])
  useEffect(() => { setEstimates(getEstimates()) }, [])

  function handleDelete(id: string) {
    if (!confirm('削除しますか？')) return
    deleteEstimate(id)
    setEstimates(getEstimates())
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="見積書"
        description="クライアントへの見積もりを管理します"
        action={
          <Link href="/estimates/new" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={14} /> 新規作成
          </Link>
        }
      />
      <DocumentList
        rows={estimates}
        editBase="/estimates"
        statusMap={STATUS_MAP}
        onDelete={handleDelete}
        emptyLabel="見積書がありません"
        emptyIcon={<FileText size={40} className="mx-auto opacity-30" />}
      />
    </div>
  )
}
