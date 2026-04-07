import { Link } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { useCart, useToast } from '@/hooks'
import { formatDollars, discountPercent } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCart()
  const { success } = useToast()

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    success(`${product.name} added to cart`)
    openCart()
  }

  const isOutOfStock = product.stock === 0
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-zinc-800 overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <Badge variant="volt">
              -{discountPercent(product.price, product.compare_at_price!)}%
            </Badge>
          )}
          {isOutOfStock && <Badge variant="danger">Out of stock</Badge>}
          {product.featured && !isOutOfStock && <Badge variant="default">Featured</Badge>}
        </div>

        {/* Quick add — visible on hover */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="w-full"
            >
              Add to cart
            </Button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <p className="text-xs text-white/30 font-mono uppercase tracking-wider">{product.brand}</p>
        <h3 className="text-sm font-display font-semibold text-white/90 leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < Math.round(product.rating) ? 'text-volt-400' : 'text-white/15'}`}
                fill="currentColor" viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-white/30">({product.review_count})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="font-display font-bold text-white">
            {formatDollars(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-white/30 line-through">
              {formatDollars(product.compare_at_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
