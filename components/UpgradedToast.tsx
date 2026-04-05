'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function UpgradedToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') {
      setVisible(true)
      // URLからパラメータを除去
      router.replace('/dashboard', { scroll: false })
      const timer = setTimeout(() => setVisible(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-primary text-white px-5 py-3 rounded-md flex items-center gap-3 text-sm font-medium animate-fade-in">
      <CheckCircle size={18} className="shrink-0" />
      アドバンスプランへようこそ！
    </div>
  )
}
