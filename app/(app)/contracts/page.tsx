import Link from 'next/link'
import { Plus, ScrollText, Trash2 } from 'lucide-react'
import { getContracts, deleteContract } from '@/lib/contracts'
import { getClients } from '@/lib/clients'
import PageHeader from '@/components/PageHeader'
import ContractsDeleteButton from '@/components/ContractsDeleteButton'

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft: { label: '下書き', cls: 'bg-neutral-100 text-neutral-600' },
  sent: { label: '送付済み', cls: 'bg-brand-subtle text-brand-primary' },
  signed: { label: '締結済み', cls: 'bg-success-bg text-success-text' },
}

export default async function ContractsPage() {
  const [contracts, clients] = await Promise.all([getContracts(), getClients()])
  const clientMap = Object.fromEntries(clients.map(c => [c.id, c]))

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="契約書"
        description="業務委託契約を管理します"
        action={
          <Link href="/contracts/new" className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
            <Plus size={14} /> 新規作成
          </Link>
        }
      />
      {contracts.length === 0 ? (
        <div className="bg-white rounded-lg border border-neutral-200 p-16 text-center text-neutral-300">
          <ScrollText size={40} className="mx-auto opacity-30" />
          <p className="text-neutral-500 font-medium mt-2">契約書がありません</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 border-b border-neutral-200">
              <tr>
                {['案件名', 'クライアント', '期間', 'ステータス', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {contracts.map(con => {
                const { label, cls } = STATUS_MAP[con.status] ?? { label: con.status, cls: 'bg-neutral-100 text-neutral-600' }
                return (
                  <tr key={con.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{con.projectName}</td>
                    <td className="px-4 py-3 text-neutral-500">{clientMap[con.clientId]?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">{con.startDate} 〜 {con.endDate}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span></td>
                    <td className="px-4 py-3 flex items-center gap-2 justify-end">
                      <Link href={`/contracts/${con.id}`} className="text-xs text-brand-primary hover:text-brand-dark font-medium px-2 py-1 rounded hover:bg-brand-subtle transition-colors">編集</Link>
                      <ContractsDeleteButton id={con.id} action={deleteContract} />
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
