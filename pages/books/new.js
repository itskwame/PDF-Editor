import Link from 'next/link'
import { useState } from 'react'
import { getSupabaseBrowserClient } from '../../src/lib/supabaseBrowser'

const BOOK_TYPES = [
  {
    title: 'Nonfiction Book',
    value: 'nonfiction',
    description: 'Teach, explain, persuade, or build authority around your expertise.',
    icon: 'book',
  },
  {
    title: 'Fiction Book',
    value: 'fiction',
    description: 'Shape a story world, plot, characters, and polished chapters.',
    icon: 'feather',
  },
  {
    title: 'Memoir or Life Story',
    value: 'memoir',
    description: 'Turn lived experience into a clear, moving, readable story.',
    icon: 'heart',
  },
  {
    title: "Children's Book",
    value: 'childrens',
    description: 'Create a simple, imaginative book for young readers.',
    icon: 'star',
  },
]

const SELECT_OPTIONS = {
  category: [
    'Business',
    'Self-help',
    'Parenting',
    'Romance',
    'Adventure',
    'Sci-Fi',
    'Fantasy',
    'Memoir',
    "Children's",
    'Other',
  ],
  tone: ['Professional', 'Conversational', 'Inspirational', 'Emotional', 'Cinematic', 'Warm', 'Direct'],
  writing_style: ['Clear and practical', 'Story-driven', 'Elegant', 'Simple', 'Persuasive', 'Literary'],
  reading_level: ['General adult', 'Beginner-friendly', 'Young adult', 'Children', 'Advanced'],
  image_preference: ['No images', 'Maybe later', 'Image-supported book'],
}

const INITIAL_FORM = {
  book_type: 'nonfiction',
  category: 'Business',
  working_title: '',
  book_about: '',
  target_reader: '',
  reader_outcome: '',
  tone: 'Professional',
  writing_style: 'Clear and practical',
  reading_level: 'General adult',
  image_preference: 'No images',
}

function Icon({ name, className = '' }) {
  const paths = {
    quill: ['M19 3C12 4 7 9 5 18', 'M17 5c-5 1-8 4-10 9', 'M4 21l4-7'],
    book: ['M4 5c3-2 6-2 8 0v15c-2-2-5-2-8 0z', 'M12 5c2-2 5-2 8 0v15c-3-2-6-2-8 0z'],
    feather: ['M20 4C12 4 7 9 5 18', 'M18 6c-5 1-8 5-10 10', 'M4 20l5-5'],
    heart: ['M20 8c0 6-8 11-8 11S4 14 4 8a4 4 0 0 1 8-2 4 4 0 0 1 8 2z'],
    star: ['M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z'],
    check: ['M20 6L9 17l-5-5'],
    compass: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M15 9l-2 5-5 2 2-5z'],
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {paths[name].map((path) => <path d={path} key={path} />)}
    </svg>
  )
}

function Logo() {
  return (
    <Link className="flex items-center gap-2 text-2xl font-black text-[#0d2a4a]" href="/">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8ead2] text-[#c98214]">
        <Icon className="h-5 w-5" name="quill" />
      </span>
      BookForge
    </Link>
  )
}

function FieldLabel({ children, help }) {
  return (
    <div>
      <span className="text-sm font-black text-[#0d2a4a]">{children}</span>
      {help ? <p className="mt-1 text-xs font-semibold leading-5 text-[#6b5d4a]">{help}</p> : null}
    </div>
  )
}

function TextInput({ field, label, help, form, updateField, required = false, rows = 4 }) {
  return (
    <label className="grid gap-2">
      <FieldLabel help={help}>{label}</FieldLabel>
      <textarea
        className="min-h-24 rounded-xl border border-[#d9c7aa] bg-[#fffdf8] p-4 text-sm font-semibold leading-6 text-[#102b49] shadow-inner shadow-[#eadfcd]/30 outline-none transition placeholder:text-[#9b8c77] focus:border-[#c98214] focus:ring-4 focus:ring-[#f7d38b]/40"
        onChange={(event) => updateField(field, event.target.value)}
        placeholder="Write a few clear sentences."
        required={required}
        rows={rows}
        value={form[field]}
      />
    </label>
  )
}

function SelectInput({ field, label, form, updateField, options }) {
  return (
    <label className="grid gap-2">
      <FieldLabel>{label}</FieldLabel>
      <select
        className="h-12 rounded-xl border border-[#d9c7aa] bg-[#fffdf8] px-4 text-sm font-black text-[#102b49] shadow-sm outline-none transition focus:border-[#c98214] focus:ring-4 focus:ring-[#f7d38b]/40"
        onChange={(event) => updateField(field, event.target.value)}
        value={form[field]}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default function NewBook() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submitBook(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus('Creating book...')

    try {
      const supabase = getSupabaseBrowserClient()
      const { data } = (await supabase?.auth.getSession()) || { data: {} }
      const token = data.session?.access_token

      if (!token) {
        window.location.href = '/login?next=/books/new'
        return
      }

      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })
      const payload = await response.json()

      if (!response.ok) {
        setStatus(payload.error || 'Could not create book.')
        return
      }

      setStatus('Generating free book plan...')
      const planResponse = await fetch(`/api/books/${payload.book_id}/plan`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const planPayload = await planResponse.json()

      if (!planResponse.ok) {
        setStatus(planPayload.error || 'Book created, but plan generation failed.')
        return
      }

      window.location.href = `/books/${payload.book_id}/plan`
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#0d2a4a]">
      <header className="sticky top-0 z-40 border-b border-[#eadfcd] bg-[#fffaf0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-black text-[#102b49] md:flex">
            <Link className="transition hover:text-[#c98214]" href="/#how-it-works">How It Works</Link>
            <Link className="transition hover:text-[#c98214]" href="/#examples">Examples</Link>
            <Link className="transition hover:text-[#c98214]" href="/#pricing">Pricing</Link>
            <Link className="transition hover:text-[#c98214]" href="/#faq">FAQ</Link>
          </nav>
          <Link className="text-sm font-black text-[#102b49] transition hover:text-[#c98214]" href="/login">
            Log In
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-[#eadfcd] bg-[#fffaf0] shadow-xl shadow-[#d8c5a6]/25">
            <div className="border-b border-[#eadfcd] bg-gradient-to-br from-[#fffaf0] to-[#f7ead8] p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfcd] bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-[#c98214]">
                <Icon className="h-4 w-4" name="compass" />
                Free book preview
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-[#0d2a4a] md:text-5xl">
                Start with your idea. Leave with a real book plan.
              </h1>
              <p className="mt-4 text-base font-semibold leading-7 text-[#31445c]">
                Answer a few guided questions and BookForge will create your book concept, title ideas, outline, sample chapter, and recommended book size.
              </p>
            </div>
            <div className="grid gap-4 p-6">
              {[
                'No blank-page guessing',
                'No confusing prompt writing',
                'No credit card required',
              ].map((item) => (
                <div className="flex items-center gap-3 text-sm font-black text-[#31445c]" key={item}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8ead2] text-[#c98214]">
                    <Icon className="h-4 w-4" name="check" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <form
          className="rounded-3xl border border-[#eadfcd] bg-white p-5 shadow-xl shadow-[#d8c5a6]/20 md:p-7"
          onSubmit={submitBook}
        >
          <div className="border-b border-[#eadfcd] pb-5">
            <h2 className="text-2xl font-black text-[#0d2a4a]">Book intake</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#6b5d4a]">
              Keep it simple. Short, clear answers work best.
            </p>
          </div>

          <section className="mt-6">
            <FieldLabel help="Choose the format that best matches the book you want to create.">
              Book type
            </FieldLabel>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {BOOK_TYPES.map((type) => {
                const selected = form.book_type === type.value

                return (
                  <button
                    className={`rounded-2xl border p-4 text-left shadow-sm transition ${
                      selected
                        ? 'border-[#c98214] bg-[#fff8ea] ring-4 ring-[#f7d38b]/35'
                        : 'border-[#eadfcd] bg-white hover:border-[#c98214]'
                    }`}
                    key={type.value}
                    onClick={() => updateField('book_type', type.value)}
                    type="button"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8ead2] text-[#c98214]">
                        <Icon className="h-6 w-6" name={type.icon} />
                      </span>
                      <div>
                        <h3 className="font-black text-[#0d2a4a]">{type.title}</h3>
                        <p className="mt-1 text-sm font-semibold leading-6 text-[#6b5d4a]">{type.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="mt-7 grid gap-5 md:grid-cols-2">
            <SelectInput
              field="category"
              form={form}
              label="Category"
              options={SELECT_OPTIONS.category}
              updateField={updateField}
            />
            <SelectInput
              field="tone"
              form={form}
              label="Tone"
              options={SELECT_OPTIONS.tone}
              updateField={updateField}
            />
            <SelectInput
              field="writing_style"
              form={form}
              label="Writing style"
              options={SELECT_OPTIONS.writing_style}
              updateField={updateField}
            />
            <SelectInput
              field="reading_level"
              form={form}
              label="Reading level"
              options={SELECT_OPTIONS.reading_level}
              updateField={updateField}
            />
          </section>

          <section className="mt-7 grid gap-5">
            <TextInput
              field="working_title"
              form={form}
              help="A working title is enough. You will get more title ideas in the preview."
              label="Working title"
              required
              rows={2}
              updateField={updateField}
            />
            <TextInput
              field="book_about"
              form={form}
              help="Describe the core idea, story, lesson, or transformation."
              label="What is the book about?"
              required
              rows={5}
              updateField={updateField}
            />
            <TextInput
              field="target_reader"
              form={form}
              help="Who should this book help, entertain, teach, or inspire?"
              label="Target reader"
              rows={3}
              updateField={updateField}
            />
            <TextInput
              field="reader_outcome"
              form={form}
              help="What should the reader understand, feel, or be able to do after reading?"
              label="Reader outcome"
              rows={3}
              updateField={updateField}
            />
            <SelectInput
              field="image_preference"
              form={form}
              label="Image preference"
              options={SELECT_OPTIONS.image_preference}
              updateField={updateField}
            />
          </section>

          {status ? (
            <p className="mt-6 rounded-xl border border-[#eadfcd] bg-[#fff8ea] p-4 text-sm font-black text-[#31445c]">
              {status}
            </p>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 border-t border-[#eadfcd] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold leading-6 text-[#6b5d4a]">
              Your free preview includes a book concept, title options, outline, chapter summaries, and a sample chapter.
            </p>
            <button
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#c98214] px-6 py-4 text-sm font-black text-white shadow-lg shadow-amber-900/15 transition hover:bg-[#a9670e] disabled:bg-[#d9c7aa]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Working...' : 'Generate Free Book Plan'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
