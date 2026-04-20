import { AdminGuard } from '@/components/admin'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { RevenueStats } from '@/components/admin/RevenueStats'
import { Skeleton } from '@/components/ui'
import { useAllOrders } from '@/hooks'
import { Link } from 'react-router-dom'

export function AdminOrdersPage() {
  const { data: orders, isLoading, error } = useAllOrders()

  return (
    <AdminGuard>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link to="/admin" className="font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                ← Products
              </Link>
            </div>
            <h1 className="font-display text-3xl font-black">Orders</h1>
            <p className="mt-1 text-sm text-white/40">View and manage all customer orders</p>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-sm text-red-400">{error.message}</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <RevenueStats orders={orders ?? []} />
            <div>
              <h2 className="mb-4 font-display text-xl font-bold">All orders</h2>
              <OrdersTable orders={orders ?? []} />
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}
