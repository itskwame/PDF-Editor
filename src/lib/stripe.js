import Stripe from 'stripe'

let stripe

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

export function getStripe() {
  if (!isStripeConfigured()) {
    throw new Error('STRIPE_SECRET_KEY is not configured.')
  }

  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }

  return stripe
}

export function getAppUrl(req) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }

  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers.host || 'localhost:3000'
  return `${protocol}://${host}`
}
