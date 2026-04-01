'use client'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  id: string
  action: (id: string) => Promise<void>
  confirm?: string
}

export default function DeleteButton({ id, action, confirm: confirmMsg }: Props) {
  const router = useRouter()

  async function handleClick() {
    if (confirmMsg && !window.confirm(confirmMsg)) return
    await action(id)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-red-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50"
    >
      <Trash2 size={14} />
    </button>
  )
}
