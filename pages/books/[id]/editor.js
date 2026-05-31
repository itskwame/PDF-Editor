import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSupabaseBrowserClient } from '../../../src/lib/supabaseBrowser'

export default function BookEditor() {
  const router = useRouter()
  const { id } = router.query
  const [book, setBook] = useState(null)
  const [plan, setPlan] = useState(null)
  const [chapters, setChapters] = useState([])
  const [status, setStatus] = useState('Loading editor...')
  const [isGenerating, setIsGenerating] = useState(false)

  async function getToken() {
    const supabase = getSupabaseBrowserClient()
    const { data } = (await supabase?.auth.getSession()) || { data: {} }
    return data.session?.access_token || null
  }

  async function loadBook() {
    const token = await getToken()

    if (!token) {
      window.location.href = `/login?next=/books/${id}/editor`
      return
    }

    const response = await fetch(`/api/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const payload = await response.json()

    if (!response.ok) {
      setStatus(payload.error || 'Could not load book.')
      return
    }

    setBook(payload.book)
    setPlan(payload.plan)
    setChapters(payload.chapters || [])
    setStatus('')
  }

  useEffect(() => {
    if (id) loadBook()
  }, [id])

  async function generateChapters() {
    setIsGenerating(true)
    setStatus('Generating chapters...')

    try {
      const token = await getToken()
      const response = await fetch(`/api/books/${id}/chapters/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const payload = await response.json()

      if (!response.ok) {
        setStatus(payload.error || 'Could not generate chapters.')
        return
      }

      setChapters(payload.chapters || [])
      setStatus('')
    } finally {
      setIsGenerating(false)
    }
  }

  function updateChapter(idToUpdate, field, value) {
    setChapters((items) =>
      items.map((chapter) => (chapter.id === idToUpdate ? { ...chapter, [field]: value } : chapter)),
    )
  }

  async function saveChapter(chapter) {
    setStatus('Saving chapter...')

    const token = await getToken()
    const response = await fetch(`/api/books/${id}/chapters/${chapter.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: chapter.title,
        content: chapter.content,
      }),
    })
    const payload = await response.json()

    if (!response.ok) {
      setStatus(payload.error || 'Could not save chapter.')
      return
    }

    updateChapter(chapter.id, 'updated_at', payload.chapter.updated_at)
    setStatus('Chapter saved.')
  }

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#0d2a4a]">
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#eadfcd] bg-[#fffaf0] p-6 shadow-sm shadow-[#d8c5a6]/20">
          <div>
            <a className="text-sm font-black text-[#c98214]" href="/">BookForge</a>
            <h1 className="text-4xl font-black">{book?.working_title || 'Book editor'}</h1>
            <p className="mt-2 text-sm font-bold text-[#31445c]">
              Status: {book?.status || 'loading'} {book?.paid ? 'Paid' : 'Not paid'}
            </p>
          </div>
          <button
            className="rounded-lg bg-[#c98214] px-5 py-3 text-sm font-black text-white shadow-lg shadow-amber-900/15 disabled:bg-[#d9c7aa]"
            disabled={isGenerating}
            onClick={generateChapters}
            type="button"
          >
            {isGenerating ? 'Generating...' : 'Generate chapters'}
          </button>
        </div>

        {status ? <p className="mt-5 rounded-lg bg-white p-4 text-sm font-bold">{status}</p> : null}

        {plan ? (
          <section className="mt-6 rounded-xl border border-[#eadfcd] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Plan</h2>
            <p className="mt-2 text-[#31445c]">{plan.book_concept}</p>
          </section>
        ) : null}

        <div className="mt-6 grid gap-5">
          {chapters.map((chapter) => (
            <article className="rounded-xl border border-[#eadfcd] bg-white p-5 shadow-sm" key={chapter.id}>
              <input
                className="w-full rounded-lg border border-[#d9c7aa] bg-[#fffdf8] p-3 text-lg font-black outline-none focus:border-[#c98214] focus:ring-2 focus:ring-[#f7d38b]"
                onChange={(event) => updateChapter(chapter.id, 'title', event.target.value)}
                value={chapter.title || ''}
              />
              <textarea
                className="mt-3 min-h-80 w-full rounded-lg border border-[#d9c7aa] bg-[#fffdf8] p-3 font-medium leading-7 outline-none focus:border-[#c98214] focus:ring-2 focus:ring-[#f7d38b]"
                onChange={(event) => updateChapter(chapter.id, 'content', event.target.value)}
                value={chapter.content || ''}
              />
              <button
                className="mt-3 rounded-lg border border-[#d9c7aa] bg-white px-4 py-2 text-sm font-black text-[#0d2a4a]"
                onClick={() => saveChapter(chapter)}
                type="button"
              >
                Save chapter
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
