export const PLAN_LIMITS = {
  free: {
    name: 'Free',
    monthlyExports: 3,
    monthlyAiActions: 0,
    price: '$0',
  },
  basic: {
    name: 'Basic',
    monthlyExports: 25,
    monthlyAiActions: 10,
    price: '$12',
  },
  pro: {
    name: 'Pro',
    monthlyExports: 100,
    monthlyAiActions: 100,
    price: '$19',
  },
}

export const ACTIVE_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing'])

export function normalizePlan(plan) {
  return PLAN_LIMITS[plan] ? plan : 'free'
}

export function getPlanLimits(plan) {
  return PLAN_LIMITS[normalizePlan(plan)]
}

export function getCurrentMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7)
}

export function getPlanFromSubscription(subscription) {
  if (!subscription || !ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status)) {
    return 'free'
  }

  return normalizePlan(subscription.plan)
}
