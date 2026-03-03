import { cn } from '../../lib/utils'

const variants = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error:   'bg-red-100   text-red-700',
  info:    'bg-blue-100  text-blue-700',
  default: 'bg-surface-100 text-surface-600',
  brand:   'bg-brand-100 text-brand-700',
}

const dotColors = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error:   'bg-red-500',
  info:    'bg-blue-500',
  default: 'bg-surface-400',
  brand:   'bg-brand-500',
}

export default function Badge({ children, variant = 'default', dot = false, className }) {
  return (
    <span className={cn('badge capitalize', variants[variant], className)}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />
      )}
      {children}
    </span>
  )
}