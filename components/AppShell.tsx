'use client'
import { useState } from 'react'
import Sidebar from './Sidebar'
import { Menu } from 'lucide-react'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="h-full flex bg-slate-50">
      {/* デスクトップ用サイドバー（常時表示） */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* モバイル用オーバーレイ＋サイドバー */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-30">
            <Sidebar />
          </div>
        </>
      )}

      {/* メインエリア */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* モバイルヘッダー */}
        <header className="md:hidden flex items-center h-14 px-4 bg-indigo-700 text-white shrink-0">
          <button onClick={() => setOpen(true)} className="p-1.5 rounded hover:bg-indigo-600">
            <Menu size={20} />
          </button>
          <span className="ml-3 font-bold text-lg tracking-tight">フリパレ</span>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
