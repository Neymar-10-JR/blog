import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.resolve(currentDir, '../../posts')

export interface PostMeta {
  title: string
  date: string
  tags: string[]
  category?: string
  summary?: string
  sticky: boolean
  file: string
  link: string
}

type Frontmatter = Record<string, any>

/**
 * 极简 frontmatter 解析器，只处理本站用到的标量值与单行数组，
 * 避免在构建期引入额外的 yaml 依赖。
 */
function parseFrontmatter(raw: string): Frontmatter {
  const matched = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
  if (!matched) return {}

  const result: Frontmatter = {}
  for (const line of matched[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line.trim())
    if (!kv) continue

    const [, key, rawValue] = kv
    let value = rawValue.trim()
    if (!value) continue

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1)
      result[key] = value
        ? value
            .split(',')
            .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
            .filter(Boolean)
        : []
    } else {
      result[key] = value.replace(/^['"]|['"]$/g, '')
    }
  }
  return result
}

function normalizeDate(input: any): string {
  if (!input) return ''
  if (input instanceof Date) return input.toISOString().slice(0, 10)
  return String(input).slice(0, 10)
}

function normalizeTags(input: any): string[] {
  if (!input) return []
  return Array.isArray(input) ? input.map(String) : [String(input)]
}

/** 扫描 docs/posts 目录，返回按置顶与日期倒序排列的文章元信息 */
export function getPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md') && file !== 'index.md')
    .map((file) => {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
      const fm = parseFrontmatter(content)
      return {
        title: String(fm.title || file.replace(/\.md$/, '')),
        date: normalizeDate(fm.date),
        tags: normalizeTags(fm.tags),
        category: fm.category ? String(fm.category) : undefined,
        summary: fm.summary ? String(fm.summary) : undefined,
        sticky: fm.sticky === true || String(fm.sticky) === 'true',
        file,
        link: `/posts/${file.replace(/\.md$/, '')}`
      }
    })
    .sort((a, b) => {
      if (a.sticky !== b.sticky) return a.sticky ? -1 : 1
      return b.date.localeCompare(a.date)
    })
}

/** 生成 /posts/ 路径下的侧边栏：置顶一组 + 按年份分组 */
export function buildPostSidebar() {
  const posts = getPosts().filter((post) => post.date)
  if (!posts.length) return []

  const stickyItems = posts
    .filter((post) => post.sticky)
    .map((post) => ({ text: post.title, link: post.link }))

  const byYear = new Map<string, { text: string; link: string }[]>()
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year)!.push({ text: post.title, link: post.link })
  }

  const items: any[] = []
  if (stickyItems.length) {
    items.push({ text: '置顶', items: stickyItems, collapsed: false })
  }
  for (const [year, yearItems] of [...byYear.entries()].sort((a, b) => b[0].localeCompare(a[0]))) {
    items.push({ text: `${year} 年`, items: yearItems, collapsed: false })
  }

  return [
    { text: '全部文章', link: '/posts/' },
    { text: '按标签浏览', link: '/tags' },
    ...items
  ]
}
