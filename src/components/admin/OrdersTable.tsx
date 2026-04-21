import { useState } from 'react'
import { formatPrice, formatDateTime, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { useUpdateOrderStatus } from '@/hooks'
import { useToast } from '@/hooks'
import type { Order, OrderStatus } from '@/types'

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')
  const [expandedId, setExpandedId]     = useState<string | null>(null)
  const updateStatus = useUpdateOrderStatus()
  const toast = useToast()

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.includes(search) ||
      (o.shipping_address as { fullName?: string })?.fullName?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status })
      toast.success(`Order updated to ${ORDER_STATUS_LABELS[status]}`)
    } catch {
      toast.error('Failed to update order status')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search order ID or customer name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-md border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder:text-white/25 focus:border-volt-400/50 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
          className="h-9 rounded-md border border-white/10 bg-zinc-900 px-3 text-sm text-white/70 focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <span className="font-mono text-xs text-white/30">
          {filtered.length} / {orders.length} orders
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-zinc-900/60">
              {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-white/30">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-16 text-center text-white/30">No orders found</td></tr>
            ) : filtered.map((order, i) => {
              const addr = order.shipping_address as { fullName?: string; city?: string; country?: string }
              const isExpanded = expandedId === order.id
              const itemCount = (order.items as unknown[]).length

              return (
                <>
                  <tr
                    key={order.id}
                    className={`border-b border-white/5 transition-colors hover:bg-white/3 cursor-pointer ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    {/* Order ID */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-volt-400">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      <p className="font-medium">{addr.fullName ?? '—'}</p>
                      <p className="font-mono text-[10px] text-white/30">{addr.city}, {addr.country}</p>
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-white/60">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3">
                      <span className="font-display font-semibold text-volt-400">{formatPrice(order.total)}</span>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-white/40">{formatDateTime(order.created_at)}</span>
                    </td>

                    {/* Expand */}
                    <td className="px-4 py-3">
                      <span className={`text-white/30 transition-transform inline-block ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
                    </td>
                  </tr>

                  {/* Expanded row — order details + status changer */}
                  {isExpanded && (
                    <tr key={`${order.id}-expanded`} className="border-b border-white/8 bg-zinc-950/60">
                      <td colSpan={7} className="px-6 py-5">
                        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                          {/* Items list */}
                          <div>
                            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">Items</p>
                            <div className="flex flex-col gap-2">
                              {(order.items as Array<{ product: { name: string; images: string[]; price: number }; quantity: number }>).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 rounded-lg border border-white/6 bg-zinc-900/50 p-3">
                                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-zinc-800">
                                    {item.product.images?.[0] && <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{item.product.name}</p>
                                    <p className="font-mono text-xs text-white/40">Qty: {item.quantity}</p>
                                  </div>
                                  <span className="font-display text-sm font-semibold text-volt-400">
                                    {formatPrice(item.product.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-3 rounded-lg border border-white/6 bg-zinc-900/30 p-3 font-mono text-xs">
                              <div className="flex justify-between text-white/40 py-1"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                              <div className="flex justify-between text-white/40 py-1"><span>Shipping</span><span>{formatPrice(order.shipping)}</span></div>
                              <div className="flex justify-between text-white/40 py-1"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
                              <div className="flex justify-between font-semibold text-white border-t border-white/8 pt-2 mt-1"><span>Total</span><span className="text-volt-400">{formatPrice(order.total)}</span></div>
                            </div>
                          </div>

                          {/* Status updater */}
                          <div>
                            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">Update status</p>
                            <div className="flex flex-col gap-2">
                              {STATUSES.map((s) => (
                                <button
                                  key={s}
                                  onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, s) }}
                                  disabled={order.status === s || updateStatus.isPending}
                                  className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-all disabled:opacity-40 ${
                                    order.status === s
                                      ? ORDER_STATUS_COLORS[s] + ' cursor-default'
                                      : 'border-white/8 text-white/50 hover:border-white/20 hover:text-white'
                                  }`}
                                >
                                  <span>{ORDER_STATUS_LABELS[s]}</span>
                                  {order.status === s && <span className="font-mono text-[10px]">CURRENT</span>}
                                </button>
                              ))}
                            </div>

                            {order.stripe_payment_intent_id && (
                              <p className="mt-3 font-mono text-[10px] text-white/20 break-all">
                                Stripe: {order.stripe_payment_intent_id}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
