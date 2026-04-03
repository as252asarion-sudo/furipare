'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Download } from 'lucide-react'
import { saveInvoiceAction } from '@/lib/invoices'
import { getEstimates } from '@/lib/quotes'
import { getClients } from '@/lib/clients'
import { getSettings, fmt, calcSubtotal, calcTax, calcWithholding, calcTotal } from '@/lib/store'
import { generateInvoicePdf } from '@/lib/pdf'
import type { Invoice, EstimateItem, Profession, Client, Estimate } from '@/lib/types'
import { PROFESSIONS } from '@/lib/types'
import UpgradeModal from './UpgradeModal'

interface Props { initial?: Invoice }

const defaultItem = (): EstimateItem => ({ description: '', quantity: 1, unit: '式', unitPrice: 0 })

export default function InvoiceForm({ initial }: Props) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [clientId, setClientId] = useState(initial?.clientId ?? '')
  const [estimateId, setEstimateId] = useState(initial?.estimateId ?? '')
  const [projectName, setProjectName] = useState(initial?.projectName ?? '')
  const [profession, setProfession] = useState<Profession>(initial?.profession ?? 'designer')
  const [items, setItems] = useState<EstimateItem[]>(initial?.items ?? [defaultItem()])
  const [taxRate, setTaxRate] = useState(initial?.taxRate ?? 10)
  const [withholdingTax, setWithholdingTax] = useState(initial?.withholdingTax ?? false)
  const [note, setNote] = useState(initial?.note ?? '')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [status, setStatus] = useState<Invoice['status']>(initial?.status ?? 'unpaid')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    getClients().then(setClients)
    getEstimates().then(setEstimates)
  }, [])

  function importFromEstimate(estId: string) {
    setEstimateId(estId)
    const est = estimates.find(e => e.id === estId)
    if (!est) return
    setClientId(est.clientId)
    setProjectName(est.projectName)
    setProfession(est.profession)
    setItems(est.items.map(i => ({ ...i })))
    setTaxRate(est.taxRate)
    setWithholdingTax(est.withholdingTax)
  }

  function setItem(idx: number, key: keyof EstimateItem, value: string | number) {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item))
  }
  function addItem() { setItems(prev => [...prev, defaultItem()]) }
  function removeItem(idx: number) { setItems(prev => prev.filter((_, i) => i !== idx)) }

  const subtotal = calcSubtotal(items)
  const tax = calcTax(subtotal, taxRate)
  const withholding = withholdingTax ? calcWithholding(subtotal) : 0
  const total = calcTotal(subtotal, tax, withholdingTax)

  function buildData(): Omit<Invoice, 'id' | 'createdAt'> {
    return {
      estimateId: estimateId || undefined,
      clientId, projectName, profession, items, taxRate, withholdingTax, note, dueDate, status,
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.set('data', JSON.stringify(buildData()))
      const result = await saveInvoiceAction(initial?.id ?? null, formData)
      if (result && 'limitExceeded' in result && result.limitExceeded) {
        setShowUpgradeModal(true)
        setSaving(false)
        return
      }
    } catch (err: unknown) {
      // redirect()はエラーとしてthrowされるが正常な遷移なので無視
      const msg = err instanceof Error ? err.message : String(err)
      if (!msg.includes('NEXT_REDIRECT')) {
        setError(msg)
        setSaving(false)
      }
    }
  }

  async function handlePdf() {
    const data = buildData()
    const client = clients.find(c => c.id === clientId)
    if (!client) return alert('クライアントを選択してください')
    const s = getSettings()
    const inv: Invoice = {
      id: initial?.id ?? 'preview',
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      ...data,
    }
    generateInvoicePdf(inv, client, s.myName, s.myAddress, s.myEmail, s.myBankInfo)
  }

  return (
    <>
    {showUpgradeModal && <UpgradeModal resource="invoices" limit={3} onClose={() => setShowUpgradeModal(false)} />}
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 見積書から取り込み */}
      {!initial && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-4">
          <span className="text-sm font-medium text-indigo-700 shrink-0">見積書から取り込む</span>
          <select value={estimateId} onChange={e => importFromEstimate(e.target.value)}
            className="flex-1 border border-indigo-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="">選択してください（任意）</option>
            {estimates.map(e => <option key={e.id} value={e.id}>{e.projectName}</option>)}
          </select>
        </div>
      )}

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
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="ロゴデザイン制作" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">職種</label>
            <select value={profession} onChange={e => setProfession(e.target.value as Profession)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {Object.entries(PROFESSIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">支払期日 <span className="text-red-500">*</span></label>
            <input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ステータス</label>
            <select value={status} onChange={e => setStatus(e.target.value as Invoice['status'])}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="unpaid">未払い</option>
              <option value="paid">入金済み</option>
              <option value="overdue">期日超過</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">明細</h2>
        <div className="space-y-2 overflow-x-auto">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-500 px-1 min-w-[480px]">
            <span className="col-span-5">項目</span><span className="col-span-2">数量</span>
            <span className="col-span-1">単位</span><span className="col-span-2">単価</span><span className="col-span-2 text-right">金額</span>
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center min-w-[480px]">
              <input value={item.description} onChange={e => setItem(idx, 'description', e.target.value)}
                className="col-span-5 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="作業内容" />
              <input type="number" min={0} value={item.quantity} onChange={e => setItem(idx, 'quantity', Number(e.target.value))}
                className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <input value={item.unit} onChange={e => setItem(idx, 'unit', e.target.value)}
                className="col-span-1 border border-slate-300 rounded-lg px2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <input type="number" min={0} value={item.unitPrice} onChange={e => setItem(idx, 'unitPrice', Number(e.target.value))}
                className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              <div className="col-span-1 flex items-center justify-between">
                <span className="text-sm text-slate-700 font-mono">¥{fmt(item.quantity * item.unitPrice)}</span>
                <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 ml-1"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addItem} className="mt-2 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800">
            <Plus size={14} /> 行を追加
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">小計</span><span className="font-mono">¥{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-500">
              <span>消費税</span>
              <select value={taxRate} onChange={e => setTaxRate(Number(e.target.value))}
                className="border border-slate-300 rounded px-2 py-0.5 text-xs">
                <option value={10}>10%</option><option value={8}>8%（軽減）</option><option value={0}>0%</option>
              </select>
            </div>
            <span className="font-mono">¥{fmt(tax)}</span>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
              <input type="checkbox" checked={withholdingTax} onChange={e => setWithholdingTax(e.target.checked)} className="rounded" />
              源泉徴収（-10.21%）
            </label>
            <span className="font-mono text-red-500">{withholdingTax ? `-¥${fmt(withholding)}` : '—'}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-base">
            <span>合計</span><span className="font-mono text-indigo-700">¥{fmt(total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">備考・振込先</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="振込先銀行、注意事項など" />
      </div>

      {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</div>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer">
          {saving ? '保存中...' : (initial ? '更新する' : '保存する')}
        </button>
        <button type="button" onClick={handlePdf} className="flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-sm font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer">
          <Download size={14} /> PDF出力
        </button>
        <button type="button" onClick={() => router.push('/invoices')} className="text-sm text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
          キャンセル
        </button>
      </div>
    </form>
    </>
  )
}
