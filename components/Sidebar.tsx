'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  ScrollText,
  Settings,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

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
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await fetch('/auth/signout', { method: 'POST' })
    router.push('/auth/login')
  }

  return (
    <aside className="w-56 bg-neutral-900 text-white flex flex-col min-h-full shrink-0">
      <Link href="/" className="px-5 py-5 border-b border-neutral-800 block">
        <span className="font-bold text-base tracking-tight text-white">フリパレ</span>
        <p className="text-neutral-500 text-xs mt-0.5">ウラヤハカンパニー</p>
      </Link>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-neutral-800 space-y-2">
        {user && (
          <div className="text-xs text-neutral-500 truncate px-1" title={user.email ?? ''}>
            {user.email}
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-600">v1.0.0 MVP</span>
          {user && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors"
              title="ログアウト"
            >
              <LogOut size={13} />
              ログアウト
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
