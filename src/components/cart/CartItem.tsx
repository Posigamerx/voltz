import { useCart } from '@/hooks'
import { formatDollars } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const { product, quantity } = item

  return (
    <div className="flex gap-3 py-4 border-b border-white/5">
      {/* Image */}
      <div className="w-16 h-16 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
        {product.images[0] && (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/30 font-mono">{product.brand}</p>
        <p className="text-sm font-medium text-white line-clamp-1">{product.name}</p>
        <p className="text-sm font-display font-bold text-white mt-1">
          {formatDollars(product.price * quantity)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="w-6 h-6 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 flex items-center justify-center text-xs transition-colors"
          >
            −
          </button>
          <span className="text-sm font-mono w-4 text-center">{quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
            className="w-6 h-6 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 flex items-center justify-center text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(product.id)}
        className="text-white/20 hover:text-red-400 transition-colors self-start mt-1"
        aria-label="Remove item"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
