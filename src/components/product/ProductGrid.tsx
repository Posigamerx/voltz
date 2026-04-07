import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '@/components/ui'
import type { Product } from '@/types'

interface ProductGridProps {
  products?: Product[]
  isLoading?: boolean
  emptyMessage?: string
}

export function ProductGrid({
  products,
  isLoading,
  emptyMessage = 'No products found.',
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-white/30 font-mono text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
