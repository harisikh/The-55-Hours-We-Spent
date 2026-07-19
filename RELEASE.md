# The 55 Hours We Spent

**v1.0.0**

A notebook of thirty-eight pages, made once, for one person. An envelope with her
name on it in his hand; a letter drawn out of it as one continuous sheet; the
notebook underneath, which is not introduced but uncovered; fifteen memories in
the order they actually happened; the two pressed sunflowers that survived; and a
last letter set down on the closed cover.

It is a gift, not a product. Every photograph, every word and both handwritten
marks are real. Nothing in it was generated to fill a gap — where there was
nothing, the page is silent on purpose.

---

## There is no build step, and there are no dependencies

This is the single most important thing to know before maintaining it.

- **Zero dependencies.** `package.json` declares none, and `npm install`
  creates no `node_modules`. It exists only to declare `"type": "module"` (which
  keeps Node quiet when running the importer) and to name the two commands.
- **No bundler, no transpiler, no framework.** `index.html` loads
  `js/main.js` as a native ES module and the browser does the rest.
- **One vendored library:** GSAP 3, committed at `assets/vendor/gsap.min.js`.
  It is not fetched from a CDN — the notebook works with no network.
- **The authoring tools use Node built-ins only** (`node:fs`, `node:zlib`,
  `node:url`). The `.docx` reader and writer in `tools/docx.mjs` are hand-rolled
  for that reason.

The word "build" appears nowhere below because there is nothing to build. Deploy
is a file copy. This was a deliberate decision: the piece should still open in a
browser in ten years without a toolchain that no longer installs.

**The directory name contains spaces, and that has bitten this project once.**
The tools resolve their own location with `fileURLToPath`, not `URL.pathname`,
because a `file:` URL percent-encodes its path — under the old code a checkout in
`The 55 Hours We Spent/` made every read and write look for `The%2055%20…` and
the importer failed with "no manuscripts/ directory". If you add a tool, resolve
paths the same way.

---

## Folder structure

```
.
├── index.html              the whole document — one <main>, filled by JS
├── package.json            zero dependencies. Declares type:module + 2 scripts
├── package-lock.json       236 bytes, no packages. Keeps `npm ci` reproducible
├── PROJECT.md              the design bible: why every decision is what it is
├── RELEASE.md              this file
│
├── css/
│   └── notebook.css        the object and the room. Paper, cloth, light, shadow
│
├── js/
│   ├── main.js             entry point: load manuscripts, build the book
│   ├── book.js             builds pages, turns them, moves the light
│   ├── memories.js         THE EDITORIAL PLAN — order, treatments, light
│   ├── content.js          the registry: which slots exist, which are silent
│   ├── typeset.js          the ruler. Fits type so his line breaks survive
│   └── manuscripts.json    GENERATED. Never edit by hand
│
├── manuscripts/            HIS WRITING. Word documents, the source of truth
│   └── *.docx              one per slot, named for its key
│
├── assets/
│   ├── v2/*.jpg            the photographs
│   ├── marks/*.png         the five impressions (watermarks)
│   ├── hand/name.png       "Bebu", his handwriting, on the envelope
│   ├── hand/sign.png       "-H", his handwriting, closing the letter
│   ├── og-cover.jpg        the link preview card
│   └── vendor/gsap.min.js  GSAP 3, vendored
│
├── artifacts/
│   └── sunflower.png       the pressed bouquet — the one thing kept
│
└── tools/
    ├── import-manuscripts.mjs   .docx  ->  js/manuscripts.json
    ├── export-manuscripts.mjs   ran once, historical. See below
    └── docx.mjs                 minimal .docx reader/writer
```

---

## Installation

```sh
git clone <repo>
cd "The 55 Hours We Spent"
npm install          # optional — there are no dependencies to fetch
```

Node is needed only to re-import manuscripts. To read the notebook, it is not
needed at all.

---

## Development

Any static file server, from the repository root. It must be served over HTTP —
opening `index.html` from the filesystem will fail, because ES modules and
`fetch` are blocked on `file://`.

```sh
npm run dev          # python3 -m http.server 8073
# or:  npx serve .
# then open http://localhost:8073
```

To read it on a phone on the same network, serve on `0.0.0.0` and open
`http://<your-lan-ip>:8073`.

## Production build

None. The repository *is* the build. Nothing is minified, compiled or bundled.

## Deployment

Copy the directory to any static host. No configuration, no redirects, no
server-side anything.

```sh
# GitHub Pages: push, then Settings -> Pages -> deploy from branch root
# Netlify:      drag the folder onto the dashboard, or
netlify deploy --dir=. --prod
# Vercel:
vercel --prod
```

The one requirement is that the host serves `.json` and `.docx` without
rewriting, and serves `js/*.js` as `text/javascript`. Every default static host
already does.

---

## How to update a manuscript

**Never edit `js/manuscripts.json`.** It is generated and will be overwritten.

1. Open the `.docx` in `manuscripts/` whose name matches the slot key.
2. Edit it in Word. Two kinds of break, and only two:
   - **Enter** — a new paragraph → a new **stanza**, with air before it.
   - **Shift+Enter** — a line break → a new **line inside** the stanza, tight.
   - *Italic* and **bold** are carried through as character offsets.
3. Save, still as `.docx`.
4. Regenerate (below), reload the page.

His line breaks are load-bearing. In verse, the notebook guarantees no line he
typed is ever re-broken by the page — it shrinks the type until the longest line
fits. Adding one long line will shrink the whole page.

## How to regenerate the manuscript JSON

```sh
npm run manuscripts  # node tools/import-manuscripts.mjs
```

Reads every `.docx` in `manuscripts/`, writes `js/manuscripts.json`, prints a
stanza count per file. It also cross-checks against the registry in
`js/content.js` and warns about:

- **orphans** — a `.docx` with no registry entry, so it appears nowhere.
- **missing** — a registry slot expecting words that Word has none for.

`js/manuscripts.json` is **committed on purpose**, so the notebook runs with no
build step. Commit it whenever you regenerate.

## How to replace a photograph

Drop the new file at the same path in `assets/v2/` and keep the filename.
Nothing else changes; `js/memories.js` refers to them by path.

If the aspect ratio changes noticeably, check the page still composes — a very
wide image on a tall page strands itself. `cap:` on a page in `memories.js` sets
that page's aspect (the boarding pass uses `cap: 1.12` for exactly this reason).

## How to replace the handwriting

Drop a transparent PNG at `assets/hand/name.png` or `assets/hand/sign.png`.

- The book swaps from a type fallback to the real ink automatically, and falls
  back again if a file is missing — **the fallback is live and should stay live.**
- Ink is composited into the paper with `mix-blend-mode: multiply`, so the
  background must be genuinely transparent, not white.
- `assets/hand/README.txt` documents exactly how the current two were cut —
  keyed per-region, nothing thresholded, smoothed, thickened or vectorised.
- **If you re-cut `sign.png`, remeasure `--pad` in `css/notebook.css`.** It is
  that file's transparent left margin as a fraction of its width, and it is what
  aligns the dash under the first letter of the line above. It is the one number
  in the CSS that depends on an image file.

## How to replace an impression (watermark)

Drop a monochrome PNG at `assets/marks/<name>.png`, keyed and renormalised to
full-strength ink — the CSS opacity is the only thing deciding how faint it ends
up. See `assets/marks/README.txt`. All five sit at 9.5%.

---

## Important notes for future maintenance

**`js/memories.js` is the editorial plan.** Order, treatment, light and marks all
live there and nowhere else. It is the file to open first.

**The order is the true chronology**, not a sequence arranged for effect. The
birthday is three separate entries because the room, the gifts and the White
Rabbit happened at three different times.

**The silent slots are deliberate, not a TODO list.** `content.js` marks some
slots `EMPTY` (intentionally silent — `MEMORY_NOTE_HANDS` has no words because
the photograph already contains the thought) and one `null` (still unwritten).
Do not "finish" them. `unwritten()` and `silent()` in `content.js` report which
are which; they are author tools and the app never calls them.

**Nothing in the notebook scrolls.** A memory is a page, and it is turned. The
two letters are the only exception in the piece — each is one continuous sheet
drawn through under her hand, and that is the whole reason `.longsheet` exists.

**Do not add `will-change` to `.page` or `.longsheet`.** It was there once and it
crashed iOS Safari after about twenty pages by pinning all forty sheets as
permanent GPU layers. The comments in the CSS say so at both sites.

**Verse must never wrap.** If a page ever re-breaks a line he typed, that is the
one bug this project exists to prevent.

**`tools/export-manuscripts.mjs` ran once**, to move the writing out of the code
and into Word. It reads prose from `content.js`, which no longer holds any, so
running it today would write empty documents. It is kept as the record of how
the manuscripts were created — **do not run it.**

**The `.docx` files are the source of truth for every word in the piece.** They
are irreplaceable in a way the code is not. Back them up.
