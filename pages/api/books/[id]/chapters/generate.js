import { getUserFromRequest, isSupabaseAuthConfigured } from '../../../../../src/lib/auth'
import {
  BOOK_FIELDS,
  CHAPTER_FIELDS,
  PLAN_FIELDS,
  normalizeGeneratedChapters,
} from '../../../../../src/lib/bookforge'
import { requestDeepSeekJson } from '../../../../../src/lib/deepseek'

function buildChapterPrompt(book, plan) {
  return [
    'Generate the full draft chapters for this BookForge book as JSON only.',
    'Use this exact JSON shape:',
    '{"chapters":[{"chapter_number":1,"title":"...","content":"..."}]}',
    `Book title: ${book.working_title}`,
    `Book concept: ${plan.book_concept}`,
    `Tone: ${book.tone}`,
    `Writing style: ${book.writing_style}`,
    `Reading level: ${book.reading_level}`,
    `Outline: ${JSON.stringify(plan.outline || [])}`,
    `Chapter summaries: ${JSON.stringify(plan.chapter_summaries || [])}`,
  ].join('\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isSupabaseAuthConfigured()) {
    return res.status(500).json({ error: 'Supabase is not configured.' })
  }

  const { id } = req.query
  const { user, error, supabase } = await getUserFromRequest(req)

  if (error) {
    return res.status(401).json({ error })
  }

  const { data: book, error: bookError } = await supabase
    .from('books')
    .select(BOOK_FIELDS)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (bookError || !book) {
    return res.status(404).json({ error: 'Book not found.' })
  }

  if (!book.paid) {
    return res.status(402).json({ error: 'Book package payment is required before chapter generation.' })
  }

  const { data: plan, error: planError } = await supabase
    .from('book_plans')
    .select(PLAN_FIELDS)
    .eq('book_id', id)
    .single()

  if (planError || !plan) {
    return res.status(404).json({ error: 'Book plan not found.' })
  }

  try {
    const payload = await requestDeepSeekJson([
      { role: 'system', content: 'You are a precise long-form book drafting assistant. Return valid JSON only.' },
      { role: 'user', content: buildChapterPrompt(book, plan) },
    ])
    const chapters = normalizeGeneratedChapters(payload, plan.chapter_summaries)
    const now = new Date().toISOString()

    const rows = chapters.map((chapter) => ({
      ...chapter,
      book_id: id,
      user_id: user.id,
      updated_at: now,
    }))

    const { data: savedChapters, error: chaptersError } = await supabase
      .from('chapters')
      .upsert(rows, { onConflict: 'book_id,chapter_number' })
      .select(CHAPTER_FIELDS)
      .order('chapter_number', { ascending: true })

    if (chaptersError) {
      return res.status(500).json({ error: chaptersError.message })
    }

    const { error: updateError } = await supabase
      .from('books')
      .update({ status: 'chapters_generated', updated_at: now })
      .eq('id', id)
      .eq('user_id', user.id)

    if (updateError) {
      return res.status(500).json({ error: updateError.message })
    }

    return res.status(200).json({ chapters: savedChapters || [] })
  } catch (generationError) {
    return res.status(500).json({ error: generationError.message })
  }
}
