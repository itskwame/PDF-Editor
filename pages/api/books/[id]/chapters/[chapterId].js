import { getUserFromRequest, isSupabaseAuthConfigured } from '../../../../../src/lib/auth'
import { CHAPTER_FIELDS } from '../../../../../src/lib/bookforge'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isSupabaseAuthConfigured()) {
    return res.status(500).json({ error: 'Supabase is not configured.' })
  }

  const { id, chapterId } = req.query
  const { user, error, supabase } = await getUserFromRequest(req)

  if (error) {
    return res.status(401).json({ error })
  }

  const updates = {
    updated_at: new Date().toISOString(),
  }

  if (typeof req.body?.title === 'string') {
    updates.title = req.body.title
  }

  if (typeof req.body?.content === 'string') {
    updates.content = req.body.content
  }

  const { data, error: updateError } = await supabase
    .from('chapters')
    .update(updates)
    .eq('id', chapterId)
    .eq('book_id', id)
    .eq('user_id', user.id)
    .select(CHAPTER_FIELDS)
    .single()

  if (updateError) {
    return res.status(500).json({ error: updateError.message })
  }

  return res.status(200).json({ chapter: data })
}
