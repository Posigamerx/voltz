import { useCartStore } from '@/store'
import { formatPrice } from '@/lib/utils'

const SHIPPING_THRESHOLD = 100
const SHIPPING_COST = 9.99
const TAX_RATE = 0.08

export function CartSummary() {
  const { getSubtotal } = useCartStore()
  const subtotal = getSubtotal()
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = subtotal * TAX_RATE
  const grandTotal = subtotal + shipping + tax

  return (
    <div className="flex flex-col gap-2 font-mono text-sm">
      <div className="flex justify-between text-white/50">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-white/50">
        <span>Shipping</span>
        <span>
          {shipping === 0 ? (
            <span className="text-emerald-400">Free</span>
          ) : (
            formatPrice(shipping)
          )}
        </span>
      </div>
      <div className="flex justify-between text-white/50">
        <span>Tax (8%)</span>
        <span>{formatPrice(tax)}</span>
      </div>
      <div className="mt-1 flex justify-between border-t border-white/8 pt-2 font-semibold text-white">
        <span>Total</span>
        <span className="text-volt-400">{formatPrice(grandTotal)}</span>
      </div>
      {shipping > 0 && (
        <p className="text-[10px] text-white/30 text-center">
          Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for free shipping
        </p>
      )}
    </div>
  )
}
