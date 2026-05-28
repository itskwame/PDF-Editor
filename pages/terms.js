import Link from 'next/link'

export default function Terms() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
      <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
        <Link href="/" className="text-2xl font-black tracking-tight">
          FreePDF<span className="text-blue-600">Flow</span>
        </Link>
        <h1 className="mt-8 text-4xl font-black">Terms of Service</h1>
        <p className="mt-4 text-sm text-slate-500">Last updated: May 28, 2026</p>
        <div className="mt-6 grid gap-5 text-sm leading-7 text-slate-700">
          <p>FreePDFFlow provides browser-based PDF editing tools. You are responsible for the files you choose to edit and export.</p>
          <p>Free accounts include 3 completed PDF exports per month. Basic includes 25 PDF exports per month. Pro includes 100 PDF exports per month.</p>
          <p>AI features are not part of the Free plan and are marked coming soon until authentication, plan checks, usage limits, and rate limits are enabled.</p>
          <p>Paid subscriptions are billed through Stripe and may be cancelled according to the billing controls made available to you.</p>
        </div>
      </article>
    </main>
  )
}
