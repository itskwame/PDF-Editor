import { getCurrentMonthKey } from '../../../src/lib/plans'
import { getUserFromRequest, isSupabaseAdminConfigured } from '../../../src/lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isSupabaseAdminConfigured()) {
    return res.status(500).json({ error: 'Supabase is not configured.' })
  }

  const { user, error, supabase } = await getUserFromRequest(req)

  if (error) {
    return res.status(401).json({ error })
  }

  const { data, error: rpcError } = await supabase.rpc('authorize_pdf_export', {
    target_user_id: user.id,
    target_month: getCurrentMonthKey(),
  })

  if (rpcError) {
    return res.status(500).json({ error: rpcError.message })
  }

  const result = Array.isArray(data) ? data[0] : data

  if (!result?.allowed) {
    return res.status(402).json({
      allowed: false,
      error: 'Monthly export limit reached.',
      plan: result?.plan || 'free',
      used: result?.used || 0,
      limit: result?.limit || 3,
      remaining: 0,
    })
  }

  return res.status(200).json({
    allowed: true,
    plan: result.plan,
    used: result.used,
    limit: result.limit,
    remaining: result.remaining,
  })
}
