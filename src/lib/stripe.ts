// Stripe is loaded client-side only when needed (checkout page)
// The actual Stripe.js is loaded dynamically to keep initial bundle small.

import { Stripe, loadStripe } from '@stripe/stripe-js'
import { supabase } from './supabase'

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string

let stripePromise: Promise<Stripe | null>

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export async function createPaymentIntent(total: number, metadata: Record<string, any>) {
  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: { amount: total / 100, metadata }
  })
  
  if (error) {
    throw new Error(error.message || 'Failed to create payment intent')
  }
  
  return data
}

export async function confirmOrder(payload: any) {
  const { data, error } = await supabase.functions.invoke('confirm-order', {
    body: payload
  })
  
  if (error) {
    throw new Error(error.message || 'Failed to confirm order')
  }
  
  return data
}

// This will be used in CheckoutPage to load Stripe lazily
export async function loadStripeInstance() {
  return getStripe()
}
