<p align="center">
  <img src="preview.png" alt="Osorio Lab website" width="880"/>
</p>

# Osorio Lab — Laboratory Website

Production website for the **Laboratory on Polymer Materials & Organ Printing** (Prof. Dr. Anayancy Osorio-Madrazo, University of Bayreuth), live at [osorio-research.com](https://osorio-research.com).

Built with vanilla **TypeScript** compiled to plain JavaScript — no framework, no bundler at runtime, no server-side rendering. The entire editable surface — 46 publication entries, 15 team members, 18 alumni, 20 research topics and 64 UI strings — is driven by a single `content.json` file, so non-technical staff can update the site without touching code.

[![TypeScript](https://img.shields.io/badge/lang-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![anime.js](https://img.shields.io/badge/motion-anime.js_3.2.1-FF4C65)](https://animejs.com)
[![runtime](https://img.shields.io/badge/runtime-zero_build-%23000)](#built-with)
[![dep](https://img.shields.io/badge/dependencies-1_(CDN)-blue)](#built-with)

## Built With

- **TypeScript** (strict mode) — sources in `assets/ts/`, compiled to the plain JS the browser loads.
- **Vanilla DOM** — rendering, templating and state are hand-rolled; no framework runtime.
- **anime.js 3.2.1** (CDN) — the only external runtime dependency.
- **CSS3** — single hand-written stylesheet, no preprocessor.
- **JSON** — `content.json` as the single content source, validated against TS interfaces at build time.

## Features

- **Content-driven rendering** — every section renders from `content.json` (fetched at runtime with `cache: "no-store"`), falling back to the `data.js` seed compiled from `data.ts` if the fetch fails.
- **Typed content contract** — `LabData`, `Publication`, `TeamMember` and `TeachingPeriod` interfaces in `data.ts` document the exact JSON shape; a typo in the content breaks `npm run build`, not production.
- **Runtime i18n overlay** — 64 UI string keys (`window.I18N`), overridable per language from the same JSON via the `i18n` field.
- **Compiled-output parity** — the TS→JS translation was verified with a real-browser probe that compared the old JS and the new compiled JS on rendered DOM state and interactions (result: identical, zero page errors).
- **SEO as code** — JSON-LD `@graph` generated at runtime for all 46 publication entries (`ScholarlyArticle` / `Chapter` / patent), plus static Organization / Person / WebSite entities, Open Graph, Twitter cards, `sitemap.xml`, `robots.txt` and `llms.txt` for AI search engines.
- **Accessibility** — `prefers-reduced-motion` short-circuits every animation; focus-trapped team modal with Escape/Tab handling; ARIA labels resolved through the i18n layer.
- **Image pipeline** — 19 WebP images with JPG fallbacks, lazy loading, on-error avatar fallback generated from member initials, and `?r=` cache-busting retries.
- **XSS hardening** — all content interpolated through an HTML escaper; `safeUrl()` whitelists `http(s)`, `mailto:` and `tel:`, and blocks `javascript:`/`data:` schemes.

## Project Structure

```text
index.html              single page — loads 3 scripts, zero inline logic
content.json            editable content (what the site owner maintains)
assets/
├── ts/                 TypeScript sources
│   ├── data.ts         content seed + typed content model
│   ├── main.ts         rendering, i18n, animations, modal, SEO
│   ├── early.ts        JS-availability guard (prevents FOUC)
│   └── globals.d.ts    ambient typings for the anime.js CDN
├── js/                 compiled output (what the browser loads)
│   ├── data.js         ← data.ts
│   ├── main.js         ← main.ts
│   └── early.js        ← early.ts
├── css/styles.css      single stylesheet
└── img/                optimized WebP + JPG fallbacks
```

## Data Model

`content.json` mirrors the `LabData` interface — the full contract the owner edits:

```ts
interface LabData {
  publications: {
    articles: Publication[];  // 43 peer-reviewed
    chapters: Publication[];  // 2 book chapters
    patents: Publication[];   // 1 PCT/EP/US
  };
  team: TeamMember[];         // 15 members (photo, bio, socials)
  alumni: string[];           // 18 former members
  topics: string[];           // 20 research keywords
  teaching: TeachingPeriod[]; // grouped by degree program
  media: MediaItem[];         // press, interviews, TV
  i18n?: Record<string, string>; // overrides for the 64 UI keys
}
```

Optional fields degrade gracefully: a team member without `img` renders an initials avatar; without `bio`, the modal hides the paragraph; a publication without `url` drops the DOI link.

## Getting Started

**Prerequisites:** Node.js 18+ (build only — the site itself needs no Node) and any static file server for local preview.

```bash
git clone https://github.com/RedBagDude/osorio-lab.git
cd osorio-lab
npm install     # installs the TypeScript compiler
npm run build   # tsc: assets/ts/*.ts -> assets/js/*.js
npm run watch   # recompiles on save
```

**Preview locally** (any static server works — the deploy target is plain FTP):

```bash
python -m http.server 3000
# open http://localhost:3000
```

**Deploy:** upload everything except `node_modules/`, `assets/ts/` and `tsconfig.json`. When shipping new JS, bump the `?v=` cache-busters on the `<script>` tags in `index.html`.

## Performance

- **~89 KB of JavaScript total** (uncompressed) across 3 files — no framework, no polyfills.
- **1 CDN request** (anime.js) — everything else is same-origin.
- Scroll animations are seek-driven, not replay-driven: scrub timelines to viewport progress instead of firing on intersection, so scrolling up reverses them with no reflow.
- Ambient loops (blobs, rings, dots) are gated by `(max-width: 760px)` and `prefers-reduced-motion` to cap GPU cost on mobile.

## Acknowledgements

- [anime.js](https://github.com/juliangarnier/anime) by Julian Garnier — motion engine.
- Content © Laboratory on Polymer Materials & Organ Printing, University of Bayreuth.
- Site developed for the Osorio Lab by [Jonathan Martínez López](https://github.com/RedBagDude).

## Maintenance Notes

The day-to-day surface of this site is deliberately small: nearly every routine update belongs in `content.json`, while the TypeScript sources only need attention when the shape of that data changes or when rendering, internationalization, animation or SEO behavior is adjusted.

Keep the seed in `data.ts` in step with any structural change to the JSON. It is both the fallback used when the runtime content fetch fails and the definition of the typed content contract, so drift between the two shows up as inconsistent behavior rather than an obvious error.

Prefer editing existing values over adding new fields. The optional ones are the safest path for partial information: a team member without a photo, bio or social link, and a publication without a link, all degrade gracefully instead of breaking the layout.

Because a mistyped value fails the build rather than production, run the build after every content change and only upload once it passes. Deployments stay a plain file upload — ship everything except the build-only folders and configuration file — and whenever the compiled JavaScript changes, also bump the cache-busting identifiers on the script tags so returning visitors do not mix a fresh bundle with a stale one.

## Frequently Asked Questions

Most updates belong in `content.json`, so before touching any TypeScript ask whether the change alters the shape of the data or only its values; when it is only values, editing the JSON is the whole job.

If the build fails after a content edit, the typed contract is working as intended: the JSON no longer matches the interfaces declared in `data.ts`, and the compiler flags the offending entry instead of letting a broken page reach production.

Missing photos, bios, social links or publication links are not errors — those fields are optional by design and the layout degrades to initials, hidden paragraphs or absent links, so partial information can be published safely.

Changing the shape of the data is the one case that requires code work: the interfaces, the seed in `data.ts` and the runtime fetch fallback must move together, otherwise the site behaves inconsistently rather than failing loudly.

Because the only external runtime dependency is the motion library, rendering, templating and state stay hand-rolled; treat the compiled JavaScript as the shipping artifact and the TypeScript sources as the authoring layer the server never needs.

Accessibility and caching behavior are deliberate, not incidental: ambient motion respects reduced-motion preferences and small viewports, and any change to the compiled JavaScript should come with refreshed cache-busting identifiers so returning visitors never mix a fresh bundle with a stale one.

Deployment remains a plain file upload — everything except the build-only folders and the configuration file — and, as a rule of thumb, prefer editing existing values over introducing new fields whenever the available data allows it.

## Ownership and Editing Boundaries

The project serves two distinct audiences, and keeping them separate is what keeps the site low-maintenance: laboratory staff own what the page says, while the developer owns how it is rendered and shipped.

For the owner, routine work means editing existing values — publication entries, team profiles, alumni names, research topics, teaching periods, media mentions and the interface strings that can be overridden per language.

For the developer, attention is only warranted when the shape of that data changes, or when rendering, internationalization, animation or SEO behavior needs adjustment.

Shipping discipline belongs with whoever publishes: run the build before uploading, upload only what the static target actually serves, and refresh the cache-busting identifiers whenever the compiled JavaScript changes.

Optional fields are the intended escape hatch for incomplete information, so a partial record can go live without code changes and without breaking the layout.

Respecting that division keeps the editable surface small, makes every change auditable, and ensures content edits stay in one file while code edits stay in the TypeScript sources.

## Content Safety and Link Handling

Every value read from `content.json` reaches the page through an HTML escaper, so text supplied by the owner is treated as text rather than markup: angle brackets, stray tags or pasted formatting inside a bio, research topic or publication title render literally instead of becoming page structure.

Links follow the same defensive approach. Only ordinary web addresses, email addresses and telephone numbers are accepted; anything else — notably script-bearing or embedded-data style links — is discarded when the entry is rendered.

For whoever edits the content, the practical consequence is that a link outside those accepted forms simply will not appear, while the surrounding title, author list or description still renders normally. The record degrades rather than breaking the layout.

Images have their own fallback chain: a failed request is retried with cache-busting, and a member without a usable photo still appears through an avatar generated from their initials. A partial record therefore stays presentable and can be published without waiting for every asset to be complete.

This behaviour is intentional and belongs to the rendering layer, not to the content: there is no setting in the JSON to relax it, and the safe course when an entry looks incomplete in the browser is to check the value being supplied rather than to change the code.

## Language Overrides and Interface Strings

Interface text is not scattered through the markup: the roughly sixty-four user-facing strings live under a single set of keys, and the `i18n` field of the content file lets any of them be replaced per language without touching the TypeScript sources.

For an editor this means a wording change is a content change like any other — same file, same build, same upload. There is no separate translation file to keep in sync and no second place where the same sentence is stored.

The layer reaches further than visible labels: ARIA labels are resolved through the same keys, so a reworded or translated string also reaches screen-reader users, and a label that reads well on screen but poorly aloud is still worth fixing at the source.

Keep overrides narrow. Replace only the strings that genuinely need different wording and leave the rest untouched, so the default text remains the single reference for what the interface says and nothing drifts silently between languages.

Because these values pass through the same renderer as everything else, they follow the same rules: plain text only, with markup and unaccepted link schemes discarded rather than rendered.

Finally, treat a new key as a change to the shape of the data rather than to its values — it belongs with the code, not in a routine content edit.

## Pre-Publish Checklist

A content change is ready only when the affected entry renders correctly in a local preview served by any static file server; because the page fetches its content at runtime, a malformed record surfaces in the browser rather than at edit time.

Confirm that optional fields are either supplied or intentionally omitted: a missing photo falls back to initials, a missing bio hides its paragraph, and a missing link drops only that link. Those outcomes are acceptable; a broken layout is not.

Verify that links use the accepted schemes so an entry does not silently lose its address, and that pasted text appears literally instead of turning into page markup.

If the edit touched only values in the content file, nothing else needs to move. If it introduced a new field or a new interface key, treat it as a change to the data contract and update the typed model and the seed together.

Run the build and let it pass before uploading; a failure there is the typed contract catching a mismatch that would otherwise reach the live site.

When the compiled JavaScript has changed, refresh the cache-busting identifiers on the script tags so returning visitors never combine a fresh bundle with a stale one.

Keep an eye on wording changes as well: a reworded interface string also reaches screen-reader users through the same keys, so it deserves the same review as visible copy.

## Fallback Behavior and Failure Modes
The site has two safety nets that behave differently, and knowing which one is acting saves time when something looks wrong.
At runtime the page requests the editable content file without caching; if that request fails, rendering continues from the seed compiled into the JavaScript, so the page stays presentable but may not reflect the latest content edits.
That fallback keeps the page alive; it does not replace the need for a successful build and a correct deploy.
At build time the typed contract is stricter: a mistyped or structurally mismatched entry fails the build rather than reaching production, and the fix is to correct the content or move the interfaces and seed together.
Optional fields are the third kind of handling: a missing photo, bio, social link or publication link degrades to initials, a hidden paragraph or an absent link instead of breaking the layout.
When diagnosing an unexpected page, first decide whether the cause is a failed content fetch, a build-time contract mismatch or an intentionally omitted optional field, because each has a different fix and only the last may need no action at all.

## Asset Refresh and Caching Cues

The site mixes two caching behaviors, and keeping them straight avoids the familiar “I updated it but nobody sees it” confusion.

Content itself is requested at runtime without caching, so a JSON edit normally appears on the next page load with no extra step; if it does not, the likelier cause is a failed fetch falling back to the compiled seed rather than a stale browser cache.

The compiled JavaScript is the opposite case: browsers hold on to it, so whenever a change to the TypeScript sources alters the shipping bundle, the identifiers on the script tags in the single HTML page should be refreshed at the same time.

Images sit in between — they are served as optimized WebP with JPG fallbacks, loaded lazily, and a failed request is retried with a cache-busting parameter before a team member without a usable photo falls back to an initials avatar.

Because deployment stays a plain file upload, the practical rule is to upload the full served surface rather than selected files, and to treat refreshed script identifiers as part of shipping new JavaScript rather than as an optional cleanup.

The one external runtime dependency is not part of that upload, so its availability is a separate concern from anything the owner edits in the content file.
