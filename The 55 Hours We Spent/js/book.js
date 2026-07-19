// book.js — the notebook.
//
// One object, one gesture: there are pages, and she turns them. Everything the
// old build made her learn — click the envelope, drag the letter three times,
// find the sliver of the boarding pass, scroll then swipe — is gone, replaced by
// the only interaction nobody has ever had to be taught. She can turn back, too;
// a notebook you cannot re-read is not a notebook. No instruction is printed
// anywhere in this build. If she has to be told, it is broken.
//
// What this file adds beyond that is the editorial system. A page is not one
// component with different content poured into it: js/memories.js says how each
// memory wants to be set, and the treatments below are different objects that
// arrive in different ways, on paper that is never quite the same twice.

import { CONTENT, EMPTY } from "./content.js";
import { MEMORIES, CLOSING, TODAY, OPENING, NOTEBOOK } from "./memories.js";
import { typeset, ruler, setLine, beatsIn, inked } from "./typeset.js";

const gsap = window.gsap;
const PHONE = () => window.innerWidth <= 720;

// One page laid over another. Paper does not somersault, and it does not hurry.
const EASE = "power3.out";

// ── the hand that made it ──────────────────────────────────────────────────
// Nothing in a real notebook is square, aligned, or identical to the page before
// it. These give every page its own small wrongness — a fraction of a degree, a
// millimetre off centre, a slightly different sheet out of the same pad — taken
// from its position in the book, so it is the same every time she opens it. It
// is her notebook; it should not be reshuffled behind her back.
const jitter = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const between = (i, salt, a, b) => a + jitter(i, salt) * (b - a);

// ── the sheets ─────────────────────────────────────────────────────────────

function sheets() {
  const run = [];
  const add = (s) => run.push(s);

  // ── before the notebook ──
  //
  // An envelope on the desk with her name on it, and inside it the letter he
  // wrote first. The letter is loose paper, not a page: it has no gutter, it
  // lies at the angle a hand left it at, and the notebook is underneath it the
  // whole time — visible at the edges, unread, waiting to be got to.
  //
  // `rests: "envelope"` means the first sheet is drawn up out of the envelope
  // and the envelope stays where it is. `rests: "notebook"` means every sheet of
  // the letter is lying ON the closed cover, so when the last one is taken away
  // the notebook is not introduced — it is simply revealed.
  add({ kind: "envelope", id: "envelope", rests: "notebook", name: OPENING.name,
        light: { tone: "#2a241e", depth: 0.58, settle: 2.0 } });
  add({ kind: "words", as: "letter", key: OPENING.words, stock: "cream",
        rests: "envelope", unbroken: true,
        light: { tone: "#3a332a", depth: 0.44, settle: 1.8 } });

  // ── the notebook ──
  add({ kind: "cover", id: "notebook", title: NOTEBOOK.title,
        light: { tone: "#2a241e", depth: 0.62, settle: 2.0 } });

  for (const m of MEMORIES) {
    for (const p of m.pages) {
      if (p.photo) add({ kind: "photo", as: p.as, src: p.photo, alt: p.alt, cap: p.cap, light: m.light, of: m.id });
      else add({ kind: "words", as: p.as, key: p.words, stock: p.stock, stop: p.stop, mark: p.mark, side: p.side, light: m.light, of: m.id });
    }
  }

  add({ kind: "kept", as: "things", item: CLOSING.kept, cap: CLOSING.kept.cap, light: CLOSING.light });
  add({ kind: "words", as: "leaf", key: CLOSING.words, sign: CLOSING.signature, stock: "cream", light: CLOSING.light });
  add({ kind: "close", id: "closed", title: NOTEBOOK.title, light: { tone: "#2a241e", depth: 0.62, settle: 2.2 } });
  // Not a page of the notebook — a letter written today, set down on top of it.
  // It is the same object as the letter in the envelope, and now it behaves the
  // same way: ONE continuous sheet, drawn through under her hand, with the last
  // words at the natural end of the paper. The piece begins and ends with the
  // same gesture — a letter read the way a letter is read — and when she has
  // finished, it rests where it was set down: on the closed notebook.
  add({ kind: "words", as: "letter", key: TODAY.words, stock: "cream", rests: "closed",
        unbroken: true,
        light: { tone: "#241f1a", depth: 0.66, settle: 1.6 } });
  return run;
}

const el = (cls, tag = "div") => { const n = document.createElement(tag); n.className = cls; return n; };

// His hand, if he has sent it, and his type if he has not.
//
// `text` comes from the manuscripts, like every other word in the piece. It used
// to be read off `CONTENT[key].text`, which was where his writing lived before
// Word became the source of truth — so once the manuscripts moved out of that
// file these two came back empty and the cover carried no name and the closing
// letter carried no signature. Both are in manuscripts/ and always were.
function hand(text, key) {
  const n = el("hand");
  const img = new Image();
  img.src = `assets/hand/${key}.png`;
  img.alt = text;
  img.onload = () => { n.textContent = ""; n.appendChild(img); n.classList.add("hand--real"); };
  n.textContent = text;
  return n;
}

// One stanza, and inside it one element per line HE broke. This is what makes
// the hanging indent legible: every line he broke starts flush, and only a line
// the page had to wrap is ever indented.
function stanza(block, register, beat, marks) {
  const s = el(beat ? "stanza beat" : "stanza");
  // Marks are offsets into the whole stanza, so each line takes its own slice.
  let at = 0;
  for (const line of block.split("\n")) {
    const p = el("", "p");
    const text = setLine(line, register);
    const here = (marks ?? [])
      .filter((m) => m.e > at && m.s < at + line.length)
      .map((m) => ({ ...m, s: Math.max(0, m.s - at), e: Math.min(text.length, m.e - at) }));
    inked(p, text, here);
    s.appendChild(p);
    at += line.length + 1;        // + the newline he typed
  }
  return s;
}

// `inked` — which turns his italics and bolds from character offsets into
// elements — now lives in typeset.js, because the ruler has to build the page
// with exactly the same function the page is built with. See the note there.

// A printed photograph, slid into four gummed corners stuck to the page.
//
// There is exactly one of these in the notebook and everything pictorial is one:
// the memories, her boarding pass, the things that were kept. It used to matter
// whether a picture was "a photograph" or "an object" — the boarding pass was
// presented as the pass itself and the keepsakes as objects lying on the paper —
// and the moment two of them shared a page the illusion tore, because they had
// been photographed from different angles under different lights. A photograph
// is allowed to have been taken differently. An object on the same table is not.
function print(src, alt, lay) {
  const p = el("print");
  if (lay) p.style.setProperty("--lay", `${lay.toFixed(2)}deg`);
  const img = new Image();
  img.src = src; img.alt = alt ?? ""; img.draggable = false;
  img.decoding = "async";        // never stall her thumb for a decode
  p.appendChild(img);
  // Four, because that is how many a photograph has and how many it takes to
  // hold one. They belong to the page; the print is slid in behind them.
  for (const c of ["tl", "tr", "bl", "br"]) p.appendChild(el(`corner corner--${c}`));
  return p;
}

// The words come from js/manuscripts.json, which is generated from the Word
// documents in manuscripts/ and never edited by hand. The registry in
// content.js still decides which slots EXIST and which are deliberately silent
// or not yet written; it just no longer contains a syllable of his writing.
let MANUSCRIPTS = {};
export function useManuscripts(data) { MANUSCRIPTS = data ?? {}; }

function wordsOf(key) {
  const slot = CONTENT[key];
  if (!slot || slot.text === EMPTY) return null;      // silence, on purpose
  const m = MANUSCRIPTS[key];
  if (!m || !m.blocks?.length) return null;           // not written yet
  return m;
}

// The one-line slots — her name, his signature. Same source as everything else.
function saidOf(key) {
  return wordsOf(key)?.blocks.join(" ").trim() ?? "";
}

export function makeBook(root) {
  const run = sheets();
  const pages = [];
  let at = 0;
  let turning = false;
  let whispers = 0;

  const room = el("room");
  const dim = el("dim");
  const stack = el("stack");
  root.append(room, dim, stack);

  function build() {
    stack.textContent = "";
    pages.length = 0;
    whispers = 0;
    const phone = PHONE();

    const probe = el("page page--words as-leaf measuring");
    const probeBody = el("body");
    probe.appendChild(probeBody);
    stack.appendChild(probe);
    const r = ruler(probe, probeBody);

    // Where each named object ends up in the pile, so that "rests on the
    // notebook" can be written before the notebook has been built.
    const where = {};
    const wants = [];
    const place = (s, set) => {
      const n = page(s, set);
      if (s.id) where[s.id] = pages.length;
      wants[pages.length] = s.rests ?? null;
      pages.push(n);
    };

    for (const s of run) {
      if (s.kind !== "words") { place(s); continue; }
      const script = wordsOf(s.key);
      if (!script) continue;
      const blocks = script.blocks;

      // A stanza taken off the end and given a page of its own. Three of these
      // in the whole book; any more and the device stops meaning anything.
      const body = s.stop ? blocks.slice(0, -1) : blocks;
      const alone = s.stop ? blocks[blocks.length - 1] : null;

      probe.className = `page page--words as-${s.as} measuring`;
      if (s.stock) probe.classList.add(`stock-${s.stock}`);
      // The marks go in with the words: a line he set in bold is wider than the
      // same line plain, and the ruler has to measure what will actually be set.
      const set = typeset(body, r, phone, s.as, script.marks, s.unbroken);
      let seen = 0;
      set.pages.forEach((group, i) => {
        place({ ...s, id: i === 0 ? s.id : null, mark: i === 0 ? s.mark : null },
          { ...set, blocks: group, from: seen, marks: script.marks,
            last: !alone && i === set.pages.length - 1 });
        seen += group.length;
      });

      if (alone) {
        probe.className = "page page--words as-epigraph measuring";
        const one = typeset([alone], r, phone, "epigraph",
          { 0: script.marks?.[blocks.length - 1] });
        place({ ...s, id: null, mark: null, as: "epigraph", stop: false, sign: null },
          { ...one, blocks: one.pages[0], from: blocks.length - 1, marks: script.marks, last: true });
      }
    }
    probe.remove();
    // Now that everything exists, say what is lying on what.
    pages.forEach((p, i) => { p.__on = wants[i] != null ? where[wants[i]] ?? -1 : -1; });
    for (const p of pages) stack.appendChild(p);
    measurePull();
    show(Math.min(at, pages.length - 1));
  }

  // What this page is lying on, from the top of the pile downwards. Three deep
  // at the opening: the letter, on the envelope, on the notebook.
  function bedsOf(i) {
    const out = [];
    let j = pages[i]?.__on ?? -1;
    while (j >= 0 && !out.includes(j) && out.length < 6) { out.push(j); j = pages[j].__on ?? -1; }
    return out;
  }

  // The envelope is open once she has taken the letter out of it, and shut
  // again if she puts it back.
  function flap() {
    const e = pages.findIndex((p) => p.__envelope);
    if (e >= 0) pages[e].classList.toggle("opened", at > e);
  }

  function page(s, set) {
    const i = pages.length;
    const n = el(`page page--${s.kind} as-${s.as ?? s.kind}`);
    if (s.stock) n.classList.add(`stock-${s.stock}`);
    // A very wide photograph on a very tall page strands itself in the middle of
    // an empty sheet. An album would simply use a squarer leaf for it, so a page
    // is allowed to say what shape it wants to be.
    if (s.cap) n.style.setProperty("--pcap", String(s.cap));
    n.__light = s.light;
    n.__as = s.as ?? s.kind;
    n.__envelope = s.kind === "envelope";
    // Loose things lie at an angle; bound pages do not. This is the angle the
    // page comes back to whenever it is put down, so a turn never has to
    // remember what kind of thing it was moving.
    n.__lay = n.__as === "letter" ? -1.3
      : n.__as === "envelope" ? -1.7
      : 0;

    // A page bound into a book cannot sit at an angle, so it does not. The only
    // thing that varies from sheet to sheet is its tone, because no two sheets
    // out of a pad are quite the same colour. Everything crooked in this book is
    // crooked because it is loose.
    n.style.setProperty("--age", between(i, 3, 0, 1).toFixed(3));

    if (s.kind === "envelope") {
      // Kraft, with a flap that opens when the letter comes out of it, and her
      // name across the front in his hand. It is the first object in the piece
      // and the only one she is given before she has read anything.
      const e = el("envelope");
      e.appendChild(el("envelope__flap"));
      const name = hand(saidOf(s.name), "name");
      name.classList.add("envelope__name");
      e.appendChild(name);
      // The one moving thing on the first screen, and it is not an instruction:
      // the corner of the envelope lifting a little and settling, the way paper
      // does when it is not lying quite flat. It stops the moment she touches
      // anything. That is the entire tutorial.
      e.appendChild(el("lift"));
      n.appendChild(e);
      return n;
    }

    if (s.kind === "cover" || s.kind === "close") {
      const c = el("cover");
      // Both ends of the book are the same board with the same title stamped
      // into it, because they are the same cover: she opens it at the title and
      // the book closes back onto it. Her name is not here — it is on the
      // envelope, where a name written by a hand actually goes.
      const t = el("cover__title");
      t.textContent = s.title ?? "";
      c.appendChild(t);
      n.appendChild(c);
      return n;
    }

    if (s.kind === "photo") {
      n.appendChild(print(s.src, s.alt, between(i, 5, -2.6, 2.6)));
      return n;
    }

    if (s.kind === "kept") {
      // Not a print. There is no paper under this and no corners holding it: it
      // is the thing itself, pressed flat in the notebook the way a closed book
      // presses a flower, lying directly on the page. Nothing was put behind it —
      // the page is the background, and a second one would turn it back into a
      // picture of a flower.
      const img = new Image();
      img.src = s.item.src; img.alt = s.item.alt ?? ""; img.draggable = false;
      img.decoding = "async";
      img.className = "pressed";
      n.appendChild(img);
      return n;
    }

    // words
    n.classList.add(`is-${set.register}`);

    // An impression in the paper, on the three pages that have no photograph and
    // never had one. It is not an illustration of what he wrote and it is not
    // decoration: it is the mark a thing leaves on the page it was kept next to,
    // and it is set so far back that she will only find it once she has stopped
    // reading. Nothing is ever laid on top of his writing.
    if (s.mark) {
      const m = el(`impression impression--${s.mark}`);
      // Set on the element, not handed to the stylesheet through a custom
      // property: a relative url() inside a custom property is resolved against
      // the stylesheet that USES it, so css/notebook.css went looking for these
      // in css/assets/marks/ and found nothing.
      m.style.backgroundImage = `url("${new URL(`assets/marks/${s.mark}.png`, document.baseURI).href}")`;
      n.appendChild(m);
    }

    const body = el("body");
    body.style.fontSize = `${set.size}px`;
    body.style.lineHeight = String(set.leading);
    if (set.tracking) body.style.letterSpacing = set.tracking;
    const block = el("set");
    const beats = beatsIn(set.blocks);
    set.blocks.forEach((b, k) =>
      block.appendChild(stanza(b, set.register, beats[k], set.marks?.[(set.from ?? 0) + k])));
    if (s.sign && set.last) {
      const sign = hand(saidOf(s.sign), "sign");
      sign.classList.add("sign");
      block.appendChild(sign);
    }
    // The whispers alternate corners. Left to chance they both landed bottom
    // left, which reads as a rule — and a rule is the one thing a whisper must
    // not look like.
    //
    // Each one now says which corner it takes, because taking them in turn meant
    // the corner depended on which whisper the book reached first — so putting
    // the memories into their true order silently moved both of these pages to
    // the other side of the sheet. They still alternate. It is just no longer an
    // accident of sequence, and reordering the book cannot disturb them again.
    // Anything that does not say falls back to taking its turn.
    if (s.as === "marginal") {
      n.classList.add(s.side ? `to-${s.side}` : (whispers % 2) ? "to-right" : "to-left");
      whispers++;
    }
    body.appendChild(block);

    // ONE SHEET, not a stack of them. The opening letter is a single piece of
    // paper longer than the screen, so it does not live inside the page box the
    // way every other page's writing does — the page box only says where its top
    // edge starts. The paper itself hangs below the screen and is drawn upward,
    // and what is under it is the notebook.
    if (s.unbroken) {
      const long = el("longsheet");
      long.appendChild(body);
      n.appendChild(long);
      n.__letter = true;
      n.__pull = { at: 0, travel: 0 };
      return n;
    }

    n.appendChild(body);
    return n;
  }

  // ── drawing the letter out ───────────────────────────────────────────────
  // The one place in the piece where something moves continuously under her hand
  // instead of turning, because it is the one place where the object is a single
  // sheet of paper and not a page. Nothing in the notebook itself scrolls.
  //
  // As it comes up, its lower edge rises with it — and what is behind that edge
  // is the notebook. So the notebook is not revealed by an animation at the end;
  // it is uncovered continuously, by her, as she reads.
  function measurePull() {
    for (const p of pages) {
      if (!p.__letter) continue;
      const long = p.querySelector(".longsheet");
      // A little further than the writing needs, so the last of the sheet keeps
      // rising after the last line and its bottom edge comes up off the board.
      // Stopped exactly at the end of the text, the paper is cut off by the
      // screen and never reads as having an end at all; carried past it, she
      // sees the edge of the letter lift and the notebook appear underneath,
      // which is the whole point of the opening.
      p.__pull.travel = Math.max(0, long.offsetHeight - p.offsetHeight) + p.offsetHeight * 0.13;
      p.__pull.at = Math.min(p.__pull.at, p.__pull.travel);
      layPull(p);
    }
  }
  const layPull = (p) => gsap.set(p.querySelector(".longsheet"), { y: -p.__pull.at });

  // Move it by `d`, and hand back however much of `d` it could not take.
  function pull(p, d) {
    const was = p.__pull.at;
    p.__pull.at = Math.max(0, Math.min(p.__pull.travel, was + d));
    p.__pull.want = p.__pull.at;          // her hand overrules any tween's plan
    layPull(p);
    return d - (p.__pull.at - was);
  }
  // Steps accumulate. `want` is where it is HEADING, not where it has got to —
  // aimed from where it currently is, tapping twice quickly killed the first
  // tween before it had travelled and the second step started over from almost
  // the same place, so the letter crawled while she pressed.
  function glide(p, to) {
    gsap.killTweensOf(p.__pull);
    p.__pull.want = Math.max(0, Math.min(p.__pull.travel, to));
    gsap.to(p.__pull, {
      at: p.__pull.want,
      duration: 0.62, ease: "power2.out", onUpdate: () => layPull(p),
    });
  }
  const heading = (p) => (p.__pull.want ?? p.__pull.at);
  const letterHere = () => (pages[at]?.__letter ? pages[at] : null);

  // ── the room's light ─────────────────────────────────────────────────────
  // Tone and depth move independently: a white afternoon and a room at midnight
  // are not one colour at two brightnesses, they are two different rooms. And
  // each memory sets its own speed — slow where the change should go unnoticed,
  // quick where the change IS the moment.
  function light(l) {
    if (!l) return;
    const t = { duration: l.settle ?? 1.8, ease: "sine.inOut", overwrite: "auto" };
    gsap.to(room, { backgroundColor: l.tone, ...t });
    gsap.to(dim, { opacity: l.depth, ...t });
  }

  // ── arriving ─────────────────────────────────────────────────────────────
  // Each treatment comes in the way that kind of thing would come in. This is
  // the difference between motion and animation: nothing here is decoration,
  // and no two kinds of page announce themselves the same way.
  function arrive(p, back) {
    const tl = gsap.timeline();
    const dir = back ? -1 : 1;
    const words = p.querySelector(".body");
    const print = p.querySelector(".print");

    switch (p.__as) {
      case "plate":
        // A photograph surfacing, not sliding. The slowest arrival in the book.
        gsap.set(p, { x: 0, scale: 1.045, autoAlpha: 0 });
        tl.to(p, { autoAlpha: 1, duration: 1.15, ease: "power1.out" }, 0)
          .to(p, { scale: 1, duration: 2.4, ease: "power2.out" }, 0);
        break;

      case "tipped":
        // The page is laid over, and the photograph settles onto it a beat
        // later — because it was put there afterwards, by hand.
        gsap.set(p, { x: `${dir * 34}%`, autoAlpha: 1 });
        gsap.set(print, { autoAlpha: 0, y: -14 });
        tl.to(p, { x: "0%", duration: 0.62, ease: EASE }, 0)
          .to(print, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.26);
        break;

      case "epigraph":
        // The page arrives quietly and empty, and then — after a pause long
        // enough to be felt — the line appears. Nothing else in the book waits.
        gsap.set(p, { x: `${dir * 20}%`, autoAlpha: 1 });
        gsap.set(words, { autoAlpha: 0 });
        tl.to(p, { x: "0%", duration: 0.9, ease: "power2.out" }, 0)
          .to(words, { autoAlpha: 1, duration: 1.5, ease: "power1.out" }, 0.55);
        break;

      case "marginal":
        // No movement at all. It does not arrive; it turns out to have been
        // there all along. The slowest fade in the book.
        gsap.set(p, { x: 0, autoAlpha: 0 });
        tl.to(p, { autoAlpha: 1, duration: 1.6, ease: "power1.inOut" }, 0);
        break;

      case "letter":
        // The two letters, and they arrive the way each actually got there.
        // The first is drawn UP out of the envelope — it comes from below,
        // already crooked, because a sheet pulled out with one hand never comes
        // out straight. The last was written today and SET DOWN on the closed
        // notebook — it comes from above and settles, the way a hand puts a
        // letter down on a thing it is leaving it with.
        if (pages[p.__on]?.__envelope && !back) {
          gsap.set(p, { x: "1.5%", y: "34%", autoAlpha: 0, rotate: p.__lay * 3.4 });
          tl.to(p, { autoAlpha: 1, duration: 0.55, ease: "power1.out" }, 0)
            .to(p, { y: "0%", x: "0%", rotate: p.__lay, duration: 1.25, ease: "power2.out" }, 0);
        } else {
          gsap.set(p, { x: 0, y: "-7%", autoAlpha: 0, rotate: p.__lay * 2.6 });
          tl.to(p, { autoAlpha: 1, duration: 0.5, ease: "power1.out" }, 0)
            .to(p, { y: "0%", rotate: p.__lay, duration: 0.92, ease: "back.out(1.2)" }, 0);
        }
        break;

      default:  // leaf, cover, keepsakes
        gsap.set(p, { x: `${dir * 38}%`, autoAlpha: 1 });
        tl.to(p, { x: "0%", duration: 0.62, ease: EASE }, 0);
    }
    return tl;
  }

  function leave(p, back, staying) {
    if (staying) return gsap.timeline();
    // A photograph does not slide away — looking up from one simply ends it.
    // Paper slides.
    if (p.__as === "plate" || p.__as === "marginal") {
      return gsap.timeline().to(p, { autoAlpha: 0, duration: 0.62, ease: "power2.inOut" });
    }
    return gsap.timeline().to(p, {
      autoAlpha: 0, x: `${(back ? 1 : -1) * 16}%`, duration: 0.54, ease: "power2.inOut",
    });
  }

  // Put a page down where it belongs in the pile, at rest.
  const rest = (p, z) => gsap.set(p, {
    autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: p.__lay ?? 0, zIndex: z,
  });

  function show(i) {
    at = i;
    const bed = bedsOf(i);
    pages.forEach((p, j) => {
      const here = j === i;
      const depth = bed.indexOf(j);
      if (here) rest(p, 20);
      else if (depth >= 0) rest(p, 19 - depth);
      else gsap.set(p, {
        autoAlpha: 0, x: j < i ? "-4%" : "4%",
        y: 0, scale: 1, rotate: p.__lay ?? 0, zIndex: 1,
      });
      const w = p.querySelector(".body"), pr = p.querySelector(".print");
      if (w) gsap.set(w, { autoAlpha: 1 });
      if (pr) gsap.set(pr, { autoAlpha: 1, y: 0 });
    });
    flap();
    light(pages[i]?.__light);
  }

  function turn(to, back) {
    if (to < 0 || to >= pages.length) return;
    // If she turns again before the last page has settled, the new turn takes
    // over. Blocking meant a quick flick through several pages was mostly
    // ignored, and paper has never behaved like that.
    if (turning) gsap.globalTimeline.getChildren().forEach((t) => t.progress(1));
    turning = true;

    const was = at;
    const from = pages[was];
    const next = pages[to];
    at = to;

    const bedFrom = bedsOf(was);
    const bedTo = bedsOf(to);
    // Two things can be true of a pile, and between them they cover the whole
    // opening and the whole ending.
    //
    //   putDown  the new page is being SET DOWN on what she is looking at, so
    //            that stays exactly where it is — the letter coming out onto
    //            the envelope, the last letter laid on the closed notebook.
    //   uncover  the new page was ALREADY LYING underneath, so it does not
    //            arrive at all; what was on top of it is taken away and it is
    //            simply there. That is the notebook appearing when the letter
    //            is finished with, and it is why the notebook is never
    //            introduced: it was under her hands the whole time.
    const putDown = bedTo.includes(was);
    const uncover = bedFrom.includes(to);
    // Anything sitting between them goes too — the envelope, when the letter
    // comes off the notebook.
    const alsoGoing = uncover ? bedFrom.slice(0, bedFrom.indexOf(to)).map((j) => pages[j]) : [];

    // The pile the new page rests on, put where it belongs before anything moves.
    bedTo.forEach((j, d) => { if (pages[j] !== from) rest(pages[j], 8 - d); });

    gsap.set(from, { zIndex: putDown ? 8 : 10 });
    gsap.set(next, { zIndex: putDown ? 12 : uncover ? 9 : 10 });

    if (!uncover) arrive(next, back);
    for (const p of alsoGoing) leave(p, back, false);
    leave(from, back, putDown).eventCallback("onComplete", () => {
      if (!putDown) gsap.set(from, { zIndex: 1 });
      turning = false;
    });
    flap();
    light(next.__light);
  }

  // A step of the letter is most of a screenful, so tapping and the arrow keys
  // move it the way turning a page would — but it is the same sheet, still
  // coming out, and she can stop anywhere in between.
  const step = () => Math.max(160, (pages[at]?.offsetHeight ?? 600) * 0.72);

  const forward = () => {
    const p = letterHere();
    if (p && heading(p) < p.__pull.travel - 0.5) return glide(p, heading(p) + step());
    turn(at + 1, false);
  };
  const backward = () => {
    const p = letterHere();
    if (p && heading(p) > 0.5) return glide(p, heading(p) - step());
    turn(at - 1, true);
  };

  // ── her hand ─────────────────────────────────────────────────────────────
  // Every way a person has ever turned a page, all accepted, none announced.
  function listen() {
    let downX = null, downY = null, downT = 0, moved = false, lastY = 0, past = 0;

    root.addEventListener("pointerdown", (e) => {
      downX = e.clientX; downY = e.clientY; downT = Date.now(); moved = false;
      lastY = e.clientY; past = 0;
      const p = letterHere();
      if (p) gsap.killTweensOf(p.__pull);      // her hand takes it off the tween
      root.classList.add("touched");
    });
    root.addEventListener("pointermove", (e) => {
      if (downX === null) return;

      // On the letter the paper comes with her finger, one to one. It only stops
      // being a drag and becomes a turn once the sheet has run out — reaching the
      // end of the letter and leaving it are two separate movements, so she can
      // never be carried off the last thing he wrote by the gesture that showed
      // it to her.
      const p = letterHere();
      if (p) {
        // Whatever the sheet cannot take is kept, and only once she has pushed a
        // clear distance PAST the end does it become a turn. Checked per event it
        // never fired: a thumb travelling 380px arrives as a dozen moves of
        // thirty, and none of them is a gesture on its own.
        past += pull(p, lastY - e.clientY);
        lastY = e.clientY;
        moved = moved || Math.abs(e.clientY - downY) > 8;
        if (past > 64) { downX = downY = null; turn(at + 1, false); }
        else if (past < -64) { downX = downY = null; turn(at - 1, true); }
        return;
      }

      const dx = e.clientX - downX, dy = e.clientY - downY;
      if (Math.abs(dx) > 46 || Math.abs(dy) > 56) {
        moved = true;
        const back = Math.abs(dx) > Math.abs(dy) ? dx > 0 : dy > 0;
        downX = downY = null;
        back ? backward() : forward();
      }
    });
    root.addEventListener("pointerup", (e) => {
      const quick = Date.now() - downT < 420;
      const still = downX !== null && Math.abs(e.clientX - downX) < 12 && Math.abs(e.clientY - downY) < 12;
      if (!moved && quick && still) (e.clientX < window.innerWidth * 0.26 ? backward : forward)();
      downX = downY = null;
    });
    root.addEventListener("pointercancel", () => { downX = downY = null; });

    window.addEventListener("keydown", (e) => {
      if (["ArrowRight", "ArrowDown", " ", "Enter", "PageDown"].includes(e.key)) { e.preventDefault(); forward(); }
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); backward(); }
    });

    let wheeling = false, spun = 0, spinDown = 0;
    window.addEventListener("wheel", (e) => {
      // The letter takes the wheel continuously, like the finger does.
      const p = letterHere();
      if (p) {
        gsap.killTweensOf(p.__pull);
        const left = pull(p, e.deltaY);
        if (Math.sign(left) !== Math.sign(spun)) spun = 0;
        spun += left;
        clearTimeout(spinDown);
        spinDown = setTimeout(() => { spun = 0; }, 260);
        if (!wheeling && Math.abs(spun) > 110) {
          wheeling = true; spun = 0;
          setTimeout(() => { wheeling = false; }, 520);
          left > 0 ? turn(at + 1, false) : turn(at - 1, true);
        }
        return;
      }
      if (wheeling || Math.abs(e.deltaY) < 8) return;
      wheeling = true;
      setTimeout(() => { wheeling = false; }, 520);
      e.deltaY > 0 ? forward() : backward();
    }, { passive: true });
  }

  let last = { w: innerWidth, h: innerHeight };
  window.addEventListener("resize", () => {
    if (Math.abs(innerWidth - last.w) < 2 && Math.abs(innerHeight - last.h) < 60) return;
    last = { w: innerWidth, h: innerHeight };
    build();
  });

  build();
  listen();
  return { forward, backward };
}
