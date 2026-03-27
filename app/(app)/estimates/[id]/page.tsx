'use client'
import { useEffect, useState } from 'react'
import { getEstimates } from '@/lib/store'
import type { Estimate } from '@/lib/types'
import PageHeader from '@/components/PageHeader'
import EstimateForm from '@/components/EstimateForm'

export default function EditEstimatePage({ params }: PageProps<'/estimates/[id]'>) {
  const [estimate, setEstimate] = useState<Estimate | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      const e = getEstimates().find(x => x.id === id)
      setEstimate(e ?? null)
    })
  }, [params])

  if (!estimate) return <div className="p-8 text-slate-400">読み込み中...</div>

  return (
    <div className="p-8">
      <PageHeader title="見積書 編集" backHref="/estimates" />
      <EstimateForm initial={estimate} />
    </div>
  )
}
