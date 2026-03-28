'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getInvoices } from '@/lib/store'
import PageHeader from '@/components/PageHeader'
import InvoiceForm from '@/components/InvoiceForm'
import InvoiceLimitModal from '@/components/InvoiceLimitModal'

const FREE_PLAN_LIMIT = 3

export default function NewInvoicePage() {
  const router = useRouter()
  const [showLimitModal, setShowLimitModal] = useState(false)

  useEffect(() => {
    if (getInvoices().length >= FREE_PLAN_LIMIT) {
      setShowLimitModal(true)
    }
  }, [])

  function handleModalClose() {
    setShowLimitModal(false)
    router.push('/invoices')
  }

  if (showLimitModal) {
    return <InvoiceLimitModal onClose={handleModalClose} />
  }

  return (
    <div className="p-8">
      <PageHeader title="請求書 新規作成" backHref="/invoices" />
      <InvoiceForm />
    </div>
  )
}
