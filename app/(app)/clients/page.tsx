import Link from 'next/link'
import { Plus, User } from 'lucide-react'
import { getClients, deleteClient } from '@/lib/clients'
import PageHeader from '@/components/PageHeader'
import DeleteButton from '@/components/DeleteButton'

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="クライアント管理"
        description="取引先・発注元を管理します"
        action={
          <Link href="/clients/new" className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
            <Plus size={14} /> 新規追加
          </Link>
        }
      />

      {clients.length === 0 ? (
        <div className="bg-white rounded-lg border border-neutral-200 p-16 text-center text-neutral-400">
          <User size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-neutral-500 font-medium">クライアントがまだいません</p>
          <p className="text-sm mt-1">最初のクライアントを追加しましょう</p>
          <Link href="/clients/new" className="mt-4 inline-block bg-brand-primary text-white text-sm px-4 py-2 rounded-md hover:bg-brand-dark transition-colors">
            追加する
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {clients.map(c => (
            <div key={c.id} className="bg-white rounded-lg border border-neutral-200 p-5 flex items-start justify-between">
              <div>
                <p className="font-semibold text-neutral-900">{c.name}</p>
                {c.contactName && <p className="text-sm text-neutral-500 mt-0.5">担当: {c.contactName}</p>}
                {c.email && <p className="text-sm text-neutral-500">{c.email}</p>}
                {c.address && <p className="text-xs text-neutral-400 mt-1">{c.address}</p>}
              </div>
              <div className="flex gap-2">
                <Link href={`/clients/${c.id}`} className="text-xs text-brand-primary hover:text-brand-dark font-medium px-2 py-1 rounded hover:bg-brand-subtle transition-colors">編集</Link>
                <DeleteButton id={c.id} action={deleteClient} confirm="このクライアントを削除しますか？" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
