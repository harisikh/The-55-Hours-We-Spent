// memories.js — what is in the notebook, in what order, and how each is set.
//
// This is the editorial plan: a table of contents with the designer's notes in
// the margin. It is the only place where a decision about a particular memory is
// made.
//
// ── WHY THIS FILE HAS TREATMENTS IN IT NOW ──
//
// The first rebuild gave every memory the same page — a centred block of type on
// identical paper, every photograph the same small print in the same place. It
// fixed the interaction and it flattened the book. Flicking through, one memory
// looked exactly like the next, which is the opposite of how a notebook someone
// actually made looks: the night that mattered gets the whole page, and the joke
// gets a corner of one.
//
// So a memory now says how it wants to be set, and the treatments are genuinely
// different objects rather than one object with different spacing:
//
//   plate     the photograph IS the page — full bleed, no paper, no border.
//             For the images that should stop her.
//   tipped    a print tipped in under photo corners, off-centre and off-square,
//             the way a picture is actually stuck into an album.
//   leaf      words on paper. The reading page.
//   epigraph  one stanza alone, large, the rest of the page left empty. Rationed
//             to three in the whole book so they keep their force.
//   marginal  small, low, pushed aside, surrounded by empty paper. For the
//             things he said quietly and did not want announced.
//   letter    loose paper, not a page — one continuous sheet drawn through under
//             her hand. The two letters, and nothing else in the piece.
//
// ── ORDER ──
//
// This array is the chronology. It is not an edit of the memories and it is not
// a sequence anyone arranged for effect: it is the order the fifty-five hours
// actually happened in, and the book follows it because a notebook kept during
// those hours would have.
//
// Nothing here was rewritten to fit. A memory is one unit — its photograph, its
// leaves, its whisper, its paper, its mark — and it moved whole.
//
// Three of these were one entry before. The birthday was written as a single
// chapter (the room, the gifts, the sweet) because that is how it was
// remembered; it is not how it happened. The room was at midnight, and the
// gifts and the White Rabbit were found afterwards, later in the days that
// followed. So the night keeps its plate and its beat where it belongs, and the
// two things that came later sit later. They keep the birthday's light, because
// it is still the birthday's light they were found in.
//
// ── PACE ──
//
// Read the `pages` arrays downward and the rhythm is still visible: Hands is one
// full-bleed photograph and no words at all; Green Forest is a single sheet of
// thin paper stopping on four lines; the late middle of the book is five quiet
// leaves in a row; Leaving is a plate, a leaf, and then it stops on five lines
// alone.
//
// ── THE LIGHT ──
//
// Each memory keeps exactly the light it was set in — the light belongs to the
// memory, not to the position. Read in the true order it now falls as one day
// going down: a cool airport morning, a white afternoon, a grey balcony, a room
// getting darker and darker through the night and the days inside it, and then
// the airport again in the morning. `settle` is how long the room takes to
// become that — slow where the change should go unnoticed, quick where the
// change IS the moment.

export const MEMORIES = [
  {
    id: "arrival",
    light: { tone: "#39414a", depth: 0.40, settle: 1.6 },
    pages: [
      // Her actual boarding pass — her name, GAU to CCU, seat 6A.
      //
      // `cap` is here and nowhere else in the book, and this is the page it was
      // built for. Every other photograph is portrait and fills its sheet. This
      // one is well over twice as wide as it is tall (2.25:1), so on a full
      // height page it came out as a narrow band marooned in the middle of an
      // enormous empty sheet — and her own name on it, which is the whole reason
      // it is in the book at all, was too small to read. An album would not use
      // a tall leaf for a wide print; it would use a squarer one. So this page
      // is cut squarer, and the pass fills it.
      { photo: "assets/v2/arrival.jpg", as: "plate", cap: 1.12, alt: "Her boarding pass — Guwahati to Kolkata, the eleventh of July" },
      // Twenty-four stanzas of waiting in an airport; it reads as pacing, so it
      // runs as pages of a letter. The last line is taken off the end and given
      // a page to itself, because it is the one that lands.
      { words: "MEMORY_NOTE_ARRIVAL", as: "leaf", stop: true },
    ],
  },
  {
    id: "lilies",
    light: { tone: "#e6dcc6", depth: 0.16, settle: 1.9 },
    pages: [
      { photo: "assets/v2/lilies.jpg", as: "tipped", alt: "The lilies he was holding" },
      { words: "MEMORY_NOTE_LILIES", as: "leaf" },
    ],
  },
  {
    id: "balcony",
    light: { tone: "#7f8388", depth: 0.30, settle: 1.7 },
    pages: [
      { photo: "assets/v2/balcony.jpg", as: "tipped", alt: "He is at the balcony table with a bowl of Maggi, grinning at her across it" },
      { words: "BALCONY_NOTE", as: "leaf" },
    ],
  },
  {
    id: "cheek",
    light: { tone: "#241d19", depth: 0.76, settle: 1.8 },
    pages: [
      { photo: "assets/v2/cheek.jpg", as: "tipped", alt: "He is kissing her cheek, and she is looking straight out" },
      { words: "MEMORY_NOTE_CHEEK", as: "leaf" },
    ],
  },
  {
    id: "sleeping",
    light: { tone: "#2a2521", depth: 0.72, settle: 2.0 },
    pages: [
      { photo: "assets/v2/sleeping.jpg", as: "tipped", alt: "He has fallen asleep against her, and she is letting him" },
      { words: "MEMORY_NOTE_SLEEPING", as: "leaf" },
      // `side` is stated rather than taken in turn. The two whispers alternate
      // corners so that neither reads as a rule, and they used to get their
      // corners from the order they were built in — which meant putting the
      // memories in their true order silently swapped both pages over. They
      // still alternate; they just no longer depend on who comes first.
      { words: "NIGHTSUIT_NOTE", as: "marginal", side: "right" },
    ],
  },
  {
    id: "birthday",
    light: { tone: "#1e1611", depth: 0.78, settle: 1.2 },
    // The night itself, and the one beat written about the night. What she gave
    // him and what she hid for him were found afterwards and are further on.
    pages: [
      { photo: "assets/v2/birthday.jpg", as: "plate", alt: "The room she filled, at ten past midnight" },
      { words: "MEMORY_NOTE_BIRTHDAY", as: "leaf" },
    ],
  },
  {
    id: "greenforest",
    light: { tone: "#241f1b", depth: 0.74, settle: 2.4 },
    // Nothing was photographed and nothing survived, and it is not incomplete —
    // it is his writing in a dark room at night, which is what it was. The only
    // memory set on the thin paper, because it is the one thing in the book that
    // was never explained and it should not feel like the others.
    pages: [
      { words: "GREEN_FOREST_NOTE", as: "leaf", stock: "onion", stop: true, mark: "greenforest" },
    ],
  },
  {
    id: "tickling",
    light: { tone: "#241d19", depth: 0.72, settle: 1.9 },
    pages: [{ words: "TICKLING_NOTE", as: "leaf" }],
  },
  {
    id: "hands",
    light: { tone: "#221e1b", depth: 0.74, settle: 2.2 },
    // One page, no words — MEMORY_NOTE_HANDS is deliberately silent and always
    // was, because the photograph already contains the thought. The only
    // single-page memory in the book; the stillness is the point.
    pages: [
      { photo: "assets/v2/hands.jpg", as: "plate", alt: "Her hand in his, in the back of a car" },
    ],
  },
  {
    id: "ride",
    light: { tone: "#2a1f16", depth: 0.66, settle: 1.4 },
    pages: [
      // Full bleed. They are on a scooter in the middle of a city at dusk, and
      // there is no reason to look at that through a window.
      { photo: "assets/v2/ride.jpg", as: "plate", alt: "The two of them on the scooter that evening" },
      { words: "MEMORY_NOTE_RIDE", as: "leaf" },
    ],
  },
  {
    id: "airhockey",
    light: { tone: "#241d19", depth: 0.70, settle: 1.5 },
    // The puck is a MARK IN THE PAPER, not the object that was cut from this
    // memory. It never rests on the desk, it casts nothing, and it is not
    // claiming to have survived — it is the impression the game left, at the
    // same weight as the other three.
    pages: [{ words: "AIR_HOCKEY_NOTE", as: "leaf", mark: "airhockey" }],
  },
  {
    id: "kusurimas",
    light: { tone: "#241d19", depth: 0.72, settle: 1.9 },
    pages: [{ words: "KUSURIMAS_NOTE", as: "leaf", mark: "shinchan" }],
  },
  {
    id: "gifts",
    // The birthday's light, because this is the birthday's — she gave him these
    // that night and he went on finding what they meant afterwards.
    light: { tone: "#1e1611", depth: 0.78, settle: 1.2 },
    // The bottle is a MARK, not the thing. It was cut from the closing page for
    // being a photograph of a glossy object standing under a different light,
    // and that objection does not apply to an impression: this is not the
    // perfume lying on the paper, it is what the perfume left on the sheet it
    // was written about. The page names it in its first line.
    pages: [{ words: "BIRTHDAY_NOTE_02", as: "leaf", mark: "perfume" }],
  },
  {
    id: "whiterabbit",
    light: { tone: "#1e1611", depth: 0.78, settle: 1.2 },
    // The rabbit was never a thought of the same weight as the rest of that
    // night, which is why it is a whisper in a corner she can walk straight
    // past, and whoever knows what it means will stop. Nothing points at it.
    // It is here rather than back at the birthday because this is when it was
    // actually found — days later, in a room she had already left.
    pages: [{ words: "WHITE_RABBIT_NOTE", as: "marginal", side: "left", mark: "whiterabbit" }],
  },
  {
    id: "leaving",
    light: { tone: "#6f7885", depth: 0.34, settle: 1.1 },
    pages: [
      // She has turned back to look at him. Full bleed — and the light comes up
      // faster here than anywhere else in the book, because the change from
      // their dark room to an airport in the morning IS the moment.
      { photo: "assets/v2/leaving.jpg", as: "plate", alt: "On her way into the terminal, she has turned back to look at him" },
      { words: "MEMORY_NOTE_LEAVING", as: "leaf" },
      { words: "AIRPORT_GOODBYE_NOTE", as: "epigraph" },
    ],
  },
];

// The two ends of the notebook, kept deliberately apart.
//
// He wrote two closings, months apart, for two occasions, and both are true.
// Back to back they made the piece end twice and each blunted the other. So the
// first CLOSES the notebook — the things that were kept, the last words, his
// signature, and the cover comes down. The second is not in the notebook at all:
// it is a letter written today, left lying on top of it.

// One thing was kept, and it is the one thing a notebook can actually keep.
//
// The perfume is gone. It was never really on this page — it was a photograph of
// a glossy bottle standing under a different light, and it had to be presented as
// a PRINT for that reason, which meant the flowers had to be a print too, and the
// page became two pictures of things rather than the things. Pressed flowers are
// the exception in the whole physical language: a notebook genuinely can hold
// one, because holding one flat is what a closed book does. So this is not a
// photograph of the bouquet lying on the page. It is the bouquet, in the page,
// cut out of its background with nothing put back behind it — the paper is the
// background, and there is no second one.
export const CLOSING = {
  light: { tone: "#8d8375", depth: 0.34, settle: 2.6 },
  kept: { src: "artifacts/sunflower.png", cap: 1.3,
          alt: "Two sunflowers from the bouquet she gave him, dried and pressed" },
  words: "ENDING_LETTER",
  signature: "ENDING_SIGNATURE",
};

export const TODAY = { words: "LETTER_02" };

// The notebook itself. Stamped into the board, at both ends of the book — she
// opens it at the title and it closes back onto it.
//
// This is the only line of writing in the piece that is not a manuscript,
// because it is not something he wrote to her: it is what the object is called.
export const NOTEBOOK = { title: "The 55 Hours We Spent" };

// Before the notebook there is an envelope, and inside the envelope a letter.
//
// The letter used to be the second page of the book, bound in after the cover,
// which made it the notebook introducing itself. It is not part of the notebook.
// He wrote it first, put it in an envelope, and left it on top — so the notebook
// is not the first thing she sees, it is the thing she finds underneath.
//
// His name for her is on the envelope, in his hand, the way a name is on an
// envelope. It is the first private thing and it is the only thing she is given
// before she has read a word.
export const OPENING = {
  name: "LETTER_01_HEADING",     // "Bebu", in his hand if he has sent one
  words: "LETTER_01",
};
