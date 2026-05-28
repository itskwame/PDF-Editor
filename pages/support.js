import Link from 'next/link'

export default function Support() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
      <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
        <Link href="/" className="text-2xl font-black tracking-tight">
          FreePDF<span className="text-blue-600">Flow</span>
        </Link>
        <h1 className="mt-8 text-4xl font-black">Support</h1>
        <p className="mt-4 text-sm leading-7 text-slate-700">
          For account, billing, or PDF export issues, contact support with your account email, browser, and a short description of what happened.
        </p>
        <a className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white" href="mailto:support@freepdfflow.com">
          Email support
        </a>
      </section>
    </main>
  )
}
