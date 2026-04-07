// Supabase Edge Function — confirm-order
// Called after Stripe payment succeeds — saves order to DB

import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { paymentIntentId, items, shippingAddress, userId } = await req.json()

    // Verify payment actually succeeded with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.status !== 'succeeded') {
      return new Response(
        JSON.stringify({ error: 'Payment not confirmed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role key to bypass RLS for order creation
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const subtotal    = items.reduce((s: number, i: { product: { price: number }, quantity: number }) => s + i.product.price * i.quantity, 0)
    const shipping    = subtotal >= 100 ? 0 : 9.99
    const tax         = subtotal * 0.08
    const total       = subtotal + shipping + tax

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id:                   userId,
        items,
        shipping_address:          shippingAddress,
        status:                    'confirmed',
        subtotal,
        shipping:                  shipping,
        tax,
        total,
        stripe_payment_intent_id:  paymentIntentId,
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ orderId: order.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Order error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Order failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
