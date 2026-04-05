import { Suspense } from 'react'
import Link from 'next/link'
import { FileText, Receipt, ScrollText, Users, TrendingUp, AlertCircle, Plus } from 'lucide-react'
import { getEstimates } from '@/lib/quotes'
import { getInvoices } from '@/lib/invoices'
import { getContracts } from '@/lib/contracts'
import { getClients } from '@/lib/clients'
import { fmt, calcSubtotal, calcTax, calcTotal } from '@/lib/calc'
import { getUsageSummary } from '@/lib/checkLimit'
import UpgradedToast from '@/components/UpgradedToast'

export default async function Dashboard() {
  const [clients, estimates, invoices, contracts, usage] = await Promise.all([
    getClients(),
    getEstimates(),
    getInvoices(),
    getContracts(),
    getUsageSummary(),
  ])

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const today = now.toISOString().slice(0, 10)

  let unpaidAmount = 0, overdueCount = 0, monthIncome = 0
  invoices.forEach(inv => {
    const sub = calcSubtotal(inv.items)
    const total = calcTotal(sub, calcTax(sub, inv.taxRate), inv.withholdingTax)
    if (inv.status === 'unpaid') {
      unpaidAmount += total
      if (inv.dueDate < today) overdueCount++
    }
    if (inv.status === 'paid' && inv.createdAt >= monthStart) monthIncome += total
  })

  const recentInvoices = invoices.slice(0, 5)

  const cards = [
    { label: 'クライアント', value: clients.length, icon: Users, href: '/clients' },
    { label: '見積書', value: estimates.length, icon: FileText, href: '/estimates' },
    { label: '請求書', value: invoices.length, icon: Receipt, href: '/invoices' },
    { label: '契約書', value: contracts.length, icon: ScrollText, href: '/contracts' },
  ]

  return (
    <>
    <Suspense fallback={null}>
      <UpgradedToast />
    </Suspense>
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">ダッシュボード</h1>
        <p className="text-neutral-500 text-sm mt-1">ウラヤハカンパニー の業務状況</p>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-neutral-200 rounded-lg p-5">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
            <TrendingUp size={14} /> 今月の入金額
          </div>
          <p className="text-3xl font-bold text-neutral-900 tabular-nums">¥{fmt(monthIncome)}</p>
        </div>
        <div className={`rounded-lg border p-5 ${overdueCount > 0 ? 'bg-danger-bg border-danger-border' : 'bg-white border-neutral-200'}`}>
          <div className="flex items-center gap-2 text-neutral-500 text-sm mb-1">
            <AlertCircle size={14} className={overdueCount > 0 ? 'text-danger-text' : ''} />
            入金待ち（期日超過 {overdueCount}件）
          </div>
          <p className={`text-3xl font-bold tabular-nums ${overdueCount > 0 ? 'text-danger-text' : 'text-neutral-900'}`}>
            ¥{fmt(unpaidAmount)}
          </p>
        </div>
      </div>

      {/* カウントカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link key={href} href={href} className="bg-white border border-neutral-200 rounded-lg p-5 hover:border-brand-muted transition-colors">
            <div className="bg-neutral-100 w-8 h-8 rounded-md flex items-center justify-center mb-3">
              <Icon size={16} className="text-neutral-500" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 tabular-nums">{value}</p>
            <p className="text-neutral-500 text-sm">{label}</p>
          </Link>
        ))}
      </div>

      {/* 使用状況 */}
      {usage && usage.plan === 'free' && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">今月の使用状況（無料プラン）</h2>
          <div className="bg-white border border-neutral-200 rounded-lg p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: '請求書', data: usage.invoices, unit: '枚' },
              { label: '見積書', data: usage.quotes, unit: '枚' },
              { label: '契約書', data: usage.contracts, unit: '件' },
              { label: 'クライアント', data: usage.clients, unit: '件' },
            ].map(({ label, data, unit }) => {
              const pct = Math.min((data.current / data.limit) * 100, 100)
              const isAtLimit = data.current >= data.limit
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-500">{label}</span>
                    <span className={`text-xs font-semibold ${isAtLimit ? 'text-danger-text' : 'text-neutral-700'}`}>
                      {data.current}/{data.limit}{unit}
                    </span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isAtLimit ? 'bg-danger-text' : 'bg-brand-primary'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* クイックアクション */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">クイックアクション</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/estimates/new" className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
            <Plus size={14} />見積書を作成
          </Link>
          <Link href="/invoices/new" className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
            <Plus size={14} />請求書を作成
          </Link>
          <Link href="/contracts/new" className="bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
            <Plus size={14} />契約書を作成
          </Link>
          <Link href="/clients/new" className="bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
            <Plus size={14} />クライアント追加
          </Link>
        </div>
      </div>

      {/* 最近の請求書 */}
      <div>
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">最近の請求書</h2>
        {recentInvoices.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-10 text-center">
            <Receipt size={32} className="mx-auto mb-2 text-neutral-300" />
            <p className="text-neutral-500">まだ請求書がありません</p>
            <Link href="/invoices/new" className="text-brand-primary text-sm mt-2 inline-block hover:text-brand-dark transition-colors">最初の請求書を作成する →</Link>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-neutral-100 border-b border-neutral-200">
                <tr>{['案件名', '作成日', '支払期日', 'ステータス'].map(h => <th key={h} className="text-left px-4 py-3 text-neutral-500 font-medium text-xs uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{inv.projectName}</td>
                    <td className="px-4 py-3 text-neutral-500">{inv.createdAt.slice(0, 10)}</td>
                    <td className="px-4 py-3 text-neutral-500">{inv.dueDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} dueDate={inv.dueDate} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

function StatusBadge({ status, dueDate }: { status: string; dueDate: string }) {
  const today = new Date().toISOString().slice(0, 10)
  const overdue = status === 'unpaid' && dueDate < today
  const map: Record<string, { label: string; cls: string }> = {
    unpaid: { label: overdue ? '期日超過' : '未払い', cls: overdue ? 'bg-danger-bg text-danger-text' : 'bg-warning-bg text-warning-text' },
    paid: { label: '入金済み', cls: 'bg-success-bg text-success-text' },
    overdue: { label: '期日超過', cls: 'bg-danger-bg text-danger-text' },
  }
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-neutral-100 text-neutral-600' }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>
}
