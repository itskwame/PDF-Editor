import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSupabaseBrowserClient } from '../../../src/lib/supabaseBrowser'

const PACKAGE_OPTIONS = ['10', '50', '100', '200', '300', '500']

export default function BookPlan() {
  const router = useRouter()
  const { id } = router.query
  const [book, setBook] = useState(null)
  const [plan, setPlan] = useState(null)
  const [status, setStatus] = useState('Loading plan...')
  const [pagePackage, setPagePackage] = useState('50')
  const [withImages, setWithImages] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  async function getToken() {
    const supabase = getSupabaseBrowserClient()
    const { data } = (await supabase?.auth.getSession()) || { data: {} }
    return data.session?.access_token || null
  }

  useEffect(() => {
    if (!id) return

    async function loadPlan() {
      const token = await getToken()

      if (!token) {
        window.location.href = `/login?next=/books/${id}/plan`
        return
      }

      const response = await fetch(`/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const payload = await response.json()

      if (!response.ok) {
        setStatus(payload.error || 'Could not load book plan.')
        return
      }

      setBook(payload.book)
      setPlan(payload.plan)
      setPagePackage(payload.plan?.recommended_page_package || '50')
      setStatus('')
    }

    loadPlan()
  }, [id])

  async function startCheckout() {
    setIsCheckingOut(true)
    setStatus('')

    try {
      const token = await getToken()

      if (!token) {
        window.location.href = `/login?next=/books/${id}/plan`
        return
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_id: id,
          page_package: pagePackage,
          with_images: withImages,
        }),
      })
      const payload = await response.json()

      if (!response.ok) {
        setStatus(payload.error || 'Could not start checkout.')
        return
      }

      window.location.href = payload.url
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (status && !plan) {
    return <main className="min-h-screen bg-[#fbf7ef] p-8 text-[#0d2a4a]">{status}</main>
  }

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#0d2a4a]">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-[#eadfcd] bg-[#fffaf0] p-6 shadow-sm shadow-[#d8c5a6]/20">
          <a className="text-sm font-black text-[#c98214]" href="/">BookForge</a>
          <h1 className="mt-3 text-4xl font-black">{book?.working_title || 'Book plan'}</h1>
          <p className="mt-2 text-sm font-bold text-[#31445c]">Review your free plan before choosing a book package.</p>
        </div>
        {status ? <p className="mt-4 rounded-lg bg-white p-4 text-sm font-bold">{status}</p> : null}

        <div className="mt-8 grid gap-6">
          <section className="rounded-xl border border-[#eadfcd] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Title options</h2>
            <ul className="mt-3 list-disc pl-5">
              {(plan?.title_options || []).map((title) => <li key={title}>{title}</li>)}
            </ul>
          </section>

          <section className="rounded-xl border border-[#eadfcd] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Book concept</h2>
            <p className="mt-3 whitespace-pre-wrap text-slate-700">{plan?.book_concept}</p>
          </section>

          <section className="rounded-xl border border-[#eadfcd] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Outline</h2>
            <ol className="mt-3 grid gap-2">
              {(plan?.outline || []).map((item, index) => (
                <li key={`${item.title}-${index}`}>
                  {item.chapter_number || index + 1}. {item.title}
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl border border-[#eadfcd] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Chapter summaries</h2>
            <div className="mt-3 grid gap-3">
              {(plan?.chapter_summaries || []).map((chapter, index) => (
                <article key={`${chapter.title}-${index}`}>
                  <h3 className="font-black">{chapter.chapter_number || index + 1}. {chapter.title}</h3>
                  <p className="text-slate-700">{chapter.summary}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#eadfcd] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Sample chapter</h2>
            <p className="mt-3 whitespace-pre-wrap text-slate-700">{plan?.sample_chapter}</p>
          </section>

          <section className="rounded-xl border border-[#eadfcd] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Continue to pricing</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-black">
                Page package
                <select
                  className="rounded-lg border border-[#d9c7aa] bg-[#fffdf8] p-3"
                  onChange={(event) => setPagePackage(event.target.value)}
                  value={pagePackage}
                >
                  {PACKAGE_OPTIONS.map((option) => <option key={option} value={option}>{option} pages</option>)}
                </select>
              </label>
              <label className="flex items-center gap-3 text-sm font-black">
                <input
                  checked={withImages}
                  onChange={(event) => setWithImages(event.target.checked)}
                  type="checkbox"
                />
                Include images
              </label>
            </div>
            <button
              className="mt-5 rounded-lg bg-[#c98214] px-5 py-3 text-sm font-black text-white shadow-lg shadow-amber-900/15 disabled:bg-[#d9c7aa]"
              disabled={isCheckingOut}
              onClick={startCheckout}
              type="button"
            >
              {isCheckingOut ? 'Opening checkout...' : 'Continue to pricing'}
            </button>
          </section>
        </div>
      </section>
    </main>
  )
}
