'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

export type UpgradeModalResource = 'invoices' | 'quotes' | 'contracts' | 'clients'

const RESOURCE_LABELS: Record<UpgradeModalResource, { name: string; unit: string }> = {
  invoices: { name: '請求書', unit: '枚' },
  quotes: { name: '見積書', unit: '枚' },
  contracts: { name: '契約書', unit: '件' },
  clients: { name: 'クライアント', unit: '件' },
}

interface Props {
  resource: UpgradeModalResource
  limit: number
  onClose: () => void
}

export default function UpgradeModal({ resource, limit, onClose }: Props) {
  const { name, unit } = RESOURCE_LABELS[resource]
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Stripe checkout URL not returned', data)
        setLoading(false)
      }
    } catch (err) {
      console.error('Failed to start checkout', err)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          aria-label="閉じる"
        >
          <X size={18} />
        </button>

        <div className="text-center space-y-4">
          <div className="text-4xl">🔒</div>
          <h2 className="text-lg font-bold text-slate-800">上限に達しました</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            無料プランでは{name}を<strong>{limit}{unit}</strong>まで作成できます。<br />
            アドバンスプランにアップグレードすると無制限で作成できます。
          </p>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? '処理中...' : 'アドバンスプランにアップグレード'}
          </button>
          <button
            onClick={onClose}
            className="w-full text-sm text-slate-500 hover:text-slate-700 py-1 cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
