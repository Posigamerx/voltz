import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useProduct, useCart, useToast } from '@/hooks'
import { Button, Badge, Skeleton } from '@/components/ui'
import { formatDollars, discountPercent } from '@/lib/utils'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, error } = useProduct(slug!)
  const { addItem, openCart } = useCart()
  const { success } = useToast()
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="text-white/30">Product not found.</p>
        <Link to="/products" className="text-volt-400 text-sm mt-4 inline-block">← Back to products</Link>
      </div>
    )
  }

  function handleAdd() {
    addItem(product!, qty)
    success(`${product!.name} added to cart`)
    openCart()
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/products" className="text-sm text-white/40 hover:text-white transition-colors mb-8 inline-flex items-center gap-1">
        ← All products
      </Link>

      <div className="grid md:grid-cols-2 gap-12 mt-6">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-white/5">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/10">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-volt-400' : 'border-transparent'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge>{product.category}</Badge>
            {product.stock === 0 && <Badge variant="danger">Out of stock</Badge>}
            {product.stock > 0 && product.stock < 5 && (
              <Badge variant="warning">Only {product.stock} left</Badge>
            )}
          </div>

          <p className="text-sm text-white/30 font-mono mb-1">{product.brand}</p>
          <h1 className="font-display text-3xl font-bold leading-tight mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-volt-400' : 'text-white/15'}`}
                  fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-white/40">{product.rating} ({product.review_count} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl font-black">{formatDollars(product.price)}</span>
            {hasDiscount && (
              <>
                <span className="text-xl text-white/30 line-through">{formatDollars(product.compare_at_price!)}</span>
                <Badge variant="volt">Save {discountPercent(product.price, product.compare_at_price!)}%</Badge>
              </>
            )}
          </div>

          <p className="text-white/60 leading-relaxed mb-8">{product.description}</p>

          {/* Quantity + Add */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 transition-colors">−</button>
              <span className="px-4 font-mono text-sm">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty >= product.stock} className="px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30">+</button>
            </div>
            <Button size="lg" onClick={handleAdd} disabled={product.stock === 0} className="flex-1">
              {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
            </Button>
          </div>

          {/* Specs */}
          {Object.keys(product.specs).length > 0 && (
            <div className="mt-8 border-t border-white/5 pt-8">
              <h3 className="font-display font-semibold mb-4 text-white/80">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex gap-4 text-sm">
                    <span className="text-white/30 w-32 shrink-0">{key}</span>
                    <span className="text-white/70">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
