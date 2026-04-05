'use client'
import { useState, useEffect } from 'react'
import { getSettings, saveSettings } from '@/lib/store'
import PageHeader from '@/components/PageHeader'
import { CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const [form, setForm] = useState({ myName: '', myAddress: '', myEmail: '', myBankInfo: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => { setForm(getSettings()) }, [])

  function set(key: keyof typeof form, value: string) { setForm(f => ({ ...f, [key]: value })) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    saveSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="設定" description="PDF出力に使用する自分の情報を入力します" />
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-neutral-200 p-6 max-w-lg space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">氏名 / 屋号</label>
          <input value={form.myName} onChange={e => set('myName', e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder="山田 花子 / フリーデザイン工房" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">住所</label>
          <input value={form.myAddress} onChange={e => set('myAddress', e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder="東京都渋谷区〇〇1-2-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">メールアドレス</label>
          <input type="email" value={form.myEmail} onChange={e => set('myEmail', e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">振込先銀行情報</label>
          <textarea value={form.myBankInfo} onChange={e => set('myBankInfo', e.target.value)} rows={3}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder={`〇〇銀行 〇〇支店\n普通 1234567\nヤマダ ハナコ`} />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-5 py-2 rounded-md transition-colors">
            保存する
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-success-text text-sm">
              <CheckCircle size={15} /> 保存しました
            </span>
          )}
        </div>
      </form>
      <div className="mt-6 bg-brand-subtle border border-brand-muted rounded-lg p-4 max-w-lg">
        <p className="text-sm text-brand-dark font-medium">PDF出力情報について</p>
        <p className="text-xs text-brand-primary mt-1">氏名・住所・振込先などのPDF出力用情報は、このブラウザに保存されます。クライアント・請求書・見積書・契約書のデータはクラウドに安全に保存されます。</p>
      </div>
    </div>
  )
}
