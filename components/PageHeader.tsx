import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  title: string
  description?: string
  backHref?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, description, backHref, action }: Props) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {backHref && (
          <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-2">
            <ChevronLeft size={14} /> 戻る
          </Link>
        )}
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{title}</h1>
        {description && <p className="text-neutral-500 text-sm mt-0.5">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
