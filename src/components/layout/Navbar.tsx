import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { useCart } from '@/hooks'

export function Navbar() {
  const { itemCount, toggleCart } = useCart()
  const { user, openAuthModal, signOut } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl font-black tracking-tighter text-volt-400 group-hover:text-volt-300 transition-colors">
            VOLTZ
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Shop', to: '/products' },
            { label: 'Phones',      to: '/products?category=phones' },
            { label: 'Laptops',     to: '/products?category=laptops' },
            { label: 'Audio',       to: '/products?category=audio' },
            { label: 'Wearables',   to: '/products?category=wearables' },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="px-3 py-1.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => navigate('/products')}
            className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3 mr-2">
              <span className="text-sm font-medium text-white/80 hidden sm:block">
                Hi, {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
              </span>
              <button
                onClick={() => signOut()}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 hover:text-white text-white/60 transition-all"
                aria-label="Sign out"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              aria-label="Sign in"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
              </svg>
            </button>
          )}

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            aria-label={`Cart (${itemCount} items)`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-volt-400 text-zinc-950 text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
