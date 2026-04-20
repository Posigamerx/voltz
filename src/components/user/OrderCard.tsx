import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_STATUS_STEPS } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false)
  const items = order.items as Array<{ product: { name: string; images: string[]; price: number; slug: string }; quantity: number }>
  const addr  = order.shipping_address as { fullName?: string; line1?: string; city?: string; country?: string }

  const currentStep = ORDER_STATUS_STEPS.indexOf(order.status as OrderStatus)

  return (
    <div className="rounded-xl border border-white/8 bg-zinc-900/40 overflow-hidden">
      {/* Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 p-4 cursor-pointer hover:bg-white/3 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="font-mono text-xs text-white/30 mb-0.5">Order</p>
            <p className="font-mono text-sm font-semibold text-volt-400">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-white/30 mb-0.5">Date</p>
            <p className="text-sm text-white/70">{formatDate(order.created_at)}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-white/30 mb-0.5">Total</p>
            <p className="font-display font-bold text-volt-400">{formatPrice(order.total)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
          <span className={`text-white/30 transition-transform inline-block ${expanded ? 'rotate-180' : ''}`}>▾</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/8 p-4">
          {/* Progress tracker */}
          {order.status !== 'cancelled' && (
            <div className="mb-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">Tracking</p>
              <div className="flex items-center">
                {ORDER_STATUS_STEPS.map((step, i) => {
                  const done    = i <= currentStep
                  const current = i === currentStep
                  return (
                    <div key={step} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10px] border transition-all ${
                          done
                            ? 'bg-volt-400 border-volt-400 text-zinc-950 font-bold'
                            : 'border-white/15 text-white/20'
                        } ${current ? 'ring-2 ring-volt-400/30' : ''}`}>
                          {done ? '✓' : i + 1}
                        </div>
                        <span className={`mt-1.5 font-mono text-[9px] uppercase tracking-widest whitespace-nowrap ${current ? 'text-volt-400' : 'text-white/25'}`}>
                          {ORDER_STATUS_LABELS[step as OrderStatus]}
                        </span>
                      </div>
                      {i < ORDER_STATUS_STEPS.length - 1 && (
                        <div className={`flex-1 h-px mx-1 mb-4 ${i < currentStep ? 'bg-volt-400' : 'bg-white/10'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="mb-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/30">Items</p>
            <div className="flex flex-col gap-2">
              {items.map((item, idx) => (
                <Link
                  key={idx}
                  to={`/products/${item.product.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-white/6 bg-zinc-950/50 p-3 hover:border-white/12 transition-colors"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-zinc-800">
                    {item.product.images?.[0] && <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{item.product.name}</p>
                    <p className="font-mono text-xs text-white/30">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-display text-sm font-semibold text-white/70 shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-lg border border-white/6 bg-zinc-950/40 p-3">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/25">Shipped to</p>
            <p className="text-sm text-white/60">
              {addr.fullName} · {addr.line1}, {addr.city}, {addr.country}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
