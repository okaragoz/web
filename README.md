# Oguzcan Karagoz — Personal Academic Website

A fast, static, **markdown-based** site built with [VitePress](https://vitepress.dev),
with a custom design and a built-in **content manager** (Sveltia CMS) for editing
posts, pages, menus, and images through a login — **without any server to maintain or hack.**

Publishing works by committing markdown to your Git repository, so there is no live
database or admin backend exposed to the internet. This is the most secure setup for
a personal academic site.

---

## 1. What's inside

```
docs/
├── index.md                     # Home page (hero + recent cards)
├── about.md                     # About me
├── publications.md              # Publications
├── research/
│   ├── index.md                 # Research overview + card grid
│   └── *.md                     # Research posts
├── blog/
│   ├── index.md                 # Blog index + card grid
│   └── *.md                     # Blog posts
├── public/
│   ├── images/                  # All images live here (see §4)
│   └── admin/                   # Content manager (login UI)
│       ├── index.html
│       └── config.yml
└── .vitepress/
    ├── config.mjs               # Site config (title, nav source, etc.)
    ├── data/
    │   ├── menu.json            # Navigation menu (editable in CMS)
    │   └── posts.json           # Auto-built listing for card grids
    └── theme/                   # Custom theme (CSS + Vue components)
```

## 2. Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to docs/.vitepress/dist
npm run preview    # preview the production build
```

## 3. Writing / editing content

**Option A — edit markdown files directly.** Each post is a `.md` file with a small
frontmatter block at the top:

```markdown
---
title: "My new finding about Venus"
date: 2026-06-10
excerpt: "A short summary shown on cards."
image: /images/2026/06/my-figure.png
category: research        # or: blog
tags: ["research"]
---

# My new finding about Venus

Body text in markdown...
```

Put research posts in `docs/research/`, blog posts in `docs/blog/`. The card grids on
the Home, Research, and Blog pages are generated from `docs/.vitepress/data/posts.json`.
After adding a post, regenerate that file (a helper script is included — see below) or
add an entry manually.

**Option B — use the Content Manager (recommended).** Go to `/admin` on your live site,
log in with GitHub, and edit through a visual UI: create/edit posts, upload images
in-post, and reorder the navigation menu. Saving commits to your repo and the site
rebuilds automatically.

## 4. Migrating your images (important)

Your old Ghost images could not be downloaded (the old site returns 403), so every
referenced image is currently a **labeled placeholder** under `docs/public/images/`.
To restore the real images:

1. On your VPS, find the Ghost content images folder, usually:
   `/var/www/ghost/content/images/` (or inside your Ghost install's `content/images`).
2. Copy its contents into `docs/public/images/` **keeping the same subfolders**, e.g.
   `content/images/2025/12/MarsDichotomyFigure1.png` → `docs/public/images/2025/12/MarsDichotomyFigure1.png`.
3. Rebuild. The placeholders will be overwritten by your real files.

The 3 images that were embedded directly in your Research page were recovered and are in
`docs/public/images/embedded/`.

## 5. Configure the Content Manager

Edit `docs/public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: OWNER/REPO     # <-- set to your GitHub repo, e.g. okaragoz/website
  branch: main
```

Then enable GitHub login (one-time). The simplest path is Sveltia CMS's GitHub auth:
create a GitHub OAuth app (Settings → Developer settings → OAuth Apps) and follow
the Sveltia CMS docs at https://github.com/sveltia/sveltia-cms#readme.
Until this is set up, `/admin` will load but login won't complete — editing files
directly (Option A) works regardless.

## 6. Deploy (free, static, nothing to hack)

You do **not** need your VPS for this site.

**GitHub Pages (included workflow):**
1. Create a GitHub repo and push this project.
2. In the repo: Settings → Pages → Build and deployment → Source = **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
4. Point your domain (okaragoz.com) at GitHub Pages, or use the provided `*.github.io` URL.

**Cloudflare Pages (alternative):**
1. Connect your repo in the Cloudflare dashboard.
2. Build command: `npm run build` — Output directory: `docs/.vitepress/dist`.
3. Add your custom domain in the Pages project settings.

## 7. Customizing the design

- Colors, fonts, spacing: `docs/.vitepress/theme/custom.css` (CSS variables at the top).
- Hero text and stats: `docs/.vitepress/theme/Home.vue`.
- Navigation: `docs/.vitepress/data/menu.json` (or via the CMS).
- Social links / site title: `docs/.vitepress/config.mjs`.

### Fonts

The site uses **TWK Lausanne** (`docs/public/fonts/TWKLausanne-300.woff2`) for large
display headings and body text, with **Schibsted Grotesk** (loaded from Google Fonts)
as the bold fallback for smaller UI like card titles and navigation.

TWK Lausanne 300 is a single *light* weight. If you have additional weights (e.g.
`TWKLausanne-500.woff2`, `TWKLausanne-700.woff2`), drop them into
`docs/public/fonts/` and add matching `@font-face` blocks at the top of
`custom.css` with the right `font-weight` values — then the headings can use
TWK Lausanne at bold weights too.

### Running locally

See **RUN-LOCALLY.md** for step-by-step instructions to preview the site on your
own machine before deploying.

---

Built as a migration from a Ghost export. 11 posts + About / Publications / Research
pages were converted to markdown.
