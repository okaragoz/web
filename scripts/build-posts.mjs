// Regenerate docs/.vitepress/data/posts.json from post frontmatter + content.
// Computes a dynamic reading time (200 words/min) and a clean excerpt.
// Run with: node scripts/build-posts.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const WORDS_PER_MIN = 200

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const fm = {}
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i === -1) continue
    let key = line.slice(0, i).trim()
    let val = line.slice(i + 1).trim()
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    if (val.startsWith('[')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(Boolean)
    }
    fm[key] = val
  }
  return fm
}

// Strip frontmatter, code blocks, details containers, images and math for analysis.
function stripBody(md) {
  return md
    .replace(/^---\n[\s\S]*?\n---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/::: details[\s\S]*?:::/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]*\$/g, ' ')
}

function wordCount(md) {
  return stripBody(md).replace(/[#>*_`~\-]/g, ' ').split(/\s+/).filter(Boolean).length
}

function readingTime(md) {
  return Math.max(1, Math.round(wordCount(md) / WORDS_PER_MIN))
}

// First substantial prose paragraph -> trimmed excerpt.
function excerptFrom(md, fallback = '') {
  for (const raw of stripBody(md).split('\n')) {
    let s = raw.trim()
    if (!s) continue
    if (s.startsWith('#') || s.startsWith('<') || s.startsWith('* * *') || s.startsWith('---') || s.startsWith('|')) continue
    s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim()
    if (s.length < 60) continue // skip stray short lines (titles, audio markers, etc.)
    const max = 300
    if (s.length <= max) return s
    let cut = s.slice(0, max)
    cut = cut.slice(0, cut.lastIndexOf(' '))
    return cut.replace(/[.,;:]+$/, '') + '…'
  }
  return fallback
}

function collect(folder, base) {
  const dir = join(root, 'docs', folder)
  const out = []
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md') || f === 'index.md') continue
    const md = readFileSync(join(dir, f), 'utf8')
    const fm = parseFrontmatter(md)
    if (!fm.date) continue // listing pages (e.g. articles.md) aren't posts
    const slug = f.replace(/\.md$/, '')
    out.push({
      slug,
      title: fm.title || slug,
      date: fm.date || '',
      image: fm.image || '',
      excerpt: excerptFrom(md, fm.excerpt || ''),
      url: `/${base}/${slug}`,
      readingTime: readingTime(md),
    })
  }
  out.sort((a, b) => (a.date < b.date ? 1 : -1))
  return out
}

const data = { blog: collect('blog', 'blog'), research: collect('research', 'research') }
writeFileSync(join(root, 'docs/.vitepress/data/posts.json'), JSON.stringify(data, null, 2))
console.log(`posts.json rebuilt: ${data.blog.length} blog, ${data.research.length} research`)
