import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProduct } from '@/hooks'
import { useCartStore } from '@/store'
import { useToast } from '@/hooks'
import { Button, Badge, ProductDetailSkeleton } from '@/components/ui'
import { WishlistButton } from '@/components/user'
import { formatPrice, formatDiscount } from '@/lib/utils'

export function ProductDetailPage() {
  const { slug }                            = useParams<{ slug: string }>()
  const { data: product, isLoading, error } = useProduct(slug!)
  const { addItem, openCart }               = useCartStore()
  const toast                               = useToast()
  const navigate                            = useNavigate()
  const [selectedImage, setSelectedImage]   = useState(0)
  const [quantity, setQuantity]             = useState(1)

  if (isLoading) return <ProductDetailSkeleton />

  if (error || !product) {
    return (
      <div className="flex flex-col items-center gap-4 py-32 text-center">
        <span className="text-5xl">⚡</span>
        <p className="font-display text-xl font-bold">Product not found</p>
        <Button variant="secondary" onClick={() => navigate('/products')}>← Back to products</Button>
      </div>
    )
  }

  const discount = product.compare_at_price
    ? formatDiscount(product.compare_at_price, product.price)
    : null

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`${product.name} added to cart`)
    openCart()
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors"
      >
        ← Back
      </button>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/8 bg-zinc-900">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover transition-all duration-500"
            />
            {/* Wishlist on detail page */}
            <div className="absolute right-3 top-3">
              <WishlistButton productId={product.id} className="h-10 w-10" />
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === selectedImage ? 'border-volt-400' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/30">{product.brand}</p>
            <h1 className="mt-1 font-display text-3xl font-black leading-tight">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-volt-400">{'★'.repeat(Math.round(product.rating))}</div>
            <span className="font-mono text-xs text-white/40">
              {product.rating} ({product.review_count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-black">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <>
                <span className="font-mono text-lg text-white/30 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
                <Badge variant="volt">-{discount}%</Badge>
              </>
            )}
          </div>

          <p className="leading-relaxed text-white/60">{product.description}</p>

          {/* Stock indicator */}
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400'}`} />
            <span className={`font-mono text-xs ${product.stock > 10 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
              {product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-900 px-4 py-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-4 text-center text-white/50 hover:text-white transition-colors"
              >−</button>
              <span className="w-6 text-center font-mono text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="w-4 text-center text-white/50 hover:text-white transition-colors disabled:opacity-30"
              >+</button>
            </div>
            <span className="font-display text-lg font-bold text-white/60">
              = {formatPrice(product.price * quantity)}
            </span>
          </div>

          <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0} className="w-full">
            {product.stock === 0 ? 'Out of stock' : `Add to cart →`}
          </Button>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/8 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/30">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Specs */}
          {Object.keys(product.specs).length > 0 && (
            <div className="rounded-xl border border-white/8 p-5">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/30">Specifications</p>
              <dl className="flex flex-col gap-2.5">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between gap-4 text-sm border-b border-white/4 pb-2 last:border-0 last:pb-0">
                    <dt className="text-white/40 shrink-0">{key}</dt>
                    <dd className="font-medium text-right">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
