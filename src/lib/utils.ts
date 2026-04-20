import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { OrderStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '…'
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(dateStr))
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr))
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    'Pending',
  confirmed:  'Confirmed',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    'text-amber-400 bg-amber-400/10 border-amber-400/20',
  confirmed:  'text-blue-400 bg-blue-400/10 border-blue-400/20',
  processing: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  shipped:    'text-purple-400 bg-purple-400/10 border-purple-400/20',
  delivered:  'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  cancelled:  'text-red-400 bg-red-400/10 border-red-400/20',
}

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered',
]

// ─── Aliases for backward-compat with older import names ─────────────────────
/** Alias for {@link formatPrice} */
export const formatDollars = formatPrice

/** Alias for {@link formatDiscount} — returns integer discount percentage */
export const discountPercent = formatDiscount
