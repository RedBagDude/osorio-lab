<div align="center">

<img src="preview.png" alt="Osorio Lab — Laboratory on Polymer Materials & Organ Printing" width="960"/>

# Osorio Lab

**Laboratory on Polymer Materials & Organ Printing** — University of Bayreuth

Research group site of **Prof. Dr. Anayancy Osorio-Madrazo**:
bioinspired polymer materials, hydrogels, chitosan fibres and 3D-bioprinted tissues.

[Live site](https://osorio-research.com) · [About Prof. Osorio](https://osorio-research.com/#about) · [Publications](https://osorio-research.com/#publications) · [Team](https://osorio-research.com/#team) · [Contact](https://osorio-research.com/#contact)

</div>

---

## ✨ What's inside

A **single-page, zero-dependency** research-group site — **vanilla TypeScript → JavaScript**, hand-rolled CSS, one CDN script (`anime.js`) for motion. No framework, no runtime build, no npm on the server: edit `content.json`, upload, done.

| | |
|---|---|
| ⚡ **Runtime stack** | `index.html` + `content.json` + compiled JS — ships to any static host |
| 🎨 **Design system** | Soft-matter aesthetic: Space Grotesk · Inter · JetBrains Mono |
| 🎬 **Motion** | anime.js v3 — split-text word reveals, scroll-scrubbed sections, staggered lists, signature `easeOutExpo` easings — all scroll-reversible |
| 🧪 **TypeScript source** | `assets/ts/*.ts` typed against the content model, compiled with `npm run build` |
| 🔍 **SEO** | JSON-LD (Organization · Person · WebSite · ScholarlyArticle), Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`, `llms.txt` for AI search |
| ♿ **Accessibility** | `prefers-reduced-motion` respected everywhere, focus-trapped modal, keyboard nav |
| 🖼️ **Media** | Optimized WebP/JPG pipeline, lazy loading, error-fallback avatars |

## 🎯 Why this stack

This is a **client site** where the owner edits content on the fly without touching code, and a fast, professional page matters more than a framework ecosystem. The whole editable surface — team, publications, topics, teaching, media, contact, UI strings — lives in **one JSON file** the owner can edit via their panel. The frontend just renders it. TypeScript gives compile-time confidence on that contract without shipping a single runtime dependency.

## 🏗️ Architecture

```text
index.html ─────────────── single page (all 8 sections)
content.json ────────────── editable content (owner edits this, loaded at runtime)
assets/
├── ts/                   SOURCE (TypeScript)
│   ├── data.ts           content seed + typed content model
│   ├── main.ts           render logic, i18n, animations, modal, SEO
│   ├── early.ts          JS-availability guard
│   └── globals.d.ts      ambient anime.js typings
├── js/                   COMPILED OUTPUT (what the browser loads)
│   ├── data.js           ← compiled from data.ts
│   └── main.js           ← compiled from main.ts
├── css/styles.css        design system: palette, type, motion
└── img/                  optimized WebP/JPG photos
```

## 🧪 From TypeScript to the browser

The site loads plain `.js` — zero build on the server. Development flow:

```bash
npm install        # once — pulls TypeScript
npm run build      # tsc compiles assets/ts/*.ts → assets/js/*.js
npm run watch      # same, recompiling on save
```

The compiled output preserves the exact runtime behaviour of the original JavaScript (verified by an old-vs-new browser probe: rendered DOM state and interactions identical between both). The `?v=` query strings in `index.html` are cache busters — bump them when you ship new JS.

## 🔧 Run locally

```bash
python -m http.server 3000   # or any static server
# open http://localhost:3000
```

## 📐 Content model

Everything editable lives in `content.json` — with `assets/ts/data.ts` as the built-in fallback seed. The TypeScript interfaces (`LabData`, `Publication`, `TeamMember`…) document the exact shape for every consumer, so a typo in the JSON is caught at the next `npm run build`, not in production.

## 🎨 Design

Scientific **soft-matter** aesthetic, matched to the lab's presentation figure — silver `#f4f5f8`, indigo `#181433`, violet `#7c3aed`, orange `#f0562b`.

Motifs drawn from the lab's own research: **molecular network** (polymer chains), **diffraction rings** (X-ray scattering), **scaffold grid** (tissue engineering), **hydrogel blobs** (soft matter).

Motion follows the animejs.com signature — masked split-word reveals with per-word `easeOutExpo`, scroll-scrubbed progress that plays forward on scroll down and reverses on scroll up.

## 📄 License & credits

Site developed for the Osorio Lab by [Jonathan Martínez López](https://github.com/RedBagDude) ([RedBagDude](https://github.com/RedBagDude)). Content © Laboratory on Polymer Materials & Organ Printing, University of Bayreuth. Motion engine: [anime.js](https://animejs.com) v3.2.1 (CDN, MIT).