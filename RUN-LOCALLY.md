# Run the site on your own computer

Follow these steps to preview the site locally before pushing it anywhere.

## 1. Install Node.js (one time)

You need Node.js version 18 or newer. Check if you already have it:

```bash
node --version
```

If you see something like `v18.x` or higher, you're set. If not, install it from
https://nodejs.org (download the "LTS" version) and run the command again.

## 2. Open a terminal in the project folder

Unzip the project, then in your terminal:

```bash
cd path/to/okaragoz-site
```

(Replace `path/to/` with wherever you unzipped it.)

## 3. Install the project's dependencies (one time)

```bash
npm install
```

This downloads VitePress and Vue into a local `node_modules` folder. It only needs
to be done once (or again after you pull updates).

## 4. Start the live preview

```bash
npm run dev
```

You'll see a message like:

```
  vitepress v1.6.4
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173/** in your browser. The site is now running locally.
Any change you make to a markdown file or the theme reloads instantly in the browser.

Press `Ctrl + C` in the terminal to stop the server when you're done.

## 5. (Optional) Build the final static site

When you want to produce the deployable files (what gets published):

```bash
npm run build      # outputs to docs/.vitepress/dist
npm run preview    # serve that built version at http://localhost:4173
```

---

## Common tasks while editing

**After adding or editing a post** (so the homepage/index cards update), regenerate
the listing data:

```bash
node scripts/build-posts.mjs
```

This reads every post's frontmatter (title, date, excerpt, image) and rewrites
`docs/.vitepress/data/posts.json`. The dev server picks it up automatically.

**Adding images:** drop files into `docs/public/images/...` and reference them in
markdown as `/images/your-file.png`.

**The custom font** (TWK Lausanne) lives in `docs/public/fonts/` and is loaded
automatically — nothing to configure.

---

## Troubleshooting

- **`command not found: npm`** → Node.js isn't installed; see step 1.
- **Port already in use** → another dev server is running; stop it, or run
  `npm run dev -- --port 5174`.
- **Images show as gray placeholders** → those are the stand-in images; replace the
  files in `docs/public/images/` with your real ones (see README §4).
