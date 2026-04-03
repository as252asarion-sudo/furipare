'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient_, updateClient } from '@/lib/clients'
import type { Client } from '@/lib/types'
import UpgradeModal from './UpgradeModal'

interface Props { initial?: Client }

export default function ClientForm({ initial }: Props) {
  const router = useRouter()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    try {
      if (initial) {
        await updateClient(initial.id, formData)
      } else {
        const result = await createClient_(formData)
        if (result && 'limitExceeded' in result && result.limitExceeded) {
          setShowUpgradeModal(true)
          setSaving(false)
          return
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (!msg.includes('NEXT_REDIRECT')) {
        console.error(msg)
        setSaving(false)
      }
    }
  }

  return (
    <>
      {showUpgradeModal && <UpgradeModal resource="clients" limit={3} onClose={() => setShowUpgradeModal(false)} />}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">会社名 / 屋号 <span className="text-red-500">*</span></label>
          <input
            required
            name="name"
            defaultValue={initial?.name ?? ''}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="株式会社〇〇"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">担当者名</label>
          <input
            name="contactName"
            defaultValue={initial?.contactName ?? ''}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="山田 太郎"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">メールアドレス</label>
          <input
            type="email"
            name="email"
            defaultValue={initial?.email ?? ''}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="info@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">住所</label>
          <input
            name="address"
            defaultValue={initial?.address ?? ''}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="東京都渋谷区〇〇1-2-3"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer">
            {saving ? '処理中...' : (initial ? '更新する' : '追加する')}
          </button>
          <button type="button" onClick={() => router.push('/clients')} className="text-sm text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
            キャンセル
          </button>
        </div>
      </form>
    </>
  )
}
