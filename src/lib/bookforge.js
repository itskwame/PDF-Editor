export const ALLOWED_BOOK_FIELDS = [
  'book_type',
  'category',
  'working_title',
  'book_about',
  'target_reader',
  'reader_outcome',
  'tone',
  'writing_style',
  'reading_level',
  'image_preference',
]

export const PLAN_FIELDS = `
  id,
  book_id,
  title_options,
  book_concept,
  outline,
  chapter_summaries,
  sample_chapter,
  recommended_page_package,
  created_at,
  updated_at
`

export const BOOK_FIELDS = `
  id,
  user_id,
  book_type,
  category,
  working_title,
  book_about,
  target_reader,
  reader_outcome,
  tone,
  writing_style,
  reading_level,
  image_preference,
  status,
  paid,
  selected_page_package,
  with_images,
  created_at,
  updated_at
`

export const CHAPTER_FIELDS = `
  id,
  book_id,
  user_id,
  chapter_number,
  title,
  content,
  status,
  created_at,
  updated_at
`

export function pickBookInput(body) {
  return ALLOWED_BOOK_FIELDS.reduce((result, field) => {
    result[field] = typeof body?.[field] === 'string' ? body[field].trim() : body?.[field] || ''
    return result
  }, {})
}

export function normalizePlan(plan) {
  return {
    title_options: Array.isArray(plan.title_options) ? plan.title_options : [],
    book_concept: plan.book_concept || '',
    outline: Array.isArray(plan.outline) ? plan.outline : [],
    chapter_summaries: Array.isArray(plan.chapter_summaries) ? plan.chapter_summaries : [],
    sample_chapter: plan.sample_chapter || '',
    recommended_page_package: String(plan.recommended_page_package || '50'),
  }
}

export function normalizeGeneratedChapters(payload, chapterSummaries = []) {
  const chapters = Array.isArray(payload.chapters) ? payload.chapters : []

  return chapters.map((chapter, index) => {
    const summary = chapterSummaries[index] || {}

    return {
      chapter_number: Number(chapter.chapter_number || summary.chapter_number || index + 1),
      title: chapter.title || summary.title || `Chapter ${index + 1}`,
      content: chapter.content || '',
      status: 'draft',
    }
  })
}
