'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { fmt, calcSubtotal, calcTax, calcTotal } from '@/lib/store'
import type { EstimateItem } from '@/lib/types'

interface Row {
  id: string
  projectName: string
  createdAt: string
  status: string
  items: EstimateItem[]
  taxRate: number
  withholdingTax: boolean
  badge?: string
  dueDate?: string
}

interface Props {
  rows: Row[]
  editBase: string
  statusMap: Record<string, { label: string; cls: string }>
  deleteAction: (id: string) => Promise<void>
  emptyLabel: string
  emptyIcon: React.ReactNode
}

export default function DocumentList({ rows, editBase, statusMap, deleteAction, emptyLabel, emptyIcon }: Props) {
  const router = useRouter()

  async function handleDelete(id: string) {
    if (!confirm('削除しますか？')) return
    await deleteAction(id)
    router.refresh()
  }

  if (rows.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-16 text-center">
        <div className="text-neutral-300">{emptyIcon}</div>
        <p className="text-neutral-500 font-medium mt-2">{emptyLabel}</p>
      </div>
    )
  }
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden overflow-x-auto">
      <table className="w-full text-sm min-w-[560px]">
        <thead className="bg-neutral-100 border-b border-neutral-200">
          <tr>
            {['案件名', '作成日', '金額（税込）', 'ステータス', ''].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.map(row => {
            const sub = calcSubtotal(row.items)
            const total = calcTotal(sub, calcTax(sub, row.taxRate), row.withholdingTax)
            const { label, cls } = statusMap[row.status] ?? { label: row.status, cls: 'bg-neutral-100 text-neutral-600' }
            return (
              <tr key={row.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-neutral-900">{row.projectName}</td>
                <td className="px-4 py-3 text-neutral-500">{row.createdAt.slice(0, 10)}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-neutral-700">¥{fmt(total)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>
                </td>
                <td className="px-4 py-3 flex items-center gap-2 justify-end">
                  <Link href={`${editBase}/${row.id}`} className="text-xs text-brand-primary hover:text-brand-dark font-medium px-2 py-1 rounded hover:bg-brand-subtle transition-colors">編集</Link>
                  <button onClick={() => handleDelete(row.id)} className="text-neutral-400 hover:text-danger-text p-1.5 rounded hover:bg-danger-bg transition-colors">
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
