import { useAuthStore } from '@/store'
import { useOrders } from '@/hooks'
import { OrderCard } from '@/components/user'
import { OrderCardSkeleton } from '@/components/ui'
import { Link } from 'react-router-dom'

export function OrdersPage() {
  const { user }                                    = useAuthStore()
  const { data: orders, isLoading, error }          = useOrders(user?.id)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-black">Your orders</h1>
          <p className="mt-1 text-sm text-white/40">
            {isLoading ? 'Loading…' : `${orders?.length ?? 0} order${orders?.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/products" className="font-mono text-xs uppercase tracking-widest text-volt-400 hover:text-volt-300 transition-colors">
          Keep shopping →
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-400">{error.message}</p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : orders?.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <span className="text-5xl">📦</span>
          <p className="font-display text-xl font-bold">No orders yet</p>
          <p className="text-white/40">When you place an order it will appear here.</p>
          <Link to="/products">
            <button className="mt-2 rounded-md border border-white/10 px-5 py-2.5 text-sm text-white/60 hover:border-white/20 hover:text-white transition-colors">
              Browse products
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders?.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  )
}
