// typeset.js — how his writing is set, and where the pages fall.
//
// This is the part of the notebook that behaves like a book designer rather than
// a stylesheet. Two ideas, and everything else follows from them.
//
// ── HIS WRITING COMES IN TWO REGISTERS, AND THEY WANT DIFFERENT TYPE ──
//
// Most of the memories are written in short broken lines — twenty-four, thirty
// characters — where the break IS the writing:
//
//     I only remember
//     looking up
//     and seeing you
//
// That is verse, and verse must not wrap: a line that runs on has been re-broken
// by the screen, and once one line has been re-broken you can no longer tell
// which breaks are his. The old build set everything at 13.5–16px and let the
// phone re-wrap whatever did not fit, which quietly destroyed the one thing the
// whole project swore to protect.
//
// So verse is not given a size. Its size is DERIVED: the type grows until the
// longest line he wrote just fits the page, and stops. A memory in very short
// lines is therefore set large and intimate. If honouring every break would mean
// type too small to love — which happens when a "line" is really a sentence —
// then it was never verse, and it is set as prose instead. Nothing is forced.
//
// The letters are the other register: real paragraphs, meant to be read the way
// any letter is. They wrap, because wrapping is what prose expects — and a
// wrapped line is given a small hanging indent, so a line starting flush is one
// HE broke and a line starting indented is one the page broke. She will never
// notice it consciously and will never once be confused.
//
// ── LENGTH IS PAGES, NOT SCROLL ──
//
// Nothing in this notebook scrolls. A manuscript longer than the page becomes
// two pages, or three, split only between his stanzas and never inside one. She
// turns. That is why this build has no scroll cage, no gesture arbitration and
// no reading gate anywhere in it: a book solved this problem centuries ago.
//
// ── EVERYTHING HERE IS MEASURED, NOT ESTIMATED ──
//
// The first version of this file measured with a canvas, which quietly lied:
// `ui-serif` cannot be parsed in a canvas font string, so every measurement came
// back in a default face and every page was set at maximum size and overflowed.
// It now measures by laying the actual text out in the actual page, in the
// actual font, and reading back the actual height. Slower, and correct.

// ── THE REGISTERS ──
//
// Not one type scale with different numbers in it. Four voices, because the book
// has four things to do with a piece of writing: read it, be stopped by it,
// overhear it, or be handed it on a separate sheet.
//
//   leaf      the reading page. Comfortable, unremarkable, gets out of the way.
//   epigraph  one stanza alone on a page. Large, tighter tracking, tighter
//             leading — display setting, where the letterforms themselves are
//             the thing she is looking at.
//   marginal  overheard. Small, loose, low on the page.
//   letter    a letter on loose paper. Reads like correspondence.
//
// Tracking moves against size, the way it must: type set large needs to be
// pulled together or it falls apart into separate letters, and type set small
// needs opening up or it closes into a grey line.
const REGISTER = {
  leaf:     { max: 34, floor: 16.5, prose: [18.5, 19.5], lead: [1.62, 1.72], track: "0.006em" },
  epigraph: { max: 46, floor: 22,   prose: [24, 27],     lead: [1.32, 1.4],  track: "-0.012em" },
  marginal: { max: 18, floor: 14,   prose: [15, 16],     lead: [1.62, 1.68], track: "0.014em" },
  // Both letters. They bookend the piece and read as one hand on one kind of
  // stationery, which they were.
  letter:   { max: 30, floor: 16,   prose: [18, 19],     lead: [1.6, 1.7],   track: "0.006em" },
};

// ── his emphasis ───────────────────────────────────────────────────────────
// Italics and bold arrive beside the words as character offsets rather than as
// tags inside them, so the writing stays one plain string the whole way from
// Word to the page. Here, and only here, the offsets become elements.
//
// THIS LIVES IN THIS FILE BECAUSE THE RULER HAS TO USE IT TOO. It used to be in
// book.js, and the ruler measured the plain string — so a line he set in bold
// measured narrower than it rendered, and verse, which shrinks until not one of
// his lines is re-broken, was shrinking against the wrong width. Her one line in
// Green Forest — the line the whole memory is about, and bold — came out wrapped
// on a wide screen, in the register that has no hanging indent to tell a page's
// break from one of his. Measuring and rendering now go through one function,
// which is the only way they can be guaranteed to agree.
export function inked(p, text, marks) {
  if (!marks?.length) { p.textContent = text; return; }
  const edges = [...new Set([0, text.length, ...marks.flatMap((m) => [m.s, m.e])])]
    .filter((n) => n >= 0 && n <= text.length)
    .sort((a, b) => a - b);
  for (let k = 0; k < edges.length - 1; k++) {
    const [a, b] = [edges[k], edges[k + 1]];
    if (a === b) continue;
    const m = marks.find((m) => m.s <= a && m.e >= b);
    const piece = text.slice(a, b);
    if (!m) { p.appendChild(document.createTextNode(piece)); continue; }
    const node = document.createElement(m.b ? "strong" : "em");
    if (m.i && m.b) node.appendChild(Object.assign(document.createElement("em"), { textContent: piece }));
    else node.textContent = piece;
    p.appendChild(node);
  }
}

// The marks for one line of a stanza, given the stanza's marks and where that
// line starts inside it. Offsets are stored against the whole stanza, so each
// line has to take its own slice — the same arithmetic the page does.
function marksForLine(all, at, text) {
  return (all ?? [])
    .filter((m) => m.e > at && m.s < at + text.length)
    .map((m) => ({ ...m, s: Math.max(0, m.s - at), e: Math.min(text.length, m.e - at) }));
}

// One stanza, laid out exactly as the page lays it out — same element, same
// class, same emphasis. Everything the ruler measures is built with this.
function stanzaEl(block, beat, marks, register) {
  const st = document.createElement("div");
  st.className = beat ? "stanza beat" : "stanza";
  let at = 0;
  for (const line of block.split("\n")) {
    const p = document.createElement("p");
    const text = setLine(line, register);
    inked(p, text, marksForLine(marks, at, text));
    st.appendChild(p);
    at += line.length + 1;              // + the newline he typed
  }
  return st;
}

// ── the ruler ──────────────────────────────────────────────────────────────
// A real page, kept off screen, that answers questions by actually setting type.

export function ruler(page, host) {
  const line = document.createElement("span");
  // align-self matters more than it looks. The page body is a flex column, so a
  // measuring span dropped into it is a flex item and gets STRETCHED to the full
  // width by align-items — which made widest() return the available width at
  // every size, at which point the "verse never wraps" rule was measuring
  // nothing at all. Verse was only ever shrinking to fit the page vertically,
  // and a line too long for the measure would quietly wrap, in the one register
  // that has no hanging indent to distinguish his break from the page's.
  line.style.cssText = "white-space:pre;display:inline-block;align-self:flex-start;";

  return {
    host,
    // The two registers are laid out differently — prose carries a hanging
    // indent, which costs it width — so the ruler has to be wearing the same
    // clothes as the page it is measuring for.
    register(kind) {
      page.classList.remove("is-verse", "is-prose");
      page.classList.add(`is-${kind}`);
    },
    // Tracking is part of the measurement, not a finish applied afterwards.
    // The ruler used to measure untracked type and the page then rendered it
    // with the register's tracking, so a line measured as just fitting came out
    // several pixels wider and wrapped — in verse, where a wrap is
    // indistinguishable from one of his own line breaks.
    size(px, leading, track) {
      host.style.fontSize = `${px}px`;
      host.style.lineHeight = String(leading);
      host.style.letterSpacing = track ?? "normal";
    },
    // The width of a single line if nothing were allowed to break it — set the
    // way it will really be set, emphasis and all.
    widest(blocks, marks) {
      host.textContent = "";
      host.appendChild(line);
      let w = 0;
      blocks.forEach((b, k) => {
        let at = 0;
        for (const l of b.split("\n")) {
          line.textContent = "";
          inked(line, l, marksForLine(marks?.[k], at, l));
          w = Math.max(w, line.offsetWidth);
          at += l.length + 1;
        }
      });
      host.textContent = "";
      return w;
    },
    // The height these blocks actually occupy, laid out exactly as they will be.
    //
    // "Exactly" is the whole point. The first version of this appended the
    // paragraphs straight into the page body, which is a flex column — so every
    // one of them was quietly compressed by flex-shrink and reported a height
    // smaller than it would really take. Every page measured as fitting, and
    // every long page then overflowed off the paper. It now builds the same
    // `.set` wrapper the real page builds, which does not shrink.
    heights(blocks, marks) {
      host.textContent = "";
      const set = document.createElement("div");
      set.className = "set";
      const beats = beatsIn(blocks);
      // Built with stanzaEl, so the widow fix and his emphasis are both already
      // applied — binding two words together can push a line over, and so can a
      // line being bold, and the ruler has to see both.
      const ps = blocks.map((b, k) => {
        const st = stanzaEl(b, beats[k], marks?.[k], page.classList.contains("is-prose") ? "prose" : "verse");
        set.appendChild(st);
        return st;
      });
      host.appendChild(set);
      const out = ps.map((p) => p.offsetHeight);
      const gap = ps.length > 1 ? ps[1].offsetTop - (ps[0].offsetTop + ps[0].offsetHeight) : 0;
      const total = set.offsetHeight;
      host.textContent = "";
      return { out, gap, total };
    },
    // The height of every individual line, laid out exactly as it will be.
    // One line that comes out twice as tall as the shortest has been wrapped.
    lineHeights(blocks, marks) {
      host.textContent = "";
      const set = document.createElement("div");
      set.className = "set";
      const beats = beatsIn(blocks);
      blocks.forEach((b, k) => {
        set.appendChild(stanzaEl(b, beats[k], marks?.[k], page.classList.contains("is-prose") ? "prose" : "verse"));
      });
      host.appendChild(set);
      const out = [...set.querySelectorAll("p")].map((p) => p.offsetHeight);
      host.textContent = "";
      return out;
    },
    // The content box — what the words actually get, once the page's own
    // margins have taken their share.
    get width() {
      const cs = getComputedStyle(host);
      return host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    },
    get height() {
      const cs = getComputedStyle(host);
      return host.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    },
  };
}


// ── beats ──────────────────────────────────────────────────────────────────
// Some of his stanzas are not paragraphs. They are landings — one short line
// standing on its own after a long thought:
//
//     As if arriving early somehow made me look calmer.
//
//     It didn't.
//
// Set as an ordinary paragraph with ordinary space above it, a line like that
// reads as the next item in a list. It is not. It is the moment the paragraph
// before it was building towards, and on paper it would be given room.
//
// This is measured, not interpreted: a beat is a SINGLE short line among
// materially longer ones. A manuscript written entirely in short lines — Green
// Forest, the air hockey — has no beats at all, because when everything is short
// nothing is standing alone. Nothing here decides what a line MEANS.
export function beatsIn(blocks) {
  const longest = (b) => b.split("\n").reduce((m, l) => Math.max(m, l.length), 0);
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const short = b.split("\n").length === 1 && longest(b) <= 26;
    // A landing ENDS a thought. A short line that trails off into the next one —
    // "You were so close", "It simply felt", "Looking back now," — is a lead-in,
    // and putting air under it would cut his sentence in half. Only a line that
    // closes gets the room.
    const lands = /[.!?](["'\u201d\u2019])?$/.test(b.trim());
    // What makes it land is the contrast with what came IMMEDIATELY before it —
    // not with the average of the whole manuscript. Judged against an average,
    // "It didn't." disappears inside a memory that is full of short lines
    // already, which is precisely the memory it lands hardest in.
    const after = i > 0 && (longest(blocks[i - 1]) >= 40 || blocks[i - 1].split("\n").length >= 2);
    // Never two in a row: a pause repeated is not a pause, it is a layout.
    out.push(short && lands && after && !out[i - 1]);
  }
  return out;
}

// ── widows ─────────────────────────────────────────────────────────────────
// A wrapped line that ends up carrying one short word on its own is the oldest
// blemish in typesetting, and the only one the reader always sees without
// knowing what she is seeing. Binding the last two words together drags the
// second-to-last down with it. This changes a space into a non-breaking space —
// it does not change a word, a break, or a mark of his punctuation.
function unwidow(line) {
  const words = line.trim().split(" ");
  if (words.length < 4) return line;
  const tail = words[words.length - 1];
  if (tail.replace(/[^\p{L}\p{N}]/gu, "").length > 7) return line;
  return words.slice(0, -1).join(" ") + "\u00A0" + tail;
}
export const setLine = (line, register) => (register === "prose" ? unwidow(line) : line);

// Does all of it stand on one page at the size currently set?
function fitsOnePage(blocks, r, marks) {
  return r.heights(blocks, marks).total <= r.height;
}

// Does any line he wrote get re-broken at the size currently set?
//
// This asks the outcome rather than a proxy for it. Comparing a measured line
// width against the available width sounds equivalent and is not: it depends on
// the engine's font metrics, and the two browsers disagree by a few pixels on
// exactly the lines that sit closest to the edge — so a page could pass the
// width comparison and still wrap in Safari, which is the only browser that
// matters here. Laying the text out and asking how tall each line came out
// cannot be wrong in either engine.
function nothingWraps(blocks, r, marks) {
  return r.lineHeights(blocks, marks).every((h, i, all) => h <= all.reduce((m, x) => Math.min(m, x), Infinity) * 1.5);
}

// ── where the pages fall ───────────────────────────────────────────────────
// Split only between stanzas, never inside one. Then even the pages out: a page
// carrying eleven stanzas followed by one carrying two is a mistake nobody would
// make on paper.
function paginate(blocks, r, height, marks) {
  // Measured, not added up. This used to total the individual stanza heights and
  // insert one representative gap between each pair — which is right only if
  // every gap is the same size, and they are not: a beat takes 2em above it and
  // 1.6em below, so any page carrying one was measured several pixels shorter
  // than it really is and quietly grew into the bottom margin.
  //
  // Laying the actual group out is also the only way to see what the real page
  // will see, because which stanzas ARE beats depends on the group — beatsIn
  // judges a line against the one immediately before it, and the line before
  // may have been left on the previous page.
  const fits = (group) =>
    r.heights(group.map((j) => blocks[j]), group.map((j) => marks?.[j])).total <= height;

  let count = 0, i = 0;
  while (i < blocks.length) {
    const page = [];
    while (i < blocks.length && (page.length === 0 || fits([...page, i]))) page.push(i++);
    count += 1;
  }
  if (count <= 1) return { pages: [blocks], overflows: !fits(blocks.map((_, j) => j)) };

  const per = Math.ceil(blocks.length / count);
  const pages = [];
  let page = [];
  for (let j = 0; j < blocks.length; j++) {
    const full = page.length >= per && pages.length < count - 1;
    if (page.length && (full || !fits([...page, j]))) { pages.push(page); page = [j]; }
    else page.push(j);
  }
  if (page.length) pages.push(page);
  return { pages: pages.map((p) => p.map((j) => blocks[j])), overflows: false };
}

// ── the one thing this file is for ─────────────────────────────────────────
// Given his words and the page they have to live on: at what size, in which
// register, and broken where.
// `unbroken` — set the whole thing as ONE piece and never paginate it. The
// opening letter is a single sheet of paper that she pulls out of an envelope;
// it is not a sequence of pages and must never be cut into one. Everything else
// in the book still obeys "a memory is a page".
export function typeset(blocks, r, phone, as = "leaf", marks, unbroken = false) {
  const R = REGISTER[as] ?? REGISTER.leaf;

  // Try it as verse: grow until his longest line just fits.
  r.register("verse");
  let size = R.max;
  r.size(size, R.lead[0], R.track);
  while (size > R.floor && r.widest(blocks, marks) > r.width) {
    size -= 0.5;
    r.size(size, R.lead[0], R.track);
  }

  if (r.widest(blocks, marks) <= r.width) {
    // A MEMORY IS A PAGE. He wrote these in stanzas with air between them, and
    // the air is not a list of places it may be cut: "The truth is," ending one
    // page and "I still don't know" beginning the next breaks a thought in half
    // at the one moment she has to move her hand. So verse gives up type size
    // before it gives up staying whole — it shrinks until all of it is on one
    // page, and only if it still cannot fit does it become two.
    // Shrink until all of it stands on one page AND not one of his lines has
    // been re-broken. Verse has no hanging indent, so a wrap here would be
    // indistinguishable from a break he made himself.
    // An unbroken sheet has no page to fit inside — it is as long as it is — so
    // the only thing it shrinks for is one of his lines being re-broken.
    let ok = (unbroken || fitsOnePage(blocks, r, marks)) && nothingWraps(blocks, r, marks);
    while (!ok && size > R.floor) {
      size -= 0.5;
      r.size(size, R.lead[0], R.track);
      ok = (unbroken || fitsOnePage(blocks, r, marks)) && nothingWraps(blocks, r, marks);
    }
    // If it still wraps at the smallest size this register allows, then it was
    // never verse and must not be shipped as verse — a wrapped line here has no
    // hanging indent and is indistinguishable from a break he made. Falling
    // through to prose is the honest answer: prose expects to wrap, and marks it.
    if (nothingWraps(blocks, r, marks)) {
      const pages = ok ? [blocks] : paginate(blocks, r, r.height, marks).pages;
      return { register: "verse", size, leading: R.lead[0], tracking: R.track, pages };
    }
  }

  // It was never verse. Set it as a letter, and shrink only if a single stanza
  // is taller than the page it has to live on.
  r.register("prose");
  let prose = phone ? R.prose[0] : R.prose[1];
  r.size(prose, R.lead[1], R.track);
  if (unbroken) return { register: "prose", size: prose, leading: R.lead[1], tracking: R.track, pages: [blocks] };
  let { pages, overflows } = paginate(blocks, r, r.height, marks);
  while (overflows && prose > R.floor - 2) {
    prose -= 0.5;
    r.size(prose, R.lead[1], R.track);
    ({ pages, overflows } = paginate(blocks, r, r.height, marks));
  }
  return { register: "prose", size: prose, leading: R.lead[1], tracking: R.track, pages };
}
