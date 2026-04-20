import { useMemo } from 'react'
import { formatPrice } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

interface RevenueStatsProps {
  orders: Order[]
}

export function RevenueStats({ orders }: RevenueStatsProps) {
  const stats = useMemo(() => {
    const confirmed = orders.filter((o) => o.status !== 'cancelled')
    const thisMonth = confirmed.filter((o) => {
      const d = new Date(o.created_at)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const totalRevenue   = confirmed.reduce((s, o) => s + o.total, 0)
    const monthRevenue   = thisMonth.reduce((s, o) => s + o.total, 0)
    const avgOrderValue  = confirmed.length ? totalRevenue / confirmed.length : 0
    const statusCounts   = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1
      return acc
    }, {} as Record<OrderStatus, number>)

    return { totalRevenue, monthRevenue, avgOrderValue, statusCounts, totalOrders: orders.length }
  }, [orders])

  return (
    <div className="flex flex-col gap-6">
      {/* Revenue cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total revenue',     value: formatPrice(stats.totalRevenue),  color: 'text-volt-400' },
          { label: 'This month',        value: formatPrice(stats.monthRevenue),   color: 'text-emerald-400' },
          { label: 'Avg order value',   value: formatPrice(stats.avgOrderValue),  color: 'text-white' },
          { label: 'Total orders',      value: stats.totalOrders,                 color: 'text-white' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/8 bg-zinc-900/50 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">{s.label}</p>
            <p className={`mt-1.5 font-display text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="rounded-xl border border-white/8 bg-zinc-900/40 p-5">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/30">Orders by status</p>
        <div className="flex flex-col gap-3">
          {(['pending','confirmed','shipped','delivered','cancelled'] as OrderStatus[]).map((status) => {
            const count   = stats.statusCounts[status] ?? 0
            const pct     = stats.totalOrders ? Math.round((count / stats.totalOrders) * 100) : 0
            const barColors: Record<OrderStatus, string> = {
              pending:   'bg-amber-400',
              confirmed: 'bg-blue-400',
              shipped:   'bg-purple-400',
              delivered: 'bg-emerald-400',
              cancelled: 'bg-red-400',
            }
            return (
              <div key={status} className="flex items-center gap-3">
                <span className="w-20 font-mono text-[10px] uppercase tracking-widest text-white/40 shrink-0">
                  {ORDER_STATUS_LABELS[status]}
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColors[status]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-white/50 w-12 text-right shrink-0">
                  {count} <span className="text-white/25">({pct}%)</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
