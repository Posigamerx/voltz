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

// ─── Payment result states ─────────────────────────────────────────────────
type PaymentState = 'idle' | 'processing' | 'success' | 'error'

interface StripeFormProps {
  total: number
  shippingData: ShippingData
  onSuccess: (orderId: string) => void
  onBack: () => void
}

function StripeForm({ total, shippingData, onSuccess, onBack }: StripeFormProps) {
  const stripe    = useStripe()
  const elements  = useElements()
  const { items, clearCart } = useCartStore()
  const { user }  = useAuthStore()
  const [state, setState]   = useState<PaymentState>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !user) return

    setState('processing')
    setErrorMsg(null)

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
          payment_method_data: { billing_details: { name: shippingData.fullName } },
        },
        redirect: 'if_required',
      })

      if (stripeError) {
        setState('error')
        setErrorMsg(stripeError.message ?? 'Payment failed')
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        const { orderId } = await confirmOrder({
          paymentIntentId: paymentIntent.id,
          items,
          shippingAddress: shippingData,
          userId: user.id,
        })
        clearCart()
        setState('success')
        onSuccess(orderId)
      }
    } catch (err) {
      setState('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <div className="flex flex-col items-center gap-5 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
          <span className="text-3xl">✕</span>
        </div>
        <div>
          <p className="font-display text-xl font-bold text-red-400">Payment failed</p>
          <p className="mt-2 text-sm text-white/50">{errorMsg}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack}>← Back</Button>
          <Button onClick={() => { setState('idle'); setErrorMsg(null) }}>Try again</Button>
        </div>
      </div>
    )
  }

  // ── Processing overlay ───────────────────────────────────────────────────
  if (state === 'processing') {
    return (
      <div className="flex flex-col items-center gap-5 py-12 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-volt-400 border-t-transparent" />
        <div>
          <p className="font-display text-xl font-bold">Processing payment</p>
          <p className="mt-1 text-sm text-white/40">Please don't close this page…</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-xl border border-white/8 bg-zinc-900/50 p-5">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/30">Card details</p>
        <PaymentElement
          options={{
            layout: 'tabs',
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary:         '#e8ff00',
                colorBackground:      '#18181b',
                colorText:            '#ffffff',
                colorDanger:          '#f87171',
                fontFamily:           '"DM Sans", sans-serif',
                borderRadius:         '8px',
                colorInputBackground: '#111113',
                colorTextPlaceholder: 'rgba(255,255,255,0.25)',
              },
            },
          }}
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-white/30">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Payments secured by Stripe. VOLTZ never stores card data.
      </div>

      {/* Test card hint */}
      <div className="rounded-lg border border-volt-400/10 bg-volt-400/5 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-volt-400/60 mb-2">Test cards</p>
        <div className="flex flex-col gap-1">
          {[
            { card: '4242 4242 4242 4242', result: 'Success ✓',    color: 'text-emerald-400' },
            { card: '4000 0000 0000 9995', result: 'Declined ✕',   color: 'text-red-400' },
            { card: '4000 0025 0000 3155', result: '3D Secure',     color: 'text-amber-400' },
          ].map(({ card, result, color }) => (
            <div key={card} className="flex items-center justify-between">
              <span className="font-mono text-xs text-white/50">{card}</span>
              <span className={`font-mono text-[10px] ${color}`}>{result}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] text-white/25">Any future date · any CVC</p>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack} className="flex-1">← Back</Button>
        <Button type="submit" className="flex-1">Pay {formatPrice(total)}</Button>
      </div>
    </form>
  )
}

// ─── Outer wrapper ─────────────────────────────────────────────────────────
interface PaymentFormProps {
  shippingData: ShippingData
  total: number
  onSuccess: (orderId: string) => void
  onBack: () => void
}

export function PaymentForm({ shippingData, total, onSuccess, onBack }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError]               = useState<string | null>(null)
  const { items } = useCartStore()

  useEffect(() => {
    const metadata = { items: JSON.stringify(items.map(i => ({ id: i.product.id, qty: i.quantity }))) }
    createPaymentIntent(total, metadata)
      .then(({ clientSecret }) => setClientSecret(clientSecret))
      .catch((err) => setError(err.message))
  }, [total]) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400/60 mb-2">Edge Function not connected</p>
          <p className="text-sm text-white/50">{error}</p>
          <p className="mt-3 text-xs text-white/30">
            Deploy the Edge Functions and set STRIPE_SECRET_KEY to enable live payments.
          </p>
        </div>
        <Button variant="secondary" onClick={onBack}>← Back</Button>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-xl border border-white/8 bg-zinc-900/50 p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/30">Card details</p>
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
          <Button disabled className="flex-1">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Preparing…
          </Button>
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
            colorPrimary: '#e8ff00', colorBackground: '#18181b',
            colorText: '#ffffff', colorDanger: '#f87171',
            fontFamily: '"DM Sans", sans-serif', borderRadius: '8px',
            colorInputBackground: '#111113',
          },
        },
      }}
    >
      <StripeForm total={total} shippingData={shippingData} onSuccess={onSuccess} onBack={onBack} />
    </Elements>
  )
}
