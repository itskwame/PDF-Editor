import Link from 'next/link'

export default function Privacy() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
      <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
        <Link href="/" className="text-2xl font-black tracking-tight">
          FreePDF<span className="text-blue-600">Flow</span>
        </Link>
        <h1 className="mt-8 text-4xl font-black">Privacy Policy</h1>
        <p className="mt-4 text-sm text-slate-500">Last updated: May 28, 2026</p>
        <div className="mt-6 grid gap-5 text-sm leading-7 text-slate-700">
          <p>FreePDFFlow processes PDF files in your browser during the MVP. We do not store uploaded PDF files on our server for the current editing flow.</p>
          <p>We use account information, subscription status, and monthly usage records to enforce PDF export limits and paid plan access.</p>
          <p>Payments are handled by Stripe. We do not store full card numbers on our servers.</p>
          <p>Browser autosave stores draft PDF data locally in your browser storage. You can clear the draft from the editor.</p>
          <p>AI features are coming soon. AI usage is tracked separately from PDF exports and is not included in the Free plan.</p>
        </div>
      </article>
    </main>
  )
}
