# T72

A notebook of fifteen memories, written for one person. It opens with an
envelope lying on top of it and closes with a letter left lying on top of it.

**Branch:** `feature/v2-anniversary`. **`main`** holds v1, a superseded piece,
kept but not merged.

---

## What it is

A book. Not a website that behaves like one — a book: pages, turned.

That sentence is the whole architecture. It replaced an earlier build in which
every memory was a small bespoke animation on a shared "desk", each with its own
module, its own stylesheet, its own layout and its own gesture. That version was
carefully made and it did not work, for one reason: **there was no page.**
Everything was positioned at coordinates on an infinite surface, so a photograph
and a manuscript fought over one screen, a memory with no photograph was a layout
with a hole in it, length had nowhere to go but scrolling, and each new kind of
content needed a new gesture she had to learn. On a phone it needed an
instruction printed on screen — *"Pull the photograph out."* Once a design has to
tell you what to do, it has already failed.

Giving it pages dissolved all of it at once, and deleted 37 files doing so.

---

## The rules that produced everything else

1. **Nothing is timed against her.** Nothing advances on its own, ever.
2. **The manuscript teaches the typography**, never the reverse. His words were
   written first; the page is set to hold them at the length they are.
3. **Nothing is invented.** Every photograph is real and every object was really
   kept. Where nothing survives, the memory is words alone — it gets no
   decorative stand-in.
4. **Silence is a decision.** Some slots are deliberately empty. That is finished
   work, not a gap.
5. **No instruction appears anywhere.** If she has to be told, it is broken.

---

## Architecture

Vanilla ES modules and GSAP 3. No build step, no dependencies, no framework.
Six files.

| File | Responsibility |
|---|---|
| `js/content.js` | **All** his words. Nothing else contains a manuscript. |
| `js/memories.js` | The table of contents: what was photographed, what he wrote, what the light was. Reads like a list, not a program. |
| `js/typeset.js` | How his writing is set and where the pages fall. |
| `js/book.js` | The book: builds pages, turns them, moves the light. |
| `js/main.js` | Says "begin". |
| `css/notebook.css` | The object and the room it is lying in. |

Adding a memory means adding a few lines to `memories.js`. Nothing else.

---

## The editorial system

**A page is not one component with different content poured into it.** The first
rebuild made that mistake: every memory became a centred block of type on
identical paper, every photograph the same small print in the same place, and
flicking through, nothing announced that you had arrived anywhere new. A notebook
someone actually made does not look like that — the night that mattered takes the
whole page, and the joke takes a corner of one.

`js/memories.js` is the editorial plan. Each memory says how it wants to be set,
from six treatments that are genuinely different objects:

| | |
|---|---|
| **plate** | The photograph IS the page — full bleed, no paper, no border. Three in the book (Ride, Hands, Leaving); each one stops her. |
| **tipped** | A print stuck in under two photo corners, off-square, on a sheet whose proportions the photograph chooses. |
| **leaf** | Words on paper. The reading page. |
| **epigraph** | One stanza alone, large, on a smaller sheet, the rest left empty. Rationed to three so the device keeps its force. |
| **marginal** | Overheard rather than said — small, low, in a corner, most of the sheet blank. The rabbit and the nightsuit. |
| **letter** | ONE continuous sheet, longer than the screen, drawn through under her hand. Both letters — pulled out of the envelope at the start, set down on the closed cover at the end. The only thing in the piece that is not a page. |

**Pace** is legible in the `pages` arrays: Hands is one photograph and no words
at all; Green Forest is a single sheet of thin paper stopping on four lines; the
late middle of the book is five quiet leaves in a row; Leaving is a plate, a
leaf, and then it stops on five lines alone.

**Which corner a marginal takes is stated, not taken in turn.** The two whispers
alternate so that neither reads as a rule, and they used to get their corners
from the order the book built them in — which meant that putting the memories
into their true chronology silently moved both pages to the other side of the
sheet. Each now says its own side (`side: "left" | "right"` in `memories.js`).
They still alternate; the alternation just no longer depends on sequence, and
reordering the book cannot disturb them again.

**Nothing is identical twice.** Every sheet is dealt a tilt, a lateral shift, a
tint and a place for the lamp to fall, derived from where it sits in the book —
so it is the same every time she opens it, and never square, never quite centred,
never quite the same colour. That is most of the difference between a made object
and a rendered one.

**Motion follows the treatment.** A plate does not slide: it surfaces, over 1.15s,
and holds still. A tipped print is laid down a beat after its page arrives,
because it was put there afterwards by hand. An epigraph arrives empty and the
line appears half a second later — nothing else in the book waits. A marginal
does not arrive at all; it turns out to have been there. The first letter is
drawn up out of the envelope; the last is set down from above onto the closed
cover — each arrives the way it actually got there.

## The physical language

**One rule: everything on a page got there because a hand put it there.** Every
element has to answer *"how did this get onto this page?"* — and that question
deleted more than it added.

**The notebook contains** paper, printed photographs, photo corners, loose
letters, and a bound cover. Nothing else exists.

**Everything pictorial is a print.** Not an image, not a frame — a piece of
photographic paper somebody printed, put down, and slid into corners. The print
shrink-wraps its photograph, so nothing is cropped to fit a box and the corners
land on the real paper edge. It reads as paper because of two things: thickness
(the cut edge catches the lamp along its top-left, is in shadow along its
bottom-right) and contact (the shadow is tight beneath it and opens out down and
to the right — a sheet lying down, not a card hovering).

**One mounting system.** Four gummed corners, stuck to the *page*, with the print
slid in behind them, so the print's corner disappears underneath. One material,
one lighting model, and sized as a proportion of the print — they used to be a
fixed 26px, which read as a tab on one page and a wedge on the next.

**One lamp**, high and to the left. Every highlight is on a top-left edge, every
shadow falls down and to the right. Nothing invents its own lighting.

**What the rule removed:**

- *Full-bleed photographs.* A print cannot run off the edge of a page. The big
  images are full-**page** prints — rhythm comes from print size, not from one
  kind of picture obeying different physics.
- *Tilted pages.* A bound page cannot sit at an angle. Only loose things — prints,
  letters — are placed by hand and are therefore crooked. That one distinction
  does more for belief than any texture.
- *The screen-wide film grain.* Grain lives inside a photograph, not on the air
  in front of the book.
- *The striped fore-edge.* Looking straight down at a closed book you cannot see
  the page block; you see the board and a dark line where it overhangs.
- *The perfume, and with it the keepsakes-as-prints.* Two objects shot under two
  different lights could not share a page, so both had to become prints —
  pictures of things rather than the things. With the perfume gone the problem
  goes with it. What is left is the one object a notebook can genuinely hold: the
  bouquet, dried and pressed, cut out of its background with nothing put back
  behind it. **It is not a print.** No paper, no corners, no border — the page is
  the background, and a pressed flower has almost no relief left, so it casts
  almost nothing. This is the single exception to "everything pictorial is a
  print", and it earns it, because pressing a flower flat is exactly what a
  closed book does.

**The cover is a cased book**: drawn bookcloth (the photograph that was there ran
in long streaks and read as varnished plywood), a hinge groove, bumped board
corners, and the title — *The 55 Hours We Spent* — stamped *into* the board, dark
where the board overhangs the recess and catching the lamp along its lower edge.
It is set in the book's own serif, not the script face: the script face is his
hand, and a title is not handwriting. His hand is on the envelope.

**The envelope is the first object**, and it is lying *on* the notebook, so the
notebook is never introduced — it is under her hands from the first frame,
showing past the envelope's edges, and it is simply what is left when the letter
is finished with. Kraft, drawn like the bookcloth, smaller than the board and
crooked, with her name across the front in his hand. The flap opens when she
takes the letter out and shuts again if she puts it back.

**Piles.** Three things can lie on top of one another, and the turn understands
two facts about a pile: whether the new page is being *set down* on what she is
looking at (so that stays where it is), or was *already lying underneath* it (so
it does not arrive at all — what was on top is taken away and it is simply
there). That second one is the whole opening: the notebook is revealed, never
introduced. Both letters use it, at opposite ends of the piece.

## The visual idea

**A notebook lit by one lamp, in a room whose light changes with the memory.**

The light never falls on the page — paper is paper and stays readable. It falls
on the **room around** the page. Each memory carries a tone and a depth, carried
forward unchanged from the earlier build because they are a record of three real
days: a cool airport morning, a white afternoon, an evening going amber, a room
at ten past midnight, a night, and the airport again in the morning.

This is what lets a memory with no photograph feel complete. Green Forest is a
page of his writing in a dark room at night, which is exactly what it was.

**Impressions.** Five of those photograph-less pages carry a mark in the paper —
Kusurimas, Green Forest, the rabbit, the puck, the bottle. They are not
illustrations of what he wrote and they are not decoration: they are what a thing
leaves on the page it was kept beside. They sit *under* the writing, always, and
they multiply into the paper so its fibre and its age come through them.
`assets/marks/` — monochrome PNGs, keyed off their paper and renormalised so the
CSS opacity is the only thing deciding how faint they end up, and replaceable
with anything else at the same path.

All five are at **9.5%**, and getting there took three passes in the wrong
direction. Each was first set by turning it down until the page read exactly as
it had before and then a little further, which is the correct instinct and
produced marks nobody ever found — including the person who put them there. Two
thirds of the way up, the two drawn in the finest line (the seal, Shinchan) were
still invisible while the two drawn in heavy outline were not, which is the real
lesson: *line weight, not opacity, is what decides whether a mark is found*, and
matching the numbers is not the same as matching the presence. 9.5% is the point
at which every one of them can be found and none of them arrives before the
writing. If one ever becomes the first thing you see on its page, it is wrong,
and turning that one down is the whole of the fix.

The puck is a mark, not the object that was once cut from this memory. It never
rests on a desk, it casts nothing, and it is not claiming to have survived.

---

## Typography

Four voices, not one scale with different numbers in it, because the book has
four things to do with a piece of writing: read it (**leaf**), be stopped by it
(**epigraph** — large, tighter tracking and leading, display setting), overhear it
(**marginal** — small, loose, pale), or be handed it on loose paper
(**letter**). Tracking moves against size the way it must: type set large is
pulled together, type set small is opened up.

Within those, his writing arrives in two registers, and the book detects which by
measuring the longest line he typed before a break.

**Verse** — most of the memories. Short broken lines where the break *is* the
writing. Verse is never given a size: the type **grows until his longest line
just fits**, then stops. So a memory written in terse lines is set large and
intimate (25–29px on a phone), and nothing ever wraps. If honouring every break
would need type too small to love, it was never verse, and it is set as prose
instead. Nothing is forced.

**Prose** — the letters, and the two long memories. These wrap, because wrapping
is what prose expects, and **a wrapped line is given a hanging indent**. A line
starting flush is one *he* broke; a line starting indented is one the *page*
broke. She will never notice it consciously and will never once be confused about
where his lines end.

**A memory is a page.** Verse gives up type size before it gives up staying
whole — it shrinks until all of it stands on one page. Only the letters and the
two longest memories run to two or three pages, split between stanzas and never
inside one.

**Nothing in the notebook scrolls.** Length is pages. That is why this build has
no scroll cage and no reading gate: a book solved this several centuries ago.

**The opening letter is the one exception, and it is not in the notebook.** It is
a single sheet of paper longer than the screen, and she draws it up out of the
envelope with her hand — continuously, one to one, stopping wherever she likes.
It is not four pages and must never be cut into pages: it is one letter. As it
rises, its lower edge rises with it, and what is behind that edge is the board —
so the notebook is not revealed by an animation at the end, it is *uncovered*,
by her, over the whole length of the letter. It carries a little past the last
line so the edge of the paper lifts clear and the board shows underneath, and
only then does one more movement take the letter away. Reaching the end of what
he wrote and leaving it are two separate gestures.

**Where the pages fall is measured too.** Pagination used to total the individual
stanza heights and insert one representative gap between each pair, which is
right only if every gap is the same — and a beat takes 2em above it and 1.6em
below, so any page carrying one measured short and grew into the bottom margin.
Each candidate page is now laid out and read back whole.

**The type area is fixed, and it is placed rather than aligned.** One rectangle,
in the same place on every page — one left edge, one head margin, the first line
always landing in the same spot. Verified: across every leaf page in the book
there is exactly **one** distinct left edge and **one** distinct first-line
height.

It went wrong twice on the way here, in opposite directions. First it was centred
on each block's *own* longest line and *own* height — content-derived, so it
measured out as 44px of horizontal and 322px of vertical drift, and her eye had
to re-find the writing on every turn. The fix over-corrected into a long measure
running nearly edge to edge, hard against the left margin, which is a printed
novel and reads formal and institutional on a phone.

The distinction that resolves it: **centring a fixed measure is not the same as
centring content.** The measure is now short — real air down both sides — the
block sits well clear of the gutter, and the leading is opened up. So the writing
sits in the middle of the paper the way a hand would have put it there, and the
left edge still never moves. Only how far down the page the writing reaches
varies, which is rhythm and should.

**Beats get room.** Some stanzas are not paragraphs but landings — one short line
after a long thought: *"It didn't."*, *"I didn't."*, *"So I didn't."* Set as an
ordinary paragraph, a line like that reads as the next item in a list; it is
actually what the paragraph before it was building towards. Found by measurement,
not interpretation, so the count moves when he edits a manuscript: a single short
line that
**closes a thought** (terminal punctuation) and follows a materially longer one.
A manuscript written entirely in short lines has none, because when everything is
short nothing stands alone — and a line that trails into the next one (*"You were
so close"*) is never given air, because that would cut his sentence in half.

**Widows are bound.** A wrapped line that ends up carrying one short word alone
is the oldest blemish in typesetting and the only one a reader always notices
without knowing what she is seeing; the last two words are tied together so the
second-to-last comes down with it. This changes a space into a non-breaking
space — never a word, a break, or a mark of his punctuation.

**Punctuation hangs.** Safari honours `hanging-punctuation`, so an opening quote
sits out in the margin and the first letter of the line aligns with the letters
above and below it, instead of being shoved inward by a quote mark.

Everything above is measured, never estimated — by laying the real text out in
the real page in the real font and reading back the real height. **In the real
weight, too.** The ruler used to measure the plain string while the page rendered
his italics and bolds, so a line he emphasised was measured narrower than it was
set, and verse — which shrinks until not one of his lines is re-broken — was
shrinking against the wrong width. Her one line in Green Forest, the line that
memory is about and the only line of hers in the book, came out wrapped on a wide
screen. `inked()` now lives in `typeset.js` and both the ruler and the page build
their type with it, which is the only way the two can be guaranteed to agree.

---

## Interaction

One verb: **turn**. Swipe either direction, tap the side you want, arrow keys,
space, or the wheel. All accepted, none announced. She can turn **back**, which
the earlier build could not do at all — a notebook you cannot re-read is not a
notebook.

The only moving thing on the first screen is the bottom corner of the cover
lifting slightly and settling, the way paper does when it is not lying quite
flat. It stops the moment she touches anything. That is the entire tutorial.

---

## Running order

The true chronology — the order the fifty-five hours actually happened in. Set
in `js/memories.js`, which is the only place it is written down.

```
an envelope  ·  the letter inside it  ·  the notebook underneath
  Arrival · Lilies · Balcony · Cheek · Sleeping · Birthday
  Green Forest · Tickling · Hands · Ride · Air Hockey
  Kusurimas · Gifts · White Rabbit · Leaving
the pressed bouquet  ·  the closing letter, signed  ·  the notebook closes
  and then, resting on it: the letter he wrote today
```

**The birthday is three entries, not one.** It was written as a single chapter —
the room, the gifts, the sweet — because that is how it is remembered. It is not
how it happened: the room was at midnight, and the gifts and the White Rabbit
were found afterwards. So `birthday` keeps the plate and the beat about the
night; `gifts` and `whiterabbit` sit later, where they were found, and carry the
birthday's light with them because that is still the light they were found in.

**The light belongs to the memory, not to the position.** Every memory kept
exactly the tone it was set in, so reordering could not be used to smuggle in a
regrade. Read in the true order it now falls as one day going down — a cool
airport morning, a white afternoon, a grey balcony, and then a long dark that
does not lift again until the airport in the morning. That dark is eighteen
pages with only the scooter ride's amber inside it, and it is not a mistake: it
is what the chronology is. Almost everything after the balcony happened at
night.

**The two endings are deliberately separated.** He wrote two closings, months
apart, for two occasions, and both are true; running them back to back made the
piece end twice and each blunted the other. So the first *closes the notebook* —
keepsakes, last words, signature, cover down. The second is not in the notebook
at all. It is a letter written today, set down on top of the closed cover, which
stays visible underneath it.

**The two letters are the same object and the same gesture.** One continuous
sheet at each end, drawn through under her hand — pulled out of the envelope to
begin, read across the closed cover to end, "I love you. ♥️" at the natural end
of the paper. The piece opens and closes with the same intimate interaction, and
neither letter was ever bound in.

---

## His handwriting

`assets/hand/name.png` and `assets/hand/sign.png` **are his, and they are in.**
"Bebu" is on the envelope — the first private thing she is given, before she has
read a word — and "-H" closes the letter. They are the only two marks in the
piece made by a hand rather than set in type, and the piece now begins and ends
in his ink. Both composite into the paper (multiply) rather than sitting on top
of it, so the kraft grain comes through the strokes.

They were cut off a single sheet that also carries two lines not used here. The
paper was keyed per-region, not against one white point, and nothing was
thresholded, smoothed, thickened or vectorised — see `assets/hand/README.txt`,
which documents the method precisely enough to match if either is ever replaced.

**They are lower resolution than everything around them.** He wrote small on a
large sheet, so "Bebu" is 227px native and draws at ~2.4x on a 3x phone; "-H" is
122px and draws at ~3.3x. They read as pen and they are worth having as they are
— but they are visibly softer than the type beside them, and the only fix is a
closer photograph, one word filling the frame.

---

## Known decisions

- **`COFFEE_NOTE` is `null` and is not a to-do.** It was never given a form and
  the piece was declared complete with it unwritten. Do not fill or infer it.
- **Three slots are deliberately silent** — `PASS_BACK_01`, `PASS_BACK_02`,
  `MEMORY_NOTE_HANDS`. Hands has no words because the photograph already contains
  the thought; it gets a page to itself.
- **The air hockey puck was removed.** It existed to solve "this memory has no
  photograph", a problem the type system now solves properly. The score lands
  harder in his sentence than on a drawn disc.
- **`pass-front.png` is no longer used.** It and `arrival.jpg` are the same
  photograph; the old build carried both only because the opening was a puzzle
  where you flipped one to reveal the other.
- **`arrival.jpg` was reshot against white, on purpose, at a cost.** It used to
  be the pass lying on a dark table, photographed at an angle: 2093x841, with
  real shadow and curl, and it read as a *photograph of* the pass. It is now the
  pass squared up on white, 1193x530 — a third of the pixels, and the perspective
  and shading already flattened out of it before it arrived. Every fold, the
  crease through the red band and the torn left edge all survive, and against the
  cream sheet it reads as the card itself lying on the page rather than a picture
  of one. That was the trade: less of the room, more of the object. If a
  higher-resolution version of this same flat scan ever turns up, it is a
  drop-in replacement at the same path and nothing else changes.
- **The perfume is gone from the closing page and is not coming back.** It was
  the reason the flowers had to be a photograph of flowers. One kept thing,
  presented as itself, says more than two presented as pictures. It did return —
  as an *impression*, on the page that names it in its first line, which is the
  one form the original objection never applied to.
- **The ♥️ in his letters renders as the system emoji.** It is his, so it stays.
- **`LETTER_01_PULL` ("Pull the photograph out.") stays unused.** It is v1's
  instruction, and no instruction appears anywhere in this build. The envelope
  coming back does not bring it back with it.
- **The share card is an envelope again.** `assets/og-cover.jpg` is v1's kraft
  envelope, which stopped being accurate when the piece opened on a cover and is
  accurate once more. Its `og:description` still says "Happy Anniversary" while
  the letters now say "Happy 3 Months" — his copy, left alone.

---

## Never change

1. **The manuscripts.** Not a word, not a line break. `js/content.js` is his.
2. **The photographs.** No cropping, grading or replacing.
3. **The chronology.** It was chosen, not derived.
4. **The one-gesture rule**, and that nothing advances on a timer.
5. **That nothing scrolls**, and that no instruction is ever printed.
6. **That the two endings stay apart.**

---

## Running it

Must be served over HTTP; ES modules do not load from `file://`.

```sh
cd t72 && python3 -m http.server 8073
```

Then `http://localhost:8073/`, or the Mac's LAN address from a phone on the same
Wi-Fi.

## Support

Built and verified for iOS Safari 15+ and current desktop browsers. Verified in
WebKit at 375×812, 375×665, 393×852, 393×700, 440×956, landscape 852×393,
1280×720 and 1440×900 — with Safari's address bar both collapsed and expanded —
checking that every page fits its paper, that the type never overflows, and that
the book reaches its last page and returns to its first.
