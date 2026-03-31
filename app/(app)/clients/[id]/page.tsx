'use client'
import { useEffect, useState } from 'react'
import { getClients } from '@/lib/store'
import type { Client } from '@/lib/types'
import PageHeader from '@/components/PageHeader'
import ClientForm from '@/components/ClientForm'

export default function EditClientPage({ params }: PageProps<'/clients/[id]'>) {
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      const c = getClients().find(x => x.id === id)
      setClient(c ?? null)
    })
  }, [params])

  if (!client) return <div className="p-8 text-slate-400">読み込み中...</div>

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="クライアント編集" backHref="/clients" />
      <ClientForm initial={client} />
    </div>
  )
}
