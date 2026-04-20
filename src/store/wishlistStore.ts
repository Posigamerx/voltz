import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  items: string[] // productIds
  add: (productId: string) => void
  remove: (productId: string) => void
  toggle: (productId: string) => void
  has: (productId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add:    (id) => set((s) => ({ items: s.items.includes(id) ? s.items : [...s.items, id] })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i !== id) })),
      toggle: (id) => get().has(id) ? get().remove(id) : get().add(id),
      has:    (id) => get().items.includes(id),
      clear:  ()  => set({ items: [] }),
    }),
    { name: 'voltz-wishlist' }
  )
)
