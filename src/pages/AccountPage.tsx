import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { useOrders, useAuth } from '@/hooks'
import { useWishlistStore } from '@/store/wishlistStore'
import { OrderCard } from '@/components/user'
import { Button, Skeleton } from '@/components/ui'

type Tab = 'overview' | 'orders' | 'wishlist'

export function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const { user, signOut } = useAuthStore()
  useAuth() // syncs session listener
  const { data: orders, isLoading: ordersLoading } = useOrders(user?.id)
  const { items: wishlistIds } = useWishlistStore()

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders',   label: 'Orders',   count: orders?.length },
    { id: 'wishlist', label: 'Wishlist', count: wishlistIds.length },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Profile header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-volt-400/15 font-display text-2xl font-black text-volt-400">
          {(user?.email?.[0] ?? 'U').toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-black">{user?.email}</h1>
          <p className="font-mono text-xs text-white/30">Member since {new Date().getFullYear()}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="ml-auto">
          Sign out
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/8 bg-zinc-900/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-volt-400/10 text-volt-400'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] ${
                activeTab === tab.id ? 'bg-volt-400/20 text-volt-400' : 'bg-white/8 text-white/30'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Total orders',    value: orders?.length ?? '—',    icon: '📦' },
            { label: 'Saved items',     value: wishlistIds.length,        icon: '🤍' },
            { label: 'Total spent',     value: orders?.length
                ? `$${orders.reduce((s, o) => s + o.total, 0).toFixed(2)}`
                : '$0.00', icon: '💳' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/8 bg-zinc-900/40 p-5">
              <span className="text-2xl">{stat.icon}</span>
              <p className={`mt-3 font-display text-2xl font-black ${stat.label === 'Total spent' ? 'text-volt-400' : 'text-white'}`}>
                {stat.value}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/30">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          {ordersLoading ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : orders?.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="text-4xl">📦</span>
              <p className="font-display text-lg font-bold">No orders yet</p>
              <Link to="/products">
                <Button variant="secondary" size="sm">Start shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders?.map((order) => <OrderCard key={order.id} order={order} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div>
          {wishlistIds.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="text-4xl">🤍</span>
              <p className="font-display text-lg font-bold">Nothing saved yet</p>
              <p className="text-sm text-white/40">Tap the heart on any product to save it.</p>
              <Link to="/products">
                <Button variant="secondary" size="sm">Browse products</Button>
              </Link>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-sm text-white/40">{wishlistIds.length} saved product{wishlistIds.length !== 1 ? 's' : ''}</p>
              <Link to="/wishlist">
                <Button variant="secondary" size="sm">View full wishlist →</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
