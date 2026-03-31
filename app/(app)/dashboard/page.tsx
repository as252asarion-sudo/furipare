'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Receipt, ScrollText, Users, TrendingUp, AlertCircle, Plus } from 'lucide-react'
import { getEstimates, getInvoices, getContracts, getClients, fmt, calcSubtotal, calcTax, calcTotal } from '@/lib/store'
import type { Invoice } from '@/lib/types'

export default function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0, estimates: 0, invoices: 0, contracts: 0,
    unpaidAmount: 0, overdueCount: 0, monthIncome: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    const clients = getClients()
    const estimates = getEstimates()
    const invoices = getInvoices()
    const contracts = getContracts()
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    let unpaidAmount = 0, overdueCount = 0, monthIncome = 0
    invoices.forEach(inv => {
      const sub = calcSubtotal(inv.items)
      const total = calcTotal(sub, calcTax(sub, inv.taxRate), inv.withholdingTax)
      if (inv.status === 'unpaid') {
        unpaidAmount += total
        if (inv.dueDate < now.toISOString().slice(0, 10)) overdueCount++
      }
      if (inv.status === 'paid' && inv.createdAt >= monthStart) monthIncome += total
    })
    setStats({ clients: clients.length, estimates: estimates.length, invoices: invoices.length, contracts: contracts.length, unpaidAmount, overdueCount, monthIncome })
    setRecentInvoices(invoices.slice(0, 5))
  }, [])

  const cards = [
    { label: 'クライアント', value: stats.clients, icon: Users, href: '/clients', color: 'bg-blue-500' },
    { label: '見積書', value: stats.estimates, icon: FileText, href: '/estimates', color: 'bg-violet-500' },
    { label: '請求書', value: stats.invoices, icon: Receipt, href: '/invoices', color: 'bg-emerald-500' },
    { label: '契約書', value: stats.contracts, icon: ScrollText, href: '/contracts', color: 'bg-orange-500' },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">ダッシュボード</h1>
        <p className="text-slate-500 text-sm mt-1">ウラヤハカンパニー の業務状況</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <TrendingUp size={14} /> 今月の入金額
          </div>
          <p className="text-3xl font-bold text-slate-800">¥{fmt(stats.monthIncome)}</p>
        </div>
        <div className={`rounded-xl border p-5 ${stats.overdueCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <AlertCircle size={14} className={stats.overdueCount > 0 ? 'text-red-500' : ''} />
            入金待ち（期日超過 {stats.overdueCount}件）
          </div>
          <p className={`text-3xl font-bold ${stats.overdueCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
            ¥{fmt(stats.unpaidAmount)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={href} href={href} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className={`${color} w-9 h-9 rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={16} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-slate-500 text-sm">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">クイックアクション</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/estimates/new', label: '見積書を作成', color: 'bg-indigo-600 hover:bg-indigo-700' },
            { href: '/invoices/new', label: '請求書を作成', color: 'bg-emerald-600 hover:bg-emerald-700' },
            { href: '/contracts/new', label: '契約書を作成', color: 'bg-orange-600 hover:bg-orange-700' },
            { href: '/clients/new', label: 'クライアント追加', color: 'bg-blue-600 hover:bg-blue-700' },
          ].map(({ href, label, color }) => (
            <Link key={href} href={href} className={`${color} text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}>
              <Plus size={14} />{label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">最近の請求書</h2>
        {recentInvoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">
            <Receipt size={32} className="mx-auto mb-2 opacity-30" />
            <p>まだ請求書がありません</p>
            <Link href="/invoices/new" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">最初の請求書を作成する →</Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['案件名', '作成日', '支払期日', 'ステータス'].map(h => <th key={h} className="text-left px-4 py-3 text-slate-600 font-medium text-xs">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{inv.projectName}</td>
                    <td className="px-4 py-3 text-slate-500">{inv.createdAt.slice(0, 10)}</td>
                    <td className="px-4 py-3 text-slate-500">{inv.dueDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} dueDate={inv.dueDate} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status, dueDate }: { status: string; dueDate: string }) {
  const today = new Date().toISOString().slice(0, 10)
  const overdue = status === 'unpaid' && dueDate < today
  const map: Record<string, { label: string; cls: string }> = {
    unpaid: { label: overdue ? '期日超過' : '未払い', cls: overdue ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700' },
    paid: { label: '入金済み', cls: 'bg-green-100 text-green-700' },
    overdue: { label: '期日超過', cls: 'bg-red-100 text-red-700' },
  }
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-600' }
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>
}
