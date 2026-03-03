import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Loader({ size = 20, className, text }) {
  return (
    <div className={cn('flex items-center justify-center gap-2 text-surface-400', className)}>
      <Loader2 size={size} className="animate-spin" />
      {text && <span className="text-sm font-body">{text}</span>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader size={24} text="Loading…" />
    </div>
  )
}