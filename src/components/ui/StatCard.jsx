import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'

const colorMap = {
  brand:  { bg: 'bg-brand-50',  text: 'text-brand-600',  ring: 'ring-brand-100'  },
  green:  { bg: 'bg-green-50',  text: 'text-green-600',  ring: 'ring-green-100'  },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   ring: 'ring-blue-100'   },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' },
  red:    { bg: 'bg-red-50',    text: 'text-red-600',    ring: 'ring-red-100'    },
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon: Icon,
  color = 'brand',
  loading = false,
}) {
  const c = colorMap[color] ?? colorMap.brand
  const isPositive = change > 0
  const isNeutral  = change === 0

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-surface-100 rounded" />
            <div className="h-7 w-32 bg-surface-100 rounded" />
          </div>
          <div className="w-11 h-11 bg-surface-100 rounded-xl" />
        </div>
        <div className="mt-4 h-3 w-36 bg-surface-100 rounded" />
      </div>
    )
  }

  return (
    <div className="card hover:shadow-md transition-all duration-200 animate-slide-up group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-500 font-body font-medium">{title}</p>
          <p className="font-display text-3xl font-bold text-surface-900 mt-1 tracking-tight">
            {value}
          </p>
        </div>
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center ring-1 transition-transform duration-200 group-hover:scale-105',
            c.bg, c.text, c.ring
          )}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {isNeutral ? (
          <Minus size={13} className="text-surface-400" />
        ) : isPositive ? (
          <TrendingUp size={13} className="text-green-500" />
        ) : (
          <TrendingDown size={13} className="text-red-500" />
        )}
        <span
          className={cn(
            'text-sm font-medium font-body',
            isNeutral   ? 'text-surface-400'
            : isPositive ? 'text-green-600'
            :              'text-red-500'
          )}
        >
          {isNeutral ? '—' : `${isPositive ? '+' : ''}${change}%`}
        </span>
        <span className="text-sm text-surface-400 font-body">{changeLabel}</span>
      </div>
    </div>
  )
}