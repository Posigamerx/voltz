import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui'
import { CartItem } from './CartItem'
import { formatDollars } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, itemCount, clearCart } = useCart()
  const { user, openAuthModal } = useAuthStore()
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-zinc-900 border-l border-white/8 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-lg">Cart</h2>
            {itemCount > 0 && (
              <span className="text-xs font-mono bg-volt-400/15 text-volt-400 px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-white/30 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                </svg>
              </div>
              <p className="text-white/30 text-sm">Your cart is empty</p>
              <Button variant="secondary" size="sm" onClick={closeCart}>
                Continue shopping
              </Button>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.product.id} item={item} />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">Subtotal</span>
              <span className="font-display font-bold text-lg">{formatDollars(subtotal)}</span>
            </div>
            <p className="text-xs text-white/30">Shipping & taxes calculated at checkout</p>
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => {
                closeCart()
                if (user) {
                  navigate('/checkout')
                } else {
                  openAuthModal('login')
                }
              }}
            >
              Checkout →
            </Button>
            <button
              onClick={closeCart}
              className="w-full text-sm text-white/30 hover:text-white transition-colors py-1"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
