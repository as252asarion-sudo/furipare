'use client'
import Link from 'next/link'
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
  onDelete: (id: string) => void
  emptyLabel: string
  emptyIcon: React.ReactNode
}

export default function DocumentList({ rows, editBase, statusMap, onDelete, emptyLabel, emptyIcon }: Props) {
  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-400">
        {emptyIcon}
        <p className="text-slate-500 font-medium mt-2">{emptyLabel}</p>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {['案件名', '作成日', '金額（税込）', 'ステータス', ''].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(row => {
            const sub = calcSubtotal(row.items)
            const total = calcTotal(sub, calcTax(sub, row.taxRate), row.withholdingTax)
            const { label, cls } = statusMap[row.status] ?? { label: row.status, cls: 'bg-slate-100 text-slate-600' }
            return (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{row.projectName}</td>
                <td className="px-4 py-3 text-slate-500">{row.createdAt.slice(0, 10)}</td>
                <td className="px-4 py-3 font-mono text-slate-700">¥{fmt(total)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>
                </td>
                <td className="px-4 py-3 flex items-center gap-2 justify-end">
                  <Link href={`${editBase}/${row.id}`} className="text-xs text-indigo-600 hover:underline px-2 py-1 rounded border border-indigo-200 hover:bg-indigo-50">編集</Link>
                  <button onClick={() => onDelete(row.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50">
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
