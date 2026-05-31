import { getUserFromRequest, isSupabaseAuthConfigured } from '../../../../src/lib/auth'
import { BOOK_FIELDS, PLAN_FIELDS, normalizePlan } from '../../../../src/lib/bookforge'
import { requestDeepSeekJson } from '../../../../src/lib/deepseek'

function buildPlanPrompt(book) {
  return [
    'Generate a free BookForge book plan as JSON only.',
    'Use this exact JSON shape:',
    '{"title_options":["..."],"book_concept":"...","outline":[{"chapter_number":1,"title":"..."}],"chapter_summaries":[{"chapter_number":1,"title":"...","summary":"..."}],"sample_chapter":"...","recommended_page_package":"10|50|100|200|300|500"}',
    `Book type: ${book.book_type}`,
    `Category: ${book.category}`,
    `Working title: ${book.working_title}`,
    `About: ${book.book_about}`,
    `Target reader: ${book.target_reader}`,
    `Reader outcome: ${book.reader_outcome}`,
    `Tone: ${book.tone}`,
    `Writing style: ${book.writing_style}`,
    `Reading level: ${book.reading_level}`,
    `Image preference: ${book.image_preference}`,
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

  try {
    const generatedPlan = normalizePlan(await requestDeepSeekJson([
      { role: 'system', content: 'You are a precise book planning assistant. Return valid JSON only.' },
      { role: 'user', content: buildPlanPrompt(book) },
    ]))

    const now = new Date().toISOString()
    const { data: savedPlan, error: planError } = await supabase
      .from('book_plans')
      .upsert(
        {
          book_id: id,
          user_id: user.id,
          ...generatedPlan,
          updated_at: now,
        },
        { onConflict: 'book_id' },
      )
      .select(PLAN_FIELDS)
      .single()

    if (planError) {
      return res.status(500).json({ error: planError.message })
    }

    const { error: updateError } = await supabase
      .from('books')
      .update({ status: 'plan_generated', updated_at: now })
      .eq('id', id)
      .eq('user_id', user.id)

    if (updateError) {
      return res.status(500).json({ error: updateError.message })
    }

    return res.status(200).json({ plan: savedPlan })
  } catch (planError) {
    return res.status(500).json({ error: planError.message })
  }
}
