import { useState } from 'react'
import { Badge, Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.brand.toLowerCase().includes(search.toLowerCase()) ||
                        p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = !categoryFilter || p.category === categoryFilter
    return matchSearch && matchCat
  })

  const categories = [...new Set(products.map(p => p.category))]

  return (
    <div className="flex flex-col gap-4">
      {/* Table controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search name, brand, SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-md border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder:text-white/25 focus:border-volt-400/50 focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 rounded-md border border-white/10 bg-zinc-900 px-3 text-sm text-white/70 focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c} value={c} className="capitalize">{c}</option>
          ))}
        </select>
        <span className="font-mono text-xs text-white/30">
          {filtered.length} / {products.length} products
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-zinc-900/60">
              {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Rating', 'Featured', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-white/30">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-white/30">
                  No products match your search
                </td>
              </tr>
            ) : (
              filtered.map((product, i) => (
                <tr
                  key={product.id}
                  className={`border-b border-white/5 transition-colors hover:bg-white/3 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                >
                  {/* Product */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                        {product.images[0] && (
                          <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium leading-snug">{product.name}</p>
                        <p className="font-mono text-[10px] text-white/30">{product.brand}</p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-white/40">{product.sku}</span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <Badge variant="default" className="capitalize">{product.category}</Badge>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-display font-semibold text-volt-400">{formatPrice(product.price)}</span>
                      {product.compare_at_price && (
                        <span className="ml-1.5 font-mono text-xs text-white/25 line-through">
                          {formatPrice(product.compare_at_price)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3">
                    <span className={`font-mono text-sm font-semibold ${
                      product.stock === 0 ? 'text-red-400'
                      : product.stock < 10 ? 'text-amber-400'
                      : 'text-emerald-400'
                    }`}>
                      {product.stock}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-white/50">
                      ★ {product.rating} <span className="text-white/25">({product.review_count})</span>
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="px-4 py-3">
                    {product.featured
                      ? <Badge variant="volt">Featured</Badge>
                      : <span className="font-mono text-xs text-white/20">—</span>
                    }
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(product)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete(product)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
