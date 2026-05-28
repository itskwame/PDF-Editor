import { getStripe, isStripeConfigured } from '../../../src/lib/stripe'
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '../../../src/lib/supabaseAdmin'

export const config = {
  api: {
    bodyParser: false,
  },
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []

    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function planFromSubscription(subscription) {
  return subscription.metadata?.plan === 'pro' ? 'pro' : 'basic'
}

async function upsertSubscription(subscription) {
  const userId = subscription.metadata?.user_id

  if (!userId) {
    return
  }

  const supabase = getSupabaseAdminClient()

  await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      plan: planFromSubscription(subscription),
      status: subscription.status,
      stripe_customer_id: String(subscription.customer),
      stripe_subscription_id: subscription.id,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isSupabaseAdminConfigured() || !isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Stripe webhook is not configured.' })
  }

  const stripe = getStripe()
  const rawBody = await readRawBody(req)
  const signature = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (error) {
    return res.status(400).json({ error: `Webhook signature verification failed: ${error.message}` })
  }

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    await upsertSubscription(event.data.object)
  }

  return res.status(200).json({ received: true })
}
