# ka1o — Portfolio

Portfolio of ka1o (陳方方), a full-stack web developer in Tokyo. Live at https://chinnhouhou.com

Single page with a WebGL hero, smooth scrolling, scroll-driven animation, case-study overlays and an EN/日本語 switch.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview
```

## Stack

- **Vite**: dev server and build
- **GSAP + ScrollTrigger**: loader, reveals, pinned horizontal gallery, scrubbed parallax
- **Lenis**: smooth scrolling
- **Raw WebGL**: the domain-warped noise shader in `src/gl.js` (no three.js)
- Fonts: Geist, Geist Mono and Instrument Serif (Google Fonts)

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Markup for every section |
| `src/style.css` | Design tokens, layout, responsive rules |
| `src/main.js` | Rendering, animation and interaction |
| `src/case.js` | Case-study overlay (FLIP open, next project, deep links `#work/<id>`, Esc to close) |
| `src/gl.js` | Hero shader |
| `src/data.js` | **Project content** (EN/JA): featured projects, index, playground |
| `src/i18n.js` | Static copy for every `data-i18n` element, EN and JA |
| `src/badge.js` | Draggable lanyard ID badge in the About section |
| `public/images/` | Placeholder photos |

## Deploy

Static build served by nginx on Cloud Run (`portfolio` service, `asia-northeast1`, project `proposal-507409`).
`chinnhouhou.com` and `www.chinnhouhou.com` are Cloud Run domain mappings pointing at this service.

```bash
gcloud run deploy portfolio --source . --region asia-northeast1 \
  --allow-unauthenticated --port 8080 --cpu 1 --memory 512Mi \
  --min-instances 0 --max-instances 3
```

## Placeholder content

Images marked `TEMP` in `src/data.js` (and the playground images) are temporary Unsplash photos, used under the Unsplash License.
