import { getAppUrl, getStripe, isStripeConfigured } from '../../../src/lib/stripe'
import { getUserFromRequest, isSupabaseAuthConfigured } from '../../../src/lib/auth'
import { BOOK_FIELDS } from '../../../src/lib/bookforge'

const PRICE_ENV_BY_PACKAGE = {
  10: {
    false: 'STRIPE_PRICE_10_NO_IMAGES',
    true: 'STRIPE_PRICE_10_WITH_IMAGES',
  },
  50: {
    false: 'STRIPE_PRICE_50_NO_IMAGES',
    true: 'STRIPE_PRICE_50_WITH_IMAGES',
  },
  100: {
    false: 'STRIPE_PRICE_100_NO_IMAGES',
    true: 'STRIPE_PRICE_100_WITH_IMAGES',
  },
  200: {
    false: 'STRIPE_PRICE_200_NO_IMAGES',
    true: 'STRIPE_PRICE_200_WITH_IMAGES',
  },
  300: {
    false: 'STRIPE_PRICE_300_NO_IMAGES',
    true: 'STRIPE_PRICE_300_WITH_IMAGES',
  },
  500: {
    false: 'STRIPE_PRICE_500_NO_IMAGES',
    true: 'STRIPE_PRICE_500_WITH_IMAGES',
  },
}

function parseWithImages(value) {
  if (value === true || value === 'true') return true
  if (value === false || value === 'false') return false
  return null
}

function resolvePriceId(pagePackage, withImages) {
  const packageKey = String(pagePackage || '')
  const envName = PRICE_ENV_BY_PACKAGE[packageKey]?.[String(withImages)]
  return envName ? process.env[envName] : null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isSupabaseAuthConfigured() || !isStripeConfigured()) {
    return res.status(500).json({ error: 'Billing is not configured.' })
  }

  const {
    book_id: bookId,
    page_package: pagePackage,
    with_images: withImages,
  } = req.body || {}
  const selectedPackage = String(pagePackage || '')
  const selectedWithImages = parseWithImages(withImages)

  if (!PRICE_ENV_BY_PACKAGE[selectedPackage] || selectedWithImages === null) {
    return res.status(400).json({ error: 'Invalid book package selection.' })
  }

  const priceId = resolvePriceId(selectedPackage, selectedWithImages)

  if (!priceId) {
    return res.status(400).json({ error: 'Unknown or unconfigured book package.' })
  }

  const { user, error, supabase } = await getUserFromRequest(req)

  if (error) {
    return res.status(401).json({ error })
  }

  if (!bookId) {
    return res.status(400).json({ error: 'book_id is required.' })
  }

  const { data: book, error: bookError } = await supabase
    .from('books')
    .select(BOOK_FIELDS)
    .eq('id', bookId)
    .eq('user_id', user.id)
    .single()

  if (bookError || !book) {
    return res.status(400).json({ error: 'Invalid book_id.' })
  }

  const stripe = getStripe()
  const appUrl = getAppUrl(req)
  const metadata = {
    user_id: user.id,
    page_package: selectedPackage,
    with_images: selectedWithImages ? 'true' : 'false',
    price_id: priceId,
    book_id: String(bookId),
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    client_reference_id: user.id,
    metadata,
    payment_intent_data: {
      metadata,
    },
  })

  return res.status(200).json({ url: session.url })
}
