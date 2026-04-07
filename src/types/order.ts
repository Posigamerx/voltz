import type { CartItem } from './cart'
import type { Address } from './user'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  user_id: string
  items: CartItem[]
  shipping_address: Address
  status: OrderStatus
  subtotal: number
  shipping: number
  tax: number
  total: number
  stripe_payment_intent_id?: string
  created_at: string
  updated_at: string
}
