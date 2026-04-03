import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'nodejs'

async function stripePost(path: string, body: Record<string, unknown>) {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(body)) {
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === 'object' && item !== null) {
          for (const [ik, iv] of Object.entries(item as Record<string, unknown>)) {
            params.append(`${k}[${i}][${ik}]`, String(iv))
          }
        }
      })
    } else if (typeof v === 'object' && v !== null) {
      for (const [ok, ov] of Object.entries(v as Record<string, unknown>)) {
        params.append(`${k}[${ok}]`, String(ov))
      }
    } else {
      params.append(k, String(v))
    }
  }
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })
  return res.json()
}

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId: string | undefined = profile?.stripe_customer_id ?? undefined

    if (!customerId) {
      const customer = await stripePost('/customers', {
        email: user.email ?? '',
        metadata: { supabase_user_id: user.id },
      }) as { id: string }
      customerId = customer.id
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const siteUrl = 'https://www.furipare.com'
    const session = await stripePost('/checkout/sessions', {
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${siteUrl}/dashboard?upgraded=true`,
      cancel_url: `${siteUrl}/dashboard`,
      metadata: { supabase_user_id: user.id },
    }) as { url: string; error?: { message: string } }

    if (session.error) {
      return Response.json({ error: session.error.message }, { status: 500 })
    }

    return Response.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[stripe/checkout]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
