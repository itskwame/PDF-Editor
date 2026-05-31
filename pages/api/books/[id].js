import { getUserFromRequest, isSupabaseAuthConfigured } from '../../../src/lib/auth'
import { BOOK_FIELDS, CHAPTER_FIELDS, PLAN_FIELDS } from '../../../src/lib/bookforge'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
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

  const [{ data: plan }, { data: chapters }] = await Promise.all([
    supabase
      .from('book_plans')
      .select(PLAN_FIELDS)
      .eq('book_id', id)
      .maybeSingle(),
    supabase
      .from('chapters')
      .select(CHAPTER_FIELDS)
      .eq('book_id', id)
      .eq('user_id', user.id)
      .order('chapter_number', { ascending: true }),
  ])

  return res.status(200).json({
    book,
    plan: plan || null,
    chapters: chapters || [],
  })
}
