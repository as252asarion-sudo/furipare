'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Plus, Trash2 } from 'lucide-react'
import { saveContractAction } from '@/lib/contracts'
import { getClients } from '@/lib/clients'
import { getSettings } from '@/lib/store'
import { TEMPLATES } from '@/lib/templates'
import { generateContractPdf } from '@/lib/pdf'
import type { Contract, Profession, Client } from '@/lib/types'
import { PROFESSIONS } from '@/lib/types'

interface Props { initial?: Contract }

export default function ContractForm({ initial }: Props) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState(initial?.clientId ?? '')
  const [projectName, setProjectName] = useState(initial?.projectName ?? '')
  const [profession, setProfession] = useState<Profession>(initial?.profession ?? 'designer')
  const [startDate, setStartDate] = useState(initial?.startDate ?? '')
  const [endDate, setEndDate] = useState(initial?.endDate ?? '')
  const [amount, setAmount] = useState(initial?.amount ?? 0)
  const [revisionCount, setRevisionCount] = useState(initial?.revisionCount ?? 3)
  const [copyrightOwner, setCopyrightOwner] = useState<'client' | 'freelancer'>(initial?.copyrightOwner ?? 'client')
  const [portfolioAllowed, setPortfolioAllowed] = useState(initial?.portfolioAllowed ?? false)
  const [note, setNote] = useState(initial?.note ?? '')
  const [status, setStatus] = useState<Contract['status']>(initial?.status ?? 'draft')
  const [clauses, setClauses] = useState<string[]>(
    initial ? TEMPLATES[initial.profession].contractClauses.map(c => c) : TEMPLATES['designer'].contractClauses.map(c => c)
  )

  useEffect(() => { getClients().then(setClients) }, [])

  function applyTemplate(p: Profession) {
    setProfession(p)
    setClauses(TEMPLATES[p].contractClauses.map(c => c))
    setRevisionCount(TEMPLATES[p].revisionDefault)
  }

  function setClause(idx: number, value: string) {
    setClauses(prev => prev.map((c, i) => i === idx ? value : c))
  }
  function addClause() { setClauses(prev => [...prev, '']) }
  function removeClause(idx: number) { setClauses(prev => prev.filter((_, i) => i !== idx)) }

  function buildData(): Omit<Contract, 'id' | 'createdAt'> {
    return {
      clientId, projectName, profession, startDate, endDate, amount,
      revisionCount, copyrightOwner, portfolioAllowed, note, status,
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData()
    formData.set('data', JSON.stringify(buildData()))
    await saveContractAction(initial?.id ?? null, formData)
  }

  function handlePdf() {
    const data = buildData()
    const client = clients.find(c => c.id === clientId)
    if (!client) return alert('クライアントを選択してください')
    const s = getSettings()
    const con: Contract = {
      id: initial?.id ?? 'preview',
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      ...data,
    }
    generateContractPdf(con, client, s.myName, s.myAddress, s.myEmail, clauses)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">基本情報</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">クライアント <span className="text-red-500">*</span></label>
            <select required value={clientId} onChange={e => setClientId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">選択してください</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">案件名 <span className="text-red-500">*</span></label>
            <input required value={projectName} onChange={e => setProjectName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Webサイトデザイン制作" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">職種</label>
            <select value={profession} onChange={e => applyTemplate(e.target.value as Profession)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {Object.entries(PROFESSIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">契約金額（税込）</label>
            <input type="number" min={0} value={amount} onChange={e => setAmount(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">開始日</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">終了日（納期）</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">修正回数</label>
            <input type="number" min={0} value={revisionCount} onChange={e => setRevisionCount(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ステータス</label>
            <select value={status} onChange={e => setStatus(e.target.value as Contract['status'])}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="draft">下書き</option>
              <option value="sent">送付済み</option>
              <option value="signed">締結済み</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">著作権の帰属</label>
            <div className="flex gap-3">
              {[{ v: 'client', l: 'クライアント' }, { v: 'freelancer', l: '自分（フリーランサー）' }].map(({ v, l }) => (
                <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" value={v} checked={copyrightOwner === v} onChange={() => setCopyrightOwner(v as 'client' | 'freelancer')} />
                  {l}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">ポートフォリオ掲載</label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={portfolioAllowed} onChange={e => setPortfolioAllowed(e.target.checked)} className="rounded" />
              掲載を許可する
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">契約条項</h2>
          <span className="text-xs text-slate-400">職種に応じてテンプレートが自動入力されます</span>
        </div>
        <div className="space-y-3">
          {clauses.map((clause, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="text-xs text-slate-400 mt-2.5 w-5 shrink-0">{idx + 1}.</span>
              <textarea value={clause} onChange={e => setClause(idx, e.target.value)} rows={2}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <button type="button" onClick={() => removeClause(idx)} className="text-red-400 hover:text-red-600 mt-2 p-1 rounded hover:bg-red-50">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addClause} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800">
            <Plus size={14} /> 条項を追加
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">備考・特記事項</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
          {initial ? '更新する' : '保存する'}
        </button>
        <button type="button" onClick={handlePdf} className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-sm font-medium px-5 py-2 rounded-lg transition-colors">
          <Download size={14} /> PDF出力
        </button>
        <button type="button" onClick={() => router.push('/contracts')} className="text-sm text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
          キャンセル
        </button>
      </div>
    </form>
  )
}
