# Plain Academy

A static, responsive learning site for the Plain programming language. Built with HTML, CSS and vanilla JavaScript. It has zero third-party package dependencies.

## Features

- Detailed lessons based on the Plain Ecosystem README, semantics and standard-library documentation.
- Orange-and-black visual design, responsive layout and CSS motion effects.
- Animated hero, floating code panel, moving feature ticker, roadmap, reveal-on-scroll sections and small diagrams.
- Searchable quick reference, copy-code controls and a five-question knowledge check.
- No backend, API, account, authentication, database, cookies, localStorage or sessionStorage.
- Quiz state and search state live only in the current page memory and reset when the page reloads.
- Static assets only; no server functions are required.

## Run locally

Requires Node.js 18+. No package installation is needed.

```bash
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

The production site is written to `dist/` (including a custom 404 page and robots.txt). The build script uses only Node.js built-in modules.

## Deploy to Vercel

### Option A — deploy this folder as its own project

1. Push the repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Set **Root Directory** to `plain-learn`.
4. Framework preset: **Vite** (or Other if Vercel does not detect it).
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Install command: leave blank (there are no dependencies).
8. No environment variables are required. Deploy.

### Option B — Vercel CLI

From this folder:

```bash
npm run build
npx vercel
```

For production:

```bash
npx vercel --prod
```

## Content accuracy

The lessons are an educational introduction, not a promise that every code fragment is a complete runnable project. The language has specific compiler/runtime semantics. Check the Plain Ecosystem's `docs/SEMANTICS.md`, `docs/STDLIB.md`, `docs/ML.md` and actual compiler version for the authoritative details. The website deliberately does not pretend to execute Plain code in the browser.

## No persistence

Nothing is submitted to an application backend. There are no login flows or tracking SDKs. The browser necessarily requests static files from the hosting provider, and the page uses system font fallbacks, so it does not need a third-party font service.
