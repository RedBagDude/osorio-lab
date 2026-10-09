# Osorio Lab — Laboratory on Polymer Materials & Organ Printing

Static website for the **Laboratory on Polymer Materials & Organ Printing**
(Universität Bayreuth), led by **Prof. Dr. Anayancy Osorio-Madrazo**.

A single-page research-group site built with **vanilla HTML, CSS and JavaScript**
(no framework, no build step). Ships to any static host (Cloudflare Pages,
Netlify, Vercel, GitHub Pages).

## Stack

- **HTML / CSS / JS** — no build, no dependencies beyond the `anime.js` CDN
- **anime.js** — split-text reveals, scroll-scrubbed lists, signature easings
- **SEO-ready** — JSON-LD structured data (Organization, Person, WebSite),
  Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`, `llms.txt` for AI search
- **`prefers-reduced-motion`** respected throughout

## Structure

```
├── index.html            # single page (all sections)
├── 404.html
├── content.json          # editable content (loaded at runtime)
├── assets/
│   ├── css/styles.css    # design system: palette, type, animations
│   ├── js/data.js        # content seed (fallback if content.json is missing)
│   ├── js/main.js        # render logic, i18n, animations, modal
│   ├── favicon.svg
│   └── img/              # optimized photos
└── tools/process_images.py
```

## Content model

The site loads its content from `content.json` at runtime
(`fetch("content.json")` in `main.js`), falling back to the `data.js` seed. All
editable text lives in one place — team members, publications, research topics,
teaching, media, contact info and UI strings.

## Run locally

```bash
python -m http.server 3000
# open http://localhost:3000
```

## Design

Scientific "soft-matter" aesthetic — Space Grotesk + Inter + JetBrains Mono.
Palette matched to the lab's presentation figure: silver `#f4f5f8`, indigo
`#181433`, violet `#7c3aed` and orange `#f0562b`. Motifs: molecular network
(polymer), diffraction rings (data), scaffold grid and hydrogel blobs.
