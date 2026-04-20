import { Link } from 'react-router-dom'
import { useCartStore } from '@/store'
import { useToast } from '@/hooks'
import { Badge, Button } from '@/components/ui'
import { WishlistButton } from '@/components/user'
import { formatPrice, formatDiscount } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const toast = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} added to cart`)
    openCart()
  }

  const discount = product.compare_at_price
    ? formatDiscount(product.compare_at_price, product.price)
    : null

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col rounded-xl border border-white/6 bg-zinc-900/40 p-4 transition-all duration-300 hover:border-white/12 hover:bg-zinc-900/70"
    >
      {/* Image */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-zinc-800/60">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {discount && (
          <Badge variant="volt" className="absolute left-2 top-2">-{discount}%</Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60">
            <Badge variant="danger">Out of stock</Badge>
          </div>
        )}
        {/* Wishlist button floats on image */}
        <div className="absolute right-2 top-2" onClick={(e) => e.preventDefault()}>
          <WishlistButton productId={product.id} />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">{product.brand}</p>
        <h3 className="font-display text-sm font-semibold leading-snug text-white group-hover:text-volt-400 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex text-volt-400 text-xs">
            {'★'.repeat(Math.round(product.rating))}
            <span className="text-white/20">{'★'.repeat(5 - Math.round(product.rating))}</span>
          </div>
          <span className="font-mono text-[10px] text-white/30">({product.review_count})</span>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-3">
        <div>
          <span className="font-display text-base font-bold text-white">{formatPrice(product.price)}</span>
          {product.compare_at_price && (
            <span className="ml-2 font-mono text-xs text-white/30 line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
        <Button size="sm" onClick={handleAddToCart} disabled={product.stock === 0} className="shrink-0">
          Add
        </Button>
      </div>
    </Link>
  )
}
