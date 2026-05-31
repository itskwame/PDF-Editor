import { createClient } from '@supabase/supabase-js'

export function isSupabaseAuthConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}

export function getBearerTokenFromRequest(req) {
  const authHeader = req.headers.authorization || ''
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
}

export function getSupabaseUserClient(accessToken) {
  if (!isSupabaseAuthConfigured()) {
    throw new Error('Supabase auth environment variables are not configured.')
  }

  if (!accessToken) {
    throw new Error('Missing bearer token.')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    },
  )
}

export async function getUserFromRequest(req) {
  const token = getBearerTokenFromRequest(req)

  if (!token) {
    return { user: null, error: 'Missing bearer token.', supabase: null }
  }

  const supabase = getSupabaseUserClient(token)
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data?.user) {
    return { user: null, error: 'Invalid or expired session.', supabase: null }
  }

  return { user: data.user, error: null, supabase }
}
