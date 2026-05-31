const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

function stripCodeFence(value) {
  return String(value || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
}

export function extractJson(value) {
  const text = stripCodeFence(value)

  try {
    return JSON.parse(text)
  } catch {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')

    if (start >= 0 && end > start) {
      return JSON.parse(text.slice(start, end + 1))
    }

    throw new Error('DeepSeek returned invalid JSON.')
  }
}

export async function requestDeepSeekJson(messages) {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not configured.')
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`DeepSeek request failed: ${body || response.statusText}`)
  }

  const payload = await response.json()
  return extractJson(payload.choices?.[0]?.message?.content)
}
