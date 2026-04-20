import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAdminStore } from '@/store/adminStore'
import { Button, Input } from '@/components/ui'

interface AdminGuardProps {
  children: React.ReactNode
}

const NAV = [
  { label: 'Products', href: '/admin',        icon: '📦' },
  { label: 'Orders',   href: '/admin/orders', icon: '🧾' },
]

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, login, logout } = useAdminStore()
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const ok = login(password)
    if (!ok) { setError('Incorrect password'); setPassword('') }
    setIsLoading(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative w-full max-w-sm">
          <div className="mb-8 text-center">
            <span className="font-display text-3xl font-black tracking-tighter text-volt-400">VOLTZ</span>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/30">Admin Panel</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-zinc-900/80 p-8 backdrop-blur">
            <h1 className="mb-6 font-display text-xl font-bold">Admin access</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input label="Password" type="password" placeholder="Enter admin password" value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }} error={error} autoFocus />
              <Button type="submit" isLoading={isLoading} size="lg" className="w-full">Enter →</Button>
            </form>
          </div>
          <p className="mt-4 text-center font-mono text-[10px] text-white/20">
            Set VITE_ADMIN_PASSWORD in .env to change the password
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/8 bg-zinc-950/90 px-6 backdrop-blur">
        <div className="flex items-center gap-6">
          <span className="font-display text-lg font-black tracking-tighter text-volt-400">VOLTZ</span>
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = location.pathname === item.href
              return (
                <Link key={item.href} to={item.href}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                    active ? 'bg-volt-400/10 text-volt-400' : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">↗ View store</a>
          <button onClick={logout} className="font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors">Sign out</button>
        </div>
      </div>
      {children}
    </div>
  )
}
