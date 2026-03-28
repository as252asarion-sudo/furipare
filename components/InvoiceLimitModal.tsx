'use client'
import { X } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function InvoiceLimitModal({ onClose }: Props) {
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
          <h2 className="text-lg font-bold text-slate-800">会員登録が必要です</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            無料プランでは請求書を<strong>3枚</strong>まで作成できます。<br />
            4枚目以降の作成には会員登録が必要です。
          </p>
          <button
            disabled
            className="w-full bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg opacity-60 cursor-not-allowed"
          >
            登録する（近日公開）
          </button>
          <button
            onClick={onClose}
            className="w-full text-sm text-slate-500 hover:text-slate-700 py-1"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
