'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, ScrollText, Trash2 } from 'lucide-react'
import { getContracts, getClients, deleteContract } from '@/lib/store'
import type { Contract, Client } from '@/lib/types'
import PageHeader from '@/components/PageHeader'

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft: { label: '下書き', cls: 'bg-slate-100 text-slate-600' },
  sent: { label: '送付済み', cls: 'bg-blue-100 text-blue-700' },
  signed: { label: '締結済み', cls: 'bg-green-100 text-green-700' },
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [clientMap, setClientMap] = useState<Record<string, Client>>({})

  useEffect(() => {
    setContracts(getContracts())
    const map: Record<string, Client> = {}
    getClients().forEach(c => { map[c.id] = c })
    setClientMap(map)
  }, [])

  function handleDelete(id: string) {
    if (!confirm('削除しますか？')) return
    deleteContract(id)
    setContracts(getContracts())
  }

  return (
    <div className="p-8">
      <PageHeader
        title="契約書"
        description="業務委託契約を管理します"
        action={
          <Link href="/contracts/new" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={14} /> 新規作成
          </Link>
        }
      />
      {contracts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-400">
          <ScrollText size={40} className="mx-auto opacity-30" />
          <p className="text-slate-500 font-medium mt-2">契約書がありません</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['案件名', 'クライアント', '期間', 'ステータス', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.map(con => {
                const { label, cls } = STATUS_MAP[con.status] ?? { label: con.status, cls: 'bg-slate-100 text-slate-600' }
                return (
                  <tr key={con.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{con.projectName}</td>
                    <td className="px-4 py-3 text-slate-500">{clientMap[con.clientId]?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{con.startDate} 〜 {con.endDate}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span></td>
                    <td className="px-4 py-3 flex items-center gap-2 justify-end">
                      <Link href={`/contracts/${con.id}`} className="text-xs text-indigo-600 hover:underline px-2 py-1 rounded border border-indigo-200 hover:bg-indigo-50">編集</Link>
                      <button onClick={() => handleDelete(con.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
