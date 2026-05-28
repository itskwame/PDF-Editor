import { getAppUrl, getStripe, isStripeConfigured } from '../../../src/lib/stripe'
import { getUserFromRequest, isSupabaseAdminConfigured } from '../../../src/lib/supabaseAdmin'

const PRICE_ENV_BY_PLAN = {
  basic: 'STRIPE_BASIC_PRICE_ID',
  pro: 'STRIPE_PRO_PRICE_ID',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isSupabaseAdminConfigured() || !isStripeConfigured()) {
    return res.status(500).json({ error: 'Billing is not configured.' })
  }

  const { plan } = req.body || {}
  const priceEnv = PRICE_ENV_BY_PLAN[plan]
  const price = priceEnv ? process.env[priceEnv] : null

  if (!price) {
    return res.status(400).json({ error: 'Unknown or unconfigured plan.' })
  }

  const { user, error, supabase } = await getUserFromRequest(req)

  if (error) {
    return res.status(401).json({ error })
  }

  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  const stripe = getStripe()
  const appUrl = getAppUrl(req)

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: existingSubscription?.stripe_customer_id || undefined,
    customer_email: existingSubscription?.stripe_customer_id ? undefined : user.email,
    line_items: [{ price, quantity: 1 }],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    client_reference_id: user.id,
    metadata: {
      user_id: user.id,
      plan,
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
        plan,
      },
    },
  })

  return res.status(200).json({ url: session.url })
}
