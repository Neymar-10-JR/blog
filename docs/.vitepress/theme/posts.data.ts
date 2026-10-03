import { createContentLoader } from 'vitepress'

export interface Post {
  url: string
  title: string
  date: string
  tags: string[]
  category?: string
  summary?: string
  sticky: boolean
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function normalizeDate(input: unknown): string {
  if (!input) return ''
  if (input instanceof Date) return input.toISOString().slice(0, 10)
  return String(input).slice(0, 10)
}

function normalizeTags(input: unknown): string[] {
  if (!input) return []
  return Array.isArray(input) ? input.map(String) : [String(input)]
}

/**
 * 自动收集 docs/posts 下的所有文章。
 * createContentLoader 会在构建期把结果内联到产物中，运行时零请求。
 */
export default createContentLoader('posts/**/*.md', {
  excerpt: true,
  transform(raw): Post[] {
    return raw
      .filter(({ frontmatter }) => frontmatter.date && frontmatter.title)
      .map(({ url, frontmatter, excerpt }) => {
        const summary = frontmatter.summary
          ? String(frontmatter.summary)
          : stripHtml(String(excerpt || '')).slice(0, 120)

        return {
          url,
          title: String(frontmatter.title),
          date: normalizeDate(frontmatter.date),
          tags: normalizeTags(frontmatter.tags),
          category: frontmatter.category ? String(frontmatter.category) : undefined,
          summary,
          sticky: frontmatter.sticky === true || String(frontmatter.sticky) === 'true'
        }
      })
      .sort((a, b) => {
        if (a.sticky !== b.sticky) return a.sticky ? -1 : 1
        return b.date.localeCompare(a.date)
      })
  }
})
