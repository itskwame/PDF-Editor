import { getCurrentMonthKey, getPlanFromSubscription, getPlanLimits } from '../../../src/lib/plans'
import { getUserFromRequest, isSupabaseAuthConfigured } from '../../../src/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isSupabaseAuthConfigured()) {
    return res.status(500).json({ error: 'Supabase is not configured.' })
  }

  const { user, error, supabase } = await getUserFromRequest(req)

  if (error) {
    return res.status(401).json({ error })
  }

  const month = getCurrentMonthKey()

  const [{ data: subscription }, { data: exportUsage }, { data: aiUsage }] =
    await Promise.all([
      supabase
        .from('subscriptions')
        .select('plan,status,current_period_end,stripe_customer_id')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('export_usage')
        .select('count')
        .eq('user_id', user.id)
        .eq('period_month', month)
        .maybeSingle(),
      supabase
        .from('ai_usage')
        .select('count')
        .eq('user_id', user.id)
        .eq('period_month', month)
        .maybeSingle(),
    ])

  const plan = getPlanFromSubscription(subscription)
  const limits = getPlanLimits(plan)

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
    },
    plan,
    planName: limits.name,
    subscriptionStatus: subscription?.status || 'free',
    periodMonth: month,
    exports: {
      used: exportUsage?.count || 0,
      limit: limits.monthlyExports,
      remaining: Math.max(limits.monthlyExports - (exportUsage?.count || 0), 0),
    },
    ai: {
      used: aiUsage?.count || 0,
      limit: limits.monthlyAiActions,
      remaining: Math.max(limits.monthlyAiActions - (aiUsage?.count || 0), 0),
      availableInMvp: false,
    },
  })
}
