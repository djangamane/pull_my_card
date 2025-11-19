# Pull My Card — Project

This workspace contains two main pages for the Pull My Card project:

- `index.html` — main React-based homepage (in-browser Babel UMD build). Use for quick local edits.
- `index.static.html` — static, dependency-free preview of the homepage for quick previews and pitching.
- `kid_reporter_page.html` — The Kid Reporter landing page (original in-browser JSX version).

Quick preview locally

1. Using Python's simple server (recommended):

```bash
cd /home/dorisb/FJprojects/pull_my_card
python3 -m http.server 8000
# Open http://localhost:8000/index.static.html or http://localhost:8000/kid_reporter_page.html
```

2. Using the npm script (requires `npx`):

```bash
npm run start
# opens static server via `serve` package (npx will fetch it on demand)
```

Vite development & production build

This project now includes a Vite + React build for production-ready precompilation.

Install dependencies:
```bash
npm install
```

Run dev server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

Notes:
- Static assets (images) placed at project root (e.g. `/anime_romeo.png`) are referenced from the React app and will be copied into `dist/` by Vite.
- Tailwind is configured with PostCSS and used via `src/styles.css`.

Deployment tips

- For Vercel: point the build output to the `dist/` folder (Vercel auto-detects Vite and will run the build during deploy). If you prefer, I can add a `vercel-build` script or update `vercel.json` to customize routes.

If you'd like, I can now:
- Finish porting and split the big App into smaller components (recommended for maintainability).
- Add eslint + prettier and a small test to validate basic rendering.
- Push guidance for GitHub (I won't push without your permission).
# Pull My Card — Project

This workspace contains two main pages for the Pull My Card project:

- `index.html` — main React-based homepage (in-browser Babel UMD build). Use for local preview and development.
- `index.static.html` — static, dependency-free preview of the homepage for quick previews and pitching.
- `kid_reporter_page.html` — The Kid Reporter landing page (React via in-browser Babel as provided).

Quick preview locally

1. Using Python's simple server (recommended):

```bash
cd /home/dorisb/FJprojects/pull_my_card
python3 -m http.server 8000
# Open http://localhost:8000/index.static.html or http://localhost:8000/kid_reporter_page.html
```

2. Using the npm script (requires `npx`):

```bash
npm run start
# opens static server via `serve` package (npx will fetch it on demand)
```

Deploying to Vercel

- Vercel automatically serves static files from the repository root. To deploy:
  1. Push this repo to GitHub.
  2. Connect the repository to Vercel and deploy. Vercel will detect a static site and serve the files.

Notes & next steps

- The pages use in-browser Babel to compile JSX at runtime. This is convenient for quick edits and previews but not recommended for production. For production deploys, I recommend precompiling the React sources with a build tool (Vite or a small Webpack config) to produce optimized, static assets.

- I can scaffold a Vite build and add a proper production pipeline (fast, smaller bundles) if you'd like to host a precompiled React app on Vercel.

If you want me to set up the Vite build and precompile both pages for production, say the word and I'll scaffold it and run a quick build locally.
