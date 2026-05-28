import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from '../src/lib/supabaseBrowser'

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isConfigured = isSupabaseBrowserConfigured()

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('')
    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        setStatus('Supabase is not configured yet.')
        return
      }

      const authCall =
        mode === 'sign-up'
          ? supabase.auth.signUp({ email, password })
          : supabase.auth.signInWithPassword({ email, password })

      const { data, error } = await authCall

      if (error) {
        setStatus(error.message)
        return
      }

      if (mode === 'sign-up' && !data.session) {
        setStatus('Account created. Check your email to confirm before signing in.')
        return
      }

      router.push(router.query.next || '/dashboard')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
      <section className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70">
        <Link href="/" className="text-2xl font-black tracking-tight">
          FreePDF<span className="text-blue-600">Flow</span>
        </Link>
        <h1 className="mt-8 text-3xl font-black">
          {mode === 'sign-up' ? 'Create your account' : 'Sign in'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          An account is required before exporting so monthly PDF export limits can be enforced server-side.
        </p>

        {!isConfigured ? (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable auth locally.
          </div>
        ) : null}

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-bold">
            Email
            <input
              autoComplete="email"
              className="rounded-lg border border-slate-300 px-3 py-3 font-normal"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Password
            <input
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
              className="rounded-lg border border-slate-300 px-3 py-3 font-normal"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <button
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={!isConfigured || isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Working...' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {status ? (
          <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm leading-6 text-slate-700">{status}</p>
        ) : null}

        <button
          className="mt-5 text-sm font-bold text-blue-700"
          onClick={() => {
            setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up')
            setStatus('')
          }}
          type="button"
        >
          {mode === 'sign-up' ? 'Already have an account? Sign in' : 'Need an account? Create one'}
        </button>
      </section>
    </main>
  )
}
