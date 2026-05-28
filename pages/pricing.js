import Link from 'next/link'
import { useState } from 'react'
import { PLAN_LIMITS } from '../src/lib/plans'
import { getSupabaseBrowserClient } from '../src/lib/supabaseBrowser'

const plans = [
  {
    id: 'free',
    cta: 'Start editing',
    description: 'For occasional browser-based PDF edits.',
  },
  {
    id: 'basic',
    cta: 'Upgrade to Basic',
    description: 'For regular PDF exports.',
  },
  {
    id: 'pro',
    cta: 'Upgrade to Pro',
    description: 'For heavier PDF workflows.',
  },
]

export default function Pricing() {
  const [status, setStatus] = useState('')
  const [loadingPlan, setLoadingPlan] = useState('')

  async function startCheckout(plan) {
    if (plan === 'free') {
      window.location.href = '/edit'
      return
    }

    setLoadingPlan(plan)
    setStatus('')

    try {
      const supabase = getSupabaseBrowserClient()
      const { data } = (await supabase?.auth.getSession()) || { data: {} }
      const token = data.session?.access_token

      if (!token) {
        window.location.href = `/login?next=/pricing`
        return
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      })
      const payload = await response.json()

      if (!response.ok) {
        setStatus(payload.error || 'Could not start checkout.')
        return
      }

      window.location.href = payload.url
    } finally {
      setLoadingPlan('')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-black tracking-tight">
            FreePDF<span className="text-blue-600">Flow</span>
          </Link>
          <Link className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold" href="/dashboard">
            Dashboard
          </Link>
        </div>

        <h1 className="mt-10 text-4xl font-black">Pricing</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          PDF export limits and AI usage are tracked separately. AI features are coming soon and are not available on the Free plan.
        </p>

        {status ? (
          <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{status}</p>
        ) : null}

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const limits = PLAN_LIMITS[plan.id]

            return (
              <article
                className={`rounded-xl border bg-white p-6 shadow-sm ${
                  plan.id === 'basic' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'
                }`}
                key={plan.id}
              >
                <h2 className="text-2xl font-black">{limits.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{plan.description}</p>
                <p className="mt-5 text-4xl font-black">
                  {limits.price}
                  <span className="text-base font-medium text-slate-500">/month</span>
                </p>
                <ul className="mt-5 grid gap-3 text-sm font-semibold text-slate-700">
                  <li>{limits.monthlyExports} PDF exports/month</li>
                  <li>{limits.monthlyAiActions} AI actions/month</li>
                  <li>PDF files processed in your browser during MVP</li>
                  <li>AI tools marked coming soon until protected usage limits are enabled</li>
                </ul>
                <button
                  className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:bg-slate-400"
                  disabled={loadingPlan === plan.id}
                  onClick={() => startCheckout(plan.id)}
                  type="button"
                >
                  {loadingPlan === plan.id ? 'Opening...' : plan.cta}
                </button>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
