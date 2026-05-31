import { getUserFromRequest, isSupabaseAuthConfigured } from '../../../src/lib/auth'
import { BOOK_FIELDS, pickBookInput } from '../../../src/lib/bookforge'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isSupabaseAuthConfigured()) {
    return res.status(500).json({ error: 'Supabase is not configured.' })
  }

  const { user, error, supabase } = await getUserFromRequest(req)

  if (error) {
    return res.status(401).json({ error })
  }

  const bookInput = pickBookInput(req.body || {})
  const { data, error: insertError } = await supabase
    .from('books')
    .insert({
      ...bookInput,
      user_id: user.id,
      paid: false,
      status: req.body?.status || 'draft',
    })
    .select(BOOK_FIELDS)
    .single()

  if (insertError) {
    return res.status(500).json({ error: insertError.message })
  }

  return res.status(201).json({ book_id: data.id, book: data })
}
