import { useState, useEffect } from 'react'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { getStripe, createPaymentIntent, confirmOrder } from '@/lib/stripe'
import { useCartStore, useAuthStore } from '@/store'
import { Button } from '@/components/ui'
import { formatPrice } from '@/lib/utils'
import type { ShippingData } from './ShippingForm'

// ─── Inner form (must be inside <Elements>) ────────────────────────────────
interface InnerFormProps {
  clientSecret: string
  total: number
  shippingData: ShippingData
  onSuccess: (orderId: string) => void
  onBack: () => void
}

function StripeForm({ clientSecret, total, shippingData, onSuccess, onBack }: InnerFormProps) {
  const stripe    = useStripe()
  const elements  = useElements()
  const { items, clearCart } = useCartStore()
  const { user }  = useAuthStore()
  const [error, setError]       = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    setError(null)

    try {
      // 1. Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
          payment_method_data: {
            billing_details: { name: shippingData.fullName },
          },
        },
        redirect: 'if_required', // stay on page if no redirect needed
      })

      if (stripeError) {
        setError(stripeError.message ?? 'Payment failed')
        setIsLoading(false)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        // 2. Save order to Supabase via Edge Function
        const { orderId } = await confirmOrder({
          paymentIntentId: paymentIntent.id,
          items,
          shippingAddress: shippingData,
          userId: user?.id,
        })

        clearCart()
        onSuccess(orderId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Stripe's embedded card UI */}
      <div className="rounded-xl border border-white/8 bg-zinc-900/50 p-5">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/30">
          Card details
        </p>
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs text-white/30">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Payments secured by Stripe. VOLTZ never stores card data.
      </div>

      {/* Test card hint */}
      <div className="rounded-lg border border-volt-400/10 bg-volt-400/5 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-volt-400/60 mb-1">Test mode</p>
        <p className="font-mono text-xs text-white/40">
          Use card <span className="text-white/70">4242 4242 4242 4242</span> · any future date · any CVC
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack} className="flex-1" disabled={isLoading}>
          ← Back
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          Pay {formatPrice(total)}
        </Button>
      </div>
    </form>
  )
}

// ─── Outer wrapper — fetches PaymentIntent then mounts Elements ────────────
interface PaymentFormProps {
  shippingData: ShippingData
  total: number
  onSuccess: (orderId: string) => void
  onBack: () => void
}

export function PaymentForm({ shippingData, total, onSuccess, onBack }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError]               = useState<string | null>(null)
  const { items }                        = useCartStore()

  useEffect(() => {
    const metadata = {
      items: JSON.stringify(items.map(i => ({ id: i.product.id, qty: i.quantity }))),
    }
    createPaymentIntent(total, metadata)
      .then(({ clientSecret }) => setClientSecret(clientSecret))
      .catch((err) => setError(err.message))
  }, [total]) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
        <p className="text-xs text-white/30">
          Make sure your Supabase Edge Function is deployed and STRIPE_SECRET_KEY is set.
        </p>
        <Button variant="secondary" onClick={onBack}>← Back</Button>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-white/8 bg-zinc-900/50 p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/30">
            Card details
          </p>
          {/* Skeleton while PaymentIntent loads */}
          <div className="flex flex-col gap-3">
            <div className="skeleton h-11 rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton h-11 rounded-lg" />
              <div className="skeleton h-11 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack} className="flex-1">← Back</Button>
          <Button disabled className="flex-1">Loading…</Button>
        </div>
      </div>
    )
  }

  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary:         '#e8ff00',
            colorBackground:      '#18181b',
            colorText:            '#ffffff',
            colorDanger:          '#f87171',
            fontFamily:           '"DM Sans", sans-serif',
            borderRadius:         '8px',
          },
        },
      }}
    >
      <StripeForm
        clientSecret={clientSecret}
        total={total}
        shippingData={shippingData}
        onSuccess={onSuccess}
        onBack={onBack}
      />
    </Elements>
  )
}
