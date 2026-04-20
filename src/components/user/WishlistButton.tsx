import { useWishlistStore } from '@/store/wishlistStore'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { toggle, has } = useWishlistStore()
  const saved = has(productId)

  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(productId) }}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full border transition-all',
        saved
          ? 'border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500/25'
          : 'border-white/10 bg-zinc-900/80 text-white/30 hover:border-white/20 hover:text-white',
        className
      )}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  )
}
