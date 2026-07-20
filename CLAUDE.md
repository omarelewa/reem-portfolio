# CLAUDE.md — Reem Awad Portfolio

## What this is
A **finished, self-contained static website** — Reem Awad's design portfolio: a home page plus 12 project case studies. No build step, no framework to install. Every page is plain HTML that loads `site.css`, two local scripts (`support.js`, `case-study.js`), self-hosted React (`vendor/`), and Google Fonts.

**Do not rewrite or "port" this to a framework.** Enhancements happen inside the existing pattern (see Architecture).

## Status
Published to **github.com/omarelewa/reem-portfolio** → live at **https://omarelewa.github.io/reem-portfolio/** (GitHub Pages, `main` branch, root folder). The repo's pre-2022 history contains an old React portfolio; the current static site replaced it in 2026 while preserving history.

## Run / verify locally
```bash
cd <this folder>
python3 -m http.server 8000
# open http://localhost:8000
```
Click through: home → each project (work list / fullscreen menu), "Next project" bands, the lightbox (tap case-study images), and the menu at mobile widths. Navigation uses a short color "curtain" transition.

## Architecture
- `index.html` — home / work index. The hero color-shifts per project (hover on desktop, autoplay otherwise); the work section is hover-driven rows + sticky preview on desktop and per-project color cards on mobile (`.d-only` / `.m-only`).
- `<project>.html` — 12 case studies with clean hyphenated names (`anti.html`, `cairo-marathon.html`, …).
- `site.css` — **the shared design system.** Chrome (`.nav`, `.cur`, `.grain`, `.prog`, reveal, curtain), layout primitives (`.wrap`, `.sec`, `.sec-s`, `.cols` with `--cols/--gap/--ai` vars, `.vh`, `.cs-hero`, `.sticky-label`, `.masonry`), the fullscreen menu (`.mnav*`), the lightbox (`.lb*`), flip-card state, and breakpoints (≤860px stack, ≤560px small phones). Pages keep only page-unique styles in their `<helmet>` block.
- `case-study.js` — shared behavior, imported by every page: `initExtras` (menu, lightbox via `img[data-lb]`, tap-to-flip via `[data-cursor="Flip"]`, curtain link interception, per-page titles) and `initChrome` (scroll state, reveal, progress bar, custom cursor). `PROJECTS` array here is the canonical page registry — update it if pages are added/renamed.
- `support.js` — the component runtime (`x-dc` templates + React). Generated file; only the two `vendor/` URL constants were customized. It loads `vendor/react.production.min.js` + `react-dom` with SRI hashes.
- `assets/` — WebP imagery (PNG originals were 36 MB; WebP total ~1.7 MB). `assets/og/*.jpg` are 1200×630 link-preview cards; `assets/icons/` favicons + touch icons.
- `404.html` — standalone on-brand page (no runtime); redirects legacy `"<Name> Case Study.dc.html"` URLs to the new clean names.
- `manifest.webmanifest`, `sitemap.xml`, `robots.txt`, `.nojekyll`.

## Conventions (follow these when editing pages)
- Every page has a real `<head>`: title, description, canonical, OG/Twitter tags (`assets/og/<slug>.jpg`), per-page `theme-color` matching the body background, icons, manifest, fonts, `site.css`, react preloads, then `support.js` last.
- Layout via classes + CSS vars, not attribute-selector hacks: `class="cols" style="--cols:1.2fr .8fr;--gap:44px"`. Never target `[style*="…"]` — the runtime re-serializes inline styles.
- Images: WebP, descriptive `alt`, `loading="lazy" decoding="async"` (except the hero, which gets `fetchpriority="high"`), `data-lb` on showcase images to enroll them in the lightbox.
- Hover-only features need touch equivalents (`hover:hover` media guards; see flip cards / Fit & Fix flashlight).
- URLs are clean and lowercase; home links from case studies are `./` and `./#work`.

## Publishing changes
```bash
git add -A && git commit -m "…" && git push
```
Pages redeploys `main` automatically. If pages are renamed, update: hrefs in `index.html`, `PROJECTS` in `case-study.js`, per-page next-band links, `sitemap.xml`, and the legacy map in `404.html`.

## Notes
- Fonts: Google Fonts (Bricolage Grotesque, Instrument Serif, IBM Plex Mono, Cairo). Internet required.
- The old custom domain `reemawad.me` (CNAME in pre-2022 history) no longer resolves; if re-registered, add a `CNAME` file and configure Pages.
- Don't commit `node_modules` or add a bundler; there's nothing to build.

© Reem Awad. Designed & built in Cairo.
