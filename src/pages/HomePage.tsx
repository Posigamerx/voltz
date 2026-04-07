import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { ProductGrid } from '@/components/product'
import { useFeaturedProducts } from '@/hooks'

const CATEGORIES = [
  { label: 'Phones',      slug: 'phones',      icon: '📱' },
  { label: 'Laptops',     slug: 'laptops',     icon: '💻' },
  { label: 'Audio',       slug: 'audio',       icon: '🎧' },
  { label: 'Cameras',     slug: 'cameras',     icon: '📷' },
  { label: 'Wearables',   slug: 'wearables',   icon: '⌚' },
  { label: 'Gaming',      slug: 'gaming',      icon: '🎮' },
]

export function HomePage() {
  const { data: featured, isLoading } = useFeaturedProducts()

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid-dark bg-grid opacity-50" />
        {/* Volt glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-volt-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-mono text-volt-400 bg-volt-400/10 border border-volt-400/20 rounded-full px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-volt-400 animate-pulse" />
              New arrivals weekly
            </span>
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              Next-gen
              <br />
              <span className="text-volt-400">electronics.</span>
            </h1>
            <p className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">
              Cutting-edge gadgets, flagship phones, pro audio. Everything for the tech-obsessed,
              curated and shipped fast.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg">Shop all products</Button>
              </Link>
              <Link to="/products?category=phones">
                <Button size="lg" variant="secondary">Browse phones</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="font-display text-2xl font-bold mb-8">Shop by category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map(({ label, slug, icon }) => (
            <Link
              key={slug}
              to={`/products?category=${slug}`}
              className="flex flex-col items-center gap-3 p-4 bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-white/15 rounded-2xl transition-all group"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold">Featured</h2>
          <Link to="/products" className="text-sm text-volt-400 hover:text-volt-300 transition-colors">
            View all →
          </Link>
        </div>
        <ProductGrid products={featured} isLoading={isLoading} />
      </section>
    </div>
  )
}
