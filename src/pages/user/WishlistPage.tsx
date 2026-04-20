import { useWishlistStore } from '@/store/wishlistStore'
import { useProducts } from '@/hooks'
import { ProductCard } from '@/components/product'
import { ProductCardSkeleton } from '@/components/ui'
import { Link } from 'react-router-dom'

export function WishlistPage() {
  const { items: wishlistIds, clear } = useWishlistStore()
  const { data: allProducts, isLoading } = useProducts()

  const wishlistProducts = allProducts?.filter((p) => wishlistIds.includes(p.id)) ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-black">Wishlist</h1>
          <p className="mt-1 text-sm text-white/40">
            {wishlistIds.length} saved item{wishlistIds.length !== 1 ? 's' : ''}
          </p>
        </div>
        {wishlistIds.length > 0 && (
          <button
            onClick={clear}
            className="font-mono text-xs uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {wishlistIds.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <span className="text-5xl">🤍</span>
          <p className="font-display text-xl font-bold">Nothing saved yet</p>
          <p className="text-white/40">Tap the heart on any product to save it here.</p>
          <Link to="/products">
            <button className="mt-2 rounded-md border border-white/10 px-5 py-2.5 text-sm text-white/60 hover:border-white/20 hover:text-white transition-colors">
              Browse products
            </button>
          </Link>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: wishlistIds.length }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <p className="text-white/40 text-sm">Saved products no longer available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
