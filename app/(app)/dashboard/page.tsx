import { Suspense } from 'react'
import Link from 'next/link'
import { FileText, Receipt, ScrollText, Users, Plus } from 'lucide-react'
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

  const stats = [
    { label: 'クライアント', value: clients.length, icon: Users, href: '/clients' },
    { label: '見積書', value: estimates.length, icon: FileText, href: '/estimates' },
    { label: '請求書', value: invoices.length, icon: Receipt, href: '/invoices' },
    { label: '契約書', value: contracts.length, icon: ScrollText, href: '/contracts' },
  ]

  return (
    <>
    <Suspense fallback={null}><UpgradedToast /></Suspense>
    <div className="p-6 md:p-8">

      {/* Hero: full-bleed dark banner */}
      <div className="-mx-6 -mt-6 md:-mx-8 md:-mt-8 bg-neutral-900 px-6 md:px-8 pt-8 pb-16">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest mb-3">今月の入金額</p>
            <p className="text-5xl font-bold tabular-nums text-white tracking-tight">¥{fmt(monthIncome)}</p>
            <div className="flex items-center gap-5 mt-4 text-sm">
              <span className="text-neutral-400">
                入金待ち <span className="text-white font-semibold">¥{fmt(unpaidAmount)}</span>
              </span>
              {overdueCount > 0 ? (
                <span className="text-danger-text font-semibold">期日超過 {overdueCount}件</span>
              ) : (
                <span className="text-neutral-600">期日超過 0件</span>
              )}
            </div>
          </div>
          <div className="hidden sm:flex flex-col gap-2 shrink-0 pt-1">
            <Link href="/estimates/new" className="flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
              <Plus size={13} />見積書を作成
            </Link>
            <Link href="/invoices/new" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
              <Plus size={13} />請求書を作成
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar: overlaps hero */}
      <div className="-mt-8 mb-8">
        <div className="bg-white border border-neutral-200 rounded-lg grid grid-cols-4 divide-x divide-neutral-200 shadow-sm">
          {stats.map(({ label, value, icon: Icon, href }) => (
            <Link key={href} href={href} className="px-5 py-4 hover:bg-neutral-50 transition-colors group">
              <p className="text-2xl font-bold text-neutral-900 tabular-nums group-hover:text-brand-primary transition-colors">{value}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Icon size={11} className="text-neutral-400" />
                <p className="text-xs text-neutral-500">{label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main grid: 2/3 + 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 最近の請求書 */}
        <div className="lg:col-span-2">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">最近の請求書</h2>
          {recentInvoices.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
              <Receipt size={28} className="mx-auto mb-3 text-neutral-300" />
              <p className="text-neutral-400 text-sm">まだ請求書がありません</p>
              <Link href="/invoices/new" className="text-brand-primary text-sm mt-2 inline-block hover:text-brand-dark transition-colors">
                最初の請求書を作成する →
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    {['案件名', '支払期日', 'ステータス'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-neutral-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-neutral-900">{inv.projectName}</td>
                      <td className="px-4 py-3 text-neutral-500 text-xs">{inv.dueDate}</td>
                      <td className="px-4 py-3"><StatusBadge status={inv.status} dueDate={inv.dueDate} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* サイドカラム: アクション + 使用状況 */}
        <div className="space-y-6">
          {/* モバイル用クイックアクション */}
          <div className="sm:hidden">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">クイックアクション</h2>
            <div className="space-y-2">
              <Link href="/estimates/new" className="flex items-center gap-2 w-full bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors">
                <Plus size={13} />見積書を作成
              </Link>
              <Link href="/invoices/new" className="flex items-center gap-2 w-full bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors">
                <Plus size={13} />請求書を作成
              </Link>
            </div>
          </div>

          {/* その他アクション */}
          <div>
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">その他</h2>
            <div className="space-y-2">
              <Link href="/contracts/new" className="flex items-center gap-2 w-full border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700 text-sm font-medium px-4 py-2.5 rounded-md transition-colors">
                <Plus size={13} />契約書を作成
              </Link>
              <Link href="/clients/new" className="flex items-center gap-2 w-full border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700 text-sm font-medium px-4 py-2.5 rounded-md transition-colors">
                <Plus size={13} />クライアント追加
              </Link>
            </div>
          </div>

          {/* 使用状況 */}
          {usage && usage.plan === 'free' && (
            <div>
              <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">使用状況（無料プラン）</h2>
              <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-4">
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
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-neutral-500">{label}</span>
                        <span className={`text-xs font-semibold tabular-nums ${isAtLimit ? 'text-danger-text' : 'text-neutral-700'}`}>
                          {data.current}/{data.limit}{unit}
                        </span>
                      </div>
                      <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
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
        </div>
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
