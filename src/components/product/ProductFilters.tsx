import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui'
import type { Category } from '@/types'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'phones',      label: 'Phones' },
  { value: 'laptops',     label: 'Laptops' },
  { value: 'audio',       label: 'Audio' },
  { value: 'cameras',     label: 'Cameras' },
  { value: 'wearables',   label: 'Wearables' },
  { value: 'gaming',      label: 'Gaming' },
  { value: 'accessories', label: 'Accessories' },
]

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
]

export function ProductFilters() {
  const [params, setParams] = useSearchParams()
  const activeCategory = params.get('category') as Category | null
  const activeSort = params.get('sortBy') || 'newest'

  function setFilter(key: string, value: string | null) {
    const next = new URLSearchParams(params)
    if (value === null) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setParams(next)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <div>
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Category</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setFilter('category', null)}
            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !activeCategory
                ? 'bg-volt-400/15 text-volt-400 font-medium'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            All products
          </button>
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() =>
                setFilter('category', activeCategory === value ? null : value)
              }
              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === value
                  ? 'bg-volt-400/15 text-volt-400 font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Sort by</p>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter('sortBy', value)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSort === value
                  ? 'bg-white/8 text-white font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* In stock toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={params.get('inStock') === 'true'}
            onChange={(e) => setFilter('inStock', e.target.checked ? 'true' : null)}
            className="sr-only peer"
          />
          <div className="relative w-10 h-5 bg-white/10 rounded-full peer-checked:bg-volt-400/80 transition-colors">
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
          </div>
          <span className="text-sm text-white/50 group-hover:text-white transition-colors">
            In stock only
          </span>
        </label>
      </div>

      {/* Clear filters */}
      {(activeCategory || params.get('inStock')) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setParams({})}
          className="justify-start px-3 text-white/40"
        >
          Clear filters
        </Button>
      )}
    </div>
  )
}
