# Reem Awad — Portfolio

Personal portfolio site for **Reem Awad**, graphic designer & art director (Cairo). Home page plus twelve deep, individually art-directed case studies, each with its own visual world and a signature interaction.

**Live:** https://omarelewa.github.io/reem-portfolio/

## Run it locally
Every page is a self-contained HTML file — no build step, no dependencies to install:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure
- `index.html` — home / work index (the site root)
- `anti.html`, `larz.html`, `lait-de-coco.html`, `mother-naked.html`, `miniz.html`, `cairo-marathon.html`, `fit-and-fix.html`, `cairo-food-week.html`, `wonderville.html`, `cairo-posters.html`, `frank-sol.html`, `photography.html` — the twelve case studies
- `site.css` — shared design system: chrome (nav, cursor, grain, reveal), responsive layout classes, fullscreen menu, lightbox, motion safety
- `case-study.js` — shared behavior: fullscreen menu, image lightbox, tap-to-flip cards, page-transition curtain, scroll reveal, reading progress, custom cursor
- `support.js` — the component runtime the pages load
- `vendor/` — self-hosted React UMD builds (no CDN dependency)
- `assets/` — WebP imagery, `assets/og/` link-preview cards, `assets/icons/` favicons
- `404.html` — on-brand not-found page; also redirects legacy `%20`-style URLs to the new clean URLs
- `manifest.webmanifest`, `sitemap.xml`, `robots.txt`, `.nojekyll`

## Mobile
The site is fully responsive: stacked layouts under 860px, a fullscreen menu, touch equivalents for the hover interactions (tap-to-flip cards, drag-the-flashlight, per-project color cards on the home work list), `svh`-based heroes for iOS, and lazy-loaded WebP images (~1.7 MB of imagery total, down from 36 MB of PNGs).

## Deploy on GitHub Pages
1. Push this folder to the repo root of `omarelewa/reem-portfolio` (branch `main`).
2. Repo **Settings → Pages** → Source: *Deploy from a branch* → `main` / root.
3. Live at `https://omarelewa.github.io/reem-portfolio/` within a minute or two.

## Notes
- Fonts load from Google Fonts (Bricolage Grotesque, Instrument Serif, IBM Plex Mono, Cairo) — an internet connection is needed for the intended typography.
- Hover interactions have touch equivalents; desktop keeps the original hover experience.

© Reem Awad. Designed & built in Cairo.
