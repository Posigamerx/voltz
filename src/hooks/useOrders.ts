import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Order, OrderStatus } from '@/types'

// ─── User: fetch own orders ────────────────────────────────────────────────
export function useOrders(userId?: string) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Order[]
    },
    enabled: !!userId,
  })
}

export function useOrder(orderId?: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId!)
        .single()
      if (error) throw error
      return data as Order
    },
    enabled: !!orderId,
  })
}

// ─── Admin: fetch ALL orders ───────────────────────────────────────────────
export function useAllOrders() {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Order[]
    },
  })
}

// ─── Admin: update order status ────────────────────────────────────────────
export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Order
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
      qc.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
