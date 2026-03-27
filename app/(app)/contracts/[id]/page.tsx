'use client'
import { useEffect, useState } from 'react'
import { getContracts } from '@/lib/store'
import type { Contract } from '@/lib/types'
import PageHeader from '@/components/PageHeader'
import ContractForm from '@/components/ContractForm'

export default function EditContractPage({ params }: PageProps<'/contracts/[id]'>) {
  const [contract, setContract] = useState<Contract | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      const c = getContracts().find(x => x.id === id)
      setContract(c ?? null)
    })
  }, [params])

  if (!contract) return <div className="p-8 text-slate-400">読み込み中...</div>

  return (
    <div className="p-8">
      <PageHeader title="契約書 編集" backHref="/contracts" />
      <ContractForm initial={contract} />
    </div>
  )
}
