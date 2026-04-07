import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Product, ProductFilters } from '@/types'

async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let query = supabase.from('products').select('*')

  if (filters.category) query = query.eq('category', filters.category)
  if (filters.brand) query = query.eq('brand', filters.brand)
  if (filters.minPrice) query = query.gte('price', filters.minPrice)
  if (filters.maxPrice) query = query.lte('price', filters.maxPrice)
  if (filters.inStock) query = query.gt('stock', 0)
  if (filters.search) query = query.ilike('name', `%${filters.search}%`)

  switch (filters.sortBy) {
    case 'price_asc':  query = query.order('price', { ascending: true });  break
    case 'price_desc': query = query.order('price', { ascending: false }); break
    case 'rating':     query = query.order('rating', { ascending: false }); break
    case 'newest':     query = query.order('created_at', { ascending: false }); break
    default:           query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query
  if (error) throw error
  return data as Product[]
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(8)
      if (error) throw error
      return data as Product[]
    },
  })
}
