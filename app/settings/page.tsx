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
    <div className="p-8">
      <PageHeader title="設定" description="PDF出力に使用する自分の情報を入力します" />
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">氏名 / 屋号</label>
          <input value={form.myName} onChange={e => set('myName', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="山田 花子 / フリーデザイン工房" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">住所</label>
          <input value={form.myAddress} onChange={e => set('myAddress', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="東京都渋谷区〇〇1-2-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">メールアドレス</label>
          <input type="email" value={form.myEmail} onChange={e => set('myEmail', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">振込先銀行情報</label>
          <textarea value={form.myBankInfo} onChange={e => set('myBankInfo', e.target.value)} rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder={`〇〇銀行 〇〇支店\n普通 1234567\nヤマダ ハナコ`} />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
            保存する
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-green-600 text-sm">
              <CheckCircle size={15} /> 保存しました
            </span>
          )}
        </div>
      </form>
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-lg">
        <p className="text-sm text-amber-800 font-medium">データの保存について</p>
        <p className="text-xs text-amber-700 mt-1">データはこのブラウザのローカルストレージに保存されます。ブラウザのデータを削除すると消えますのでご注意ください。</p>
      </div>
    </div>
  )
}
