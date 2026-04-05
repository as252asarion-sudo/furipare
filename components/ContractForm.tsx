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
import UpgradeModal from './UpgradeModal'

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

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
    try {
      const result = await saveContractAction(initial?.id ?? null, formData)
      if (result && 'limitExceeded' in result && result.limitExceeded) {
        setShowUpgradeModal(true)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (!msg.includes('NEXT_REDIRECT')) throw err
    }
  }

  async function handlePdf() {
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
    <>
    {showUpgradeModal && <UpgradeModal resource="contracts" limit={1} onClose={() => setShowUpgradeModal(false)} />}
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">基本情報</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">クライアント <span className="text-red-500">*</span></label>
            <select required value={clientId} onChange={e => setClientId(e.target.value)}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
              <option value="">選択してください</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">案件名 <span className="text-red-500">*</span></label>
            <input required value={projectName} onChange={e => setProjectName(e.target.value)}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Webサイトデザイン制作" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">職種</label>
            <select value={profession} onChange={e => applyTemplate(e.target.value as Profession)}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
              {Object.entries(PROFESSIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">契約金額（税込）</label>
            <input type="number" min={0} value={amount} onChange={e => setAmount(Number(e.target.value))}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">開始日</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">終了日（納期）</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">修正回数</label>
            <input type="number" min={0} value={revisionCount} onChange={e => setRevisionCount(Number(e.target.value))}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">ステータス</label>
            <select value={status} onChange={e => setStatus(e.target.value as Contract['status'])}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
              <option value="draft">下書き</option>
              <option value="sent">送付済み</option>
              <option value="signed">締結済み</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">著作権の帰属</label>
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
            <label className="block text-sm font-medium text-neutral-700 mb-2">ポートフォリオ掲載</label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={portfolioAllowed} onChange={e => setPortfolioAllowed(e.target.checked)} className="rounded" />
              掲載を許可する
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-700">契約条項</h2>
          <span className="text-xs text-neutral-400">職種に応じてテンプレートが自動入力されます</span>
        </div>
        <div className="space-y-3">
          {clauses.map((clause, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="text-xs text-neutral-400 mt-2.5 w-5 shrink-0">{idx + 1}.</span>
              <textarea value={clause} onChange={e => setClause(idx, e.target.value)} rows={2}
                className="flex-1 border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              <button type="button" onClick={() => removeClause(idx)} className="text-red-400 hover:text-red-600 mt-2 p-1 rounded hover:bg-red-50">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addClause} className="flex items-center gap-1 text-sm text-brand-primary hover:text-brand-dark">
            <Plus size={14} /> 条項を追加
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <label className="block text-sm font-medium text-neutral-700 mb-1">備考・特記事項</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
          className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-5 py-2 rounded-md transition-colors cursor-pointer">
          {initial ? '更新する' : '保存する'}
        </button>
        <button type="button" onClick={handlePdf} className="flex items-center gap-2 border border-neutral-200 hover:bg-neutral-50 text-sm font-medium px-5 py-2 rounded-md transition-colors cursor-pointer">
          <Download size={14} /> PDF出力
        </button>
        <button type="button" onClick={() => router.push('/contracts')} className="text-sm text-neutral-500 hover:text-neutral-800 px-4 py-2 rounded-md border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
          キャンセル
        </button>
      </div>
    </form>
    </>
  )
}
