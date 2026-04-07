import { useCartStore } from '@/store'

// Convenience hook that exposes computed cart values alongside actions
export function useCart() {
  const store = useCartStore()
  return {
    ...store,
    itemCount: store.getItemCount(),
    subtotal: store.getSubtotal(),
  }
}
