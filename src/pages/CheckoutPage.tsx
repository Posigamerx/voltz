import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/hooks'
import { formatDollars } from '@/lib/utils'
import { Button } from '@/components/ui'
import { CheckoutSteps, PaymentForm, ShippingForm, OrderConfirmation } from '@/components/checkout'
import type { ShippingData } from '@/components/checkout'

type CheckoutStep = 'shipping' | 'payment' | 'success'

export function CheckoutPage() {
  const { items, subtotal } = useCart()
  const shippingCost = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [shippingData, setShippingData] = useState<ShippingData | null>(null)
  const [orderId, setOrderId] = useState<string | undefined>()

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-white/40 mb-4">Your cart is empty.</p>
        <Link to="/products"><Button>Shop now</Button></Link>
      </div>
    )
  }

  const stepNumber = step === 'shipping' ? 1 : step === 'payment' ? 2 : 3

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <h1 className="font-display text-3xl font-bold">Checkout</h1>
        <CheckoutSteps current={stepNumber} />
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Main form area */}
        <div className="lg:col-span-3 space-y-6">
          {step === 'shipping' && (
            <div className="bg-zinc-900 rounded-2xl border border-white/5 p-6">
              <h2 className="font-display text-xl font-semibold mb-6">Shipping information</h2>
              <ShippingForm 
                onNext={(data) => {
                  setShippingData(data)
                  setStep('payment')
                }} 
              />
            </div>
          )}

          {step === 'payment' && shippingData && (
            <div className="bg-zinc-900 rounded-2xl border border-white/5 p-6">
              <h2 className="font-display text-xl font-semibold mb-6">Payment details</h2>
              <PaymentForm 
                total={Math.round(total * 100)} 
                shippingData={shippingData} 
                onSuccess={(id) => {
                  setOrderId(id)
                  setStep('success')
                }} 
                onBack={() => setStep('shipping')} 
              />
            </div>
          )}

          {step === 'success' && (
             <div className="bg-zinc-900 rounded-2xl border border-white/5 p-6">
               <OrderConfirmation orderId={orderId} />
             </div>
          )}
        </div>

        {/* Order summary */}
        {step !== 'success' && (
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 rounded-2xl border border-white/5 p-6 space-y-4 sticky top-24">
              <h2 className="font-display font-semibold">Order summary</h2>
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-white/60">{item.product.name} × {item.quantity}</span>
                  <span>{formatDollars(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-white/5 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-white/50">
                  <span>Subtotal</span><span>{formatDollars(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Shipping</span><span>{shippingCost === 0 ? 'Free' : formatDollars(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Tax (8%)</span><span>{formatDollars(tax)}</span>
                </div>
                <div className="flex justify-between font-display font-bold text-base pt-2 border-t border-white/5">
                  <span>Total</span><span>{formatDollars(total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
