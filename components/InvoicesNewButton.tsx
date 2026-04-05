'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import UpgradeModal from './UpgradeModal'

const FREE_PLAN_LIMIT = 3

interface Props { count: number }

export default function InvoicesNewButton({ count }: Props) {
  const [showLimitModal, setShowLimitModal] = useState(false)

  function handleClick(e: React.MouseEvent) {
    if (count >= FREE_PLAN_LIMIT) {
      e.preventDefault()
      setShowLimitModal(true)
    }
  }

  return (
    <>
      <Link
        href="/invoices/new"
        onClick={handleClick}
        className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
      >
        <Plus size={14} /> 新規作成
      </Link>
      {showLimitModal && <UpgradeModal resource="invoices" limit={FREE_PLAN_LIMIT} onClose={() => setShowLimitModal(false)} />}
    </>
  )
}
