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
  const { error } = await supabase.from('subscriptions').upsert(
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

  if (error) {
    throw error
  }
}

async function recordSubscriptionCheckout(session) {
  if (!session.subscription) {
    return
  }

  const stripe = getStripe()
  const subscription = await stripe.subscriptions.retrieve(
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription.id,
  )

  await upsertSubscription(subscription)
}

async function markRelatedWorkPaid(supabase, paymentRecord) {
  const trustedPaymentFields = {
    paid: true,
    selected_page_package: paymentRecord.page_package,
    with_images: paymentRecord.with_images,
    status: 'paid',
    stripe_session_id: paymentRecord.stripe_session_id,
    stripe_payment_intent_id: paymentRecord.stripe_payment_intent_id,
    updated_at: paymentRecord.updated_at,
  }

  if (!paymentRecord.book_id) {
    throw new Error('Missing book_id in Stripe checkout metadata.')
  }

  const { error } = await supabase
    .from('books')
    .update(trustedPaymentFields)
    .eq('id', paymentRecord.book_id)
    .eq('user_id', paymentRecord.user_id)

  if (error) {
    throw error
  }
}

async function recordOneTimePayment(session) {
  if (session.payment_status !== 'paid') {
    return
  }

  const userId = session.metadata?.user_id || session.client_reference_id

  if (!userId) {
    return
  }

  const supabase = getSupabaseAdminClient()
  const now = new Date().toISOString()
  const paymentRecord = {
    user_id: userId,
    book_id: session.metadata?.book_id || null,
    page_package: session.metadata?.page_package || null,
    with_images: session.metadata?.with_images === 'true',
    price_id: session.metadata?.price_id || null,
    status: 'paid',
    stripe_customer_id: session.customer ? String(session.customer) : null,
    stripe_payment_intent_id: session.payment_intent
      ? String(session.payment_intent)
      : null,
    stripe_session_id: session.id,
    paid_at: now,
    updated_at: now,
  }

  let { error } = await supabase.from('payments').upsert(paymentRecord, {
    onConflict: 'stripe_session_id',
  })

  if (error && (error.code === '42P01' || error.code === 'PGRST205')) {
    ;({ error } = await supabase.from('book_package_payments').upsert(
      paymentRecord,
      { onConflict: 'stripe_session_id' },
    ))
  }

  if (error) {
    throw error
  }

  await markRelatedWorkPaid(supabase, paymentRecord)
}

async function handleCheckoutSessionCompleted(session) {
  if (session.mode === 'subscription') {
    await recordSubscriptionCheckout(session)
    return
  }

  await recordOneTimePayment(session)
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

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutSessionCompleted(event.data.object)
    }
  } catch (error) {
    return res.status(500).json({ error: `Webhook handler failed: ${error.message}` })
  }

  return res.status(200).json({ received: true })
}
