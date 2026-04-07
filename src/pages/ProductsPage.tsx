import { useSearchParams } from 'react-router-dom'
import { useProducts } from '@/hooks'
import { ProductGrid } from '@/components/product'
import { ProductFilters } from '@/components/product'
import type { ProductFilters as Filters } from '@/types'

export function ProductsPage() {
  const [params] = useSearchParams()

  const filters: Filters = {
    category: (params.get('category') as Filters['category']) || undefined,
    search: params.get('search') || undefined,
    inStock: params.get('inStock') === 'true',
    sortBy: (params.get('sortBy') as Filters['sortBy']) || 'newest',
  }

  const { data: products, isLoading } = useProducts(filters)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24">
            <ProductFilters />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-2xl font-bold">
              {filters.category
                ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
                : 'All Products'}
            </h1>
            {!isLoading && (
              <p className="text-sm text-white/30 font-mono">
                {products?.length ?? 0} products
              </p>
            )}
          </div>
          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
