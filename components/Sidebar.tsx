'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  ScrollText,
  Settings,
  Briefcase,
} from 'lucide-react'

const nav = [
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/clients', label: 'クライアント', icon: Users },
  { href: '/estimates', label: '見積書', icon: FileText },
  { href: '/invoices', label: '請求書', icon: Receipt },
  { href: '/contracts', label: '契約書', icon: ScrollText },
  { href: '/settings', label: '設定', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-56 bg-indigo-700 text-white flex flex-col min-h-full shrink-0">
      <div className="px-5 py-5 border-b border-indigo-600">
        <div className="flex items-center gap-2">
          <Briefcase size={20} className="text-indigo-200" />
          <span className="font-bold text-lg tracking-tight">フリパレ</span>
        </div>
        <p className="text-indigo-300 text-xs mt-0.5">ウラヤハカンパニー</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-white text-indigo-700'
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-5 py-4 border-t border-indigo-600 text-xs text-indigo-400">
        v1.0.0 MVP
      </div>
    </aside>
  )
}
