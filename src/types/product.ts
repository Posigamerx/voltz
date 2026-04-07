export type Category =
  | 'phones'
  | 'laptops'
  | 'audio'
  | 'cameras'
  | 'wearables'
  | 'accessories'
  | 'gaming'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price?: number
  category: Category
  brand: string
  sku: string
  stock: number
  rating: number
  review_count: number
  images: string[]
  tags: string[]
  specs: Record<string, string>
  featured: boolean
  created_at: string
}

export interface ProductFilters {
  category?: Category
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  search?: string
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest'
}
