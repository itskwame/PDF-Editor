import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from '../src/lib/supabaseBrowser'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [status, setStatus] = useState('Loading account...')
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function loadSummary() {
    const supabase = getSupabaseBrowserClient()

    if (!supabase) {
      setStatus('Supabase is not configured.')
      return
    }

    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    if (!token) {
      setStatus('Please sign in to view your dashboard.')
      return
    }

    const response = await fetch('/api/account/summary', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const payload = await response.json()

    if (!response.ok) {
      setStatus(payload.error || 'Could not load account summary.')
      return
    }

    setSummary(payload)
    setStatus('')
  }

  useEffect(() => {
    loadSummary()
  }, [])

  async function signOut() {
    setIsSigningOut(true)
    await getSupabaseBrowserClient()?.auth.signOut()
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-black tracking-tight">
            FreePDF<span className="text-blue-600">Flow</span>
          </Link>
          <div className="flex gap-3">
            <Link className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white" href="/edit">
              Edit PDF
            </Link>
            <button
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold"
              disabled={isSigningOut}
              onClick={signOut}
              type="button"
            >
              Sign out
            </button>
          </div>
        </div>

        <h1 className="mt-10 text-4xl font-black">Dashboard</h1>

        {!isSupabaseBrowserConfigured() || status ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-slate-700 shadow-sm">
            {status}
            {status.includes('sign in') ? (
              <div className="mt-4">
                <Link className="font-black text-blue-700" href="/login?next=/dashboard">
                  Sign in
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        {summary ? (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-black uppercase text-slate-500">Current plan</h2>
              <p className="mt-3 text-3xl font-black">{summary.planName}</p>
              <p className="mt-2 text-sm text-slate-600">Status: {summary.subscriptionStatus}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-black uppercase text-slate-500">PDF exports</h2>
              <p className="mt-3 text-3xl font-black">
                {summary.exports.used} / {summary.exports.limit}
              </p>
              <p className="mt-2 text-sm text-slate-600">Month: {summary.periodMonth}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-black uppercase text-slate-500">AI actions</h2>
              <p className="mt-3 text-3xl font-black">
                {summary.ai.used} / {summary.ai.limit}
              </p>
              <p className="mt-2 text-sm text-slate-600">Coming soon for MVP.</p>
            </article>
          </div>
        ) : null}

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Plan limits</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            PDF editing happens in your browser during the MVP. The server checks your account before each completed export.
          </p>
          <Link className="mt-4 inline-flex rounded-lg border border-slate-300 px-4 py-3 text-sm font-black" href="/pricing">
            View pricing
          </Link>
        </div>
      </section>
    </main>
  )
}
