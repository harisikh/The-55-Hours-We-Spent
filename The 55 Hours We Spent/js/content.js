// content.js — every word in the piece, and not one of them written here.
//
// This is the whole of what he has to say, listed, specified, and left empty.
// Nothing in this file invents a sentence, a feeling, or a joke. Where a slot is
// `text: null`, the experience renders a visible placeholder that could never be
// mistaken for writing — see js/slots.js. It is meant to look unfinished, because
// it is.
//
// To fill one: put the words in `text`. That is the entire process. Nothing else
// in the codebase needs to know, and nothing about the layout, the timing or the
// interaction is written around any particular sentence — every slot is measured
// by its `max`, so anything within it will fit and behave.
//
//   text: null                    -> still waiting to be written. Renders a loud
//                                    marker so it can never ship unnoticed.
//   text: EMPTY                   -> intentionally silent. This moment has no
//                                    words and is meant to have none. Renders
//                                    absolutely nothing: no marker, no box, no
//                                    space. Silence is a decision, not a gap.
//   text: "..."                   -> his words, exactly as typed
//   text: ["...", "..."]          -> separate paragraphs
//
// null and EMPTY must never be confused. One is unfinished; the other is
// finished and quiet. During development they are told apart on sight — open the
// page with ?dev to see the silent ones marked. Without ?dev a silent slot is
// simply not there, which is what she will see.
//
// `max` is a recommendation in characters, chosen from the space the layout
// actually has at MacBook size. Going over will not break anything; it will just
// get smaller. Going a long way over will start to fight the photograph.

// A moment that is meant to have no words. Not a placeholder — a decision.
export const EMPTY = Symbol("intentionally silent");

export const CONTENT = {
  // ─────────────────────────── the envelope ───────────────────────────
  LETTER_01: {
    where: "The letter inside the envelope. The first thing she reads, before any photograph.",
    form: "26 lines on one sheet. Not paragraphs — the line breaks are the rhythm and are his.",
    max: null, // the manuscript decides. The sheet is built to the words.
    enters: "Nothing enters. The whole letter is on one sheet and she pulls it up out of the envelope; more of it becomes visible as she does. She sets the pace, and she can stop.",
    holds: "Until she takes the boarding pass from behind it.",
    purpose: "Tell her what this is before she sees any of it. The only place in the piece that is allowed to explain itself.",
  },
  LETTER_01_HEADING: {
    where: "The top of that letter, handwritten.",
    form: "one or two words",
    max: 12,
    enters: "Fades up over 1.2s as the sheet finishes opening.",
    holds: "As long as the letter does.",
    purpose: "Her name, in his hand. The first private thing.",
  },
  LETTER_01_PULL: {
    where: "The foot of that letter, handwritten, small.",
    form: "one short line",
    max: 40,
    enters: "Last, after the letter has been readable for a moment.",
    holds: "Until she takes the pass.",
    purpose: "The only instruction in the piece. It should sound like him, not like a button.",
  },

  LETTER_02: {
    where:
      "The final page, after the notebook has closed. It is not a memory — it is the anniversary " +
      "letter waiting on the desk once the last words of the Ending have faded. It rises in the same " +
      "place the ending letter left, in the same dark ink on the same self-lit desk, among what " +
      "remains: the sunflower and the perfume stay exactly where the Ending placed them. The Ending " +
      "is locked and terminal; this does not touch it — it watches from outside for the notebook's " +
      "last words to go, and only then begins.",
    form:
      "A letter. Addressed to Bebu. 16 stanzas, mostly a single line each with air between them, and " +
      "one tight pair — \"Some of them were big. / Most of them weren't.\" — two lines inside one " +
      "stanza, the way LETTER_01 opened. Every line break is his and is intentional. The one " +
      "sentence that must stay exactly as written is \"You're the best person I have ever met.\"",
    // This slot used to say `form: "unknown until the words exist", max: 900`, honest
    // about not knowing where a second letter belonged. The manuscript came and said.
    max: null, // the manuscript decides
    enters: "A quiet beat after the notebook closes, then it fades up. It does not arrive line by line.",
    holds: "It rests. There is no next — no restart, no replay, no epilogue, no listener left alive. This is the final page.",
    purpose:
      "The feeling it leaves is cute and loved. It is the second half of one continuous goodbye: the " +
      "Ending lets the notebook come to rest, and this is the letter waiting after it has closed. " +
      "Nothing here explains the notebook or is made bigger than it was.",
  },

  // ─────────────────────────── the boarding pass ───────────────────────────
  MEMORY_NOTE_ARRIVAL: {
    where: "Top right of the glass, outside the photograph, never on it. 420px.",
    form: "24 lines. His line breaks.",
    max: null,
    enters: "Only once the photograph is fully there. Not before.",
    holds: "Three full seconds of silence after the last line. Nothing fades, nothing moves, just the photograph.",
    purpose: "What he was doing while she was in the air. Waiting is the memory, not the flight.",
  },
  PASS_BACK_01: {
    where: "The blank back of the boarding pass, centred, once she turns it over.",
    form: "one short line",
    max: 24,
    enters: "Fades up 0.35s after the flip lands, over 1.1s.",
    holds: "Stays while the second line arrives.",
    purpose: "The first thing he thought when she actually walked out of that door.",
    // Removed by the manuscript: "After the boarding pass flips, remove every
    // previous caption." Not unwritten — retired. The writing for this moment is
    // MEMORY_NOTE_ARRIVAL now, and it sits outside the photograph.
    text: EMPTY,
  },
  PASS_BACK_02: {
    where: "Beneath it, smaller.",
    form: "one line",
    max: 48,
    enters: "1.6s after the first, over 1.3s. The pause is the point.",
    holds: "Until the paper becomes the photograph.",
    purpose: "What that arrival turned out to mean, said only after a silence.",
    text: EMPTY, // removed by the manuscript, as above
  },

  // ─────────────────────────── the memories ───────────────────────────
  MEMORY_NOTE_LILIES: {
    where: "Bottom left, beside the photograph. 380px, generous margins.",
    form: "17 lines. His line breaks.",
    max: null,
    enters: "As one block. Never line by line.",
    holds: "Then it goes, and the photograph stays. Five seconds. Nothing else happens.",
    purpose: "The flowers were rehearsed. She never saw the rehearsal.",
  },
  MEMORY_NOTE_RIDE: {
    where: "Right of the glass, 380px, outside the photograph. The photograph is smaller here — 62vh — and left of centre, with a great deal of room around it. The side was chosen from this photograph: she is at its left edge looking out, he is at its right, and the eye crosses them and arrives at his words where he is.",
    form: "23 lines, one block. The bare '...' on line 16 is his, and it is where the pause goes.",
    max: null,
    enters: "After the photograph has settled, and all of it at once — never line by line, and the hindsight is not held back. His ellipsis carries the turn: it gets air either side of it (1.5em) rather than a delay. The pause is in the paper, not in the animation.",
    holds: "It stays until she says she is done with it. Nothing is scheduled against her and nothing measures how fast she reads. When she continues, the writing goes and the photograph has four seconds entirely alone before anything else is possible.",
    purpose: "Not the scooter, not the road. Her arms, and what he only understood months later.",
  },
  MEMORY_NOTE_HANDS: {
    where: "Nowhere. There is no writing in this memory.",
    form: "silence",
    max: null,
    enters: "Nothing enters. There is no reflection phase here, because the reflection is the silence.",
    holds: "The photograph is discovered, it remains for five seconds, and she goes on when she likes.",
    purpose:
      "The first memory where the photograph already contains the thought. The airport could never say what he was " +
      "feeling, so Arrival needed words. Flowers cannot explain why they mattered, so Lilies needed words. Hindsight " +
      "lives outside a photograph, so Ride needed words. Her fingers laced through his do not need a sentence " +
      "underneath them saying so — another line here would explain something already understood.",
    // Not waiting. Decided. This is the manuscript for this memory: there isn't
    // one, and that is the finished creative choice, not a slot nobody got to.
    text: EMPTY,
  },
  MEMORY_NOTE_CHEEK: {
    where:
      "Right of the glass, outside the photograph. The photograph sits left of centre. His face is " +
      "hard against the left edge of the frame — there is no desk on that side to write on without " +
      "crowding the kiss itself — and the one still band in the picture is the pillow past her hair, " +
      "on the right. The eye goes along his kiss, through her face, and out to his words.",
    form:
      "12 stanzas. Both kinds of break are his — lines tight inside a stanza (\"that looking at you / " +
      "felt impossible.\") and air between stanzas. He breaks mid-sentence on purpose: \"You were so " +
      "close\" / air / \"that looking at you felt impossible.\", and again at \"It simply felt\" and " +
      "\"maybe my heart already knew\". The hesitation is the writing.",
    max: null, // the manuscript decides
    enters: "Only once the photograph has completely settled. All of it at once, never line by line.",
    holds: "Until she says she is done with it. Nothing is scheduled against her.",
    purpose:
      "The kiss stopped being an event. That is the memory. He did not decide to do it and cannot " +
      "remember thinking about it, and the last thing he says is that his heart had already got " +
      "somewhere his mouth had not.",
  },
  MEMORY_NOTE_SLEEPING: {
    where: "With the sleeping photograph, beside it and never on it.",
    form: "12 stanzas. Both kinds of break are his — lines tight inside a stanza (\"People fall asleep / when they\'re tired.\") and air between stanzas.",
    max: null,
    enters: "After the photograph has settled, all at once, never line by line.",
    holds: "Until she says she is done with it.",
    purpose: "Safety. Two people who have stopped performing. He did not know it at the time.",
  },
  NIGHTSUIT_NOTE: {
    where: "After MEMORY_NOTE_SLEEPING has gone and the photograph has been alone for a moment. Much smaller.",
    form: "2 stanzas, both with his line breaks inside them.",
    max: null,
    enters: "Last, once the room has been quiet.",
    holds: "Until she says she is done. Then the photograph is alone.",
    purpose: "The only line in the piece in the present tense. Everything else in this is him remembering; this is him still looking, and teasing her about it.",
  },
  MEMORY_NOTE_BIRTHDAY: {
    where: "With the birthday photograph. The first of three things he has to say about that night.",
    form: "10 stanzas. TWO kinds of break, and both are his: single line breaks inside a stanza (\"They buy cakes. / They buy gifts. / They take photographs.\") and blank lines between stanzas. Neither is ours to close up or open out.",
    max: null,
    enters: "After the photograph has settled, all at once, never line by line.",
    holds: "Until she says she is done with it.",
    purpose: "What she actually gave him that night, which was not the cake or the balloons.",
  },
  BIRTHDAY_NOTE_02: {
    where: "With the same photograph, after the first has gone. The second of three.",
    form: "11 stanzas. His line breaks, both kinds.",
    max: null,
    enters: "After she has finished with the first and asked to go on. All at once.",
    holds: "Until she says she is done with it.",
    purpose: "The realisation that came later: none of it was the gift. She was.",
  },
  WHITE_RABBIT_NOTE: {
    where: "With the same photograph, alone, after the other two have gone. The last thing said about that night.",
    form: "4 stanzas. The last one is a ladder — seven short lines narrowing to \"to smile.\" — and that shape is the writing. It is not to be re-wrapped, joined, or tidied.",
    max: null,
    enters: "After she has finished with the second and asked to go on. All at once.",
    holds: "Until she says she is done. Then the photograph is alone.",
    purpose: "The inside joke, and it explains itself only to the two of them. Nothing here interprets it.",
  },
  MEMORY_NOTE_LEAVING: {
    where:
      "Left of the glass, outside the photograph. The photograph sits right of centre and his words " +
      "take the left, because that is the side she is looking back towards — her body is walking away " +
      "into the terminal and her face has come back over her shoulder to find him. The right of the " +
      "frame is a crowd of strangers with trolleys; his sentences do not belong against them.",
    form:
      "12 stanzas. Both kinds of break are his — lines tight inside a stanza (\"there was still / a " +
      "little more time.\") and air between stanzas. He breaks mid-sentence on purpose: \"I kept " +
      "pretending\" / air / \"there was still a little more time.\" The hesitation is the writing.",
    max: null, // the manuscript decides
    enters: "Only once the photograph has completely settled. All of it at once, never line by line.",
    holds: "Until she says she is done with it. Nothing is scheduled against her.",
    purpose: "The minutes before goodbye is unavoidable. Reluctance, not sadness.",
  },
  AIRPORT_GOODBYE_NOTE: {
    where:
      "The same column, in the same place, at the same size. It is not a footnote and not a whisper: " +
      "it is the last thing that actually happened between them, and it is the plainest writing in " +
      "the memory. What gives it weight is that it arrives alone into a room that has been silent — " +
      "not that it is bigger, and not that it is smaller.",
    form: "5 stanzas. His line breaks, both kinds.",
    max: null, // the manuscript decides
    enters:
      "After she has finished with MEMORY_NOTE_LEAVING and asked to go on. The writing leaves, the " +
      "photograph has the room to itself for a long moment, and only then this. All at once.",
    holds: "Until she says she is done. Then the photograph is alone.",
    purpose:
      "The last thing said out loud, or the thing that wasn't. \"One more hug.\" is wished for above; " +
      "here she is given one, and it does not help. The wish comes true and it still isn't enough.",
  },

  // ────────────── the ones with no photograph of their own ──────────────
  // These have no image and cannot be hung on one. Each needs its own moment,
  // and the moment is built around the words — so the words decide the shape.
  KUSURIMAS_NOTE: {
    where:
      "In the dark between Cheek and Leaving. Nothing else on the glass, and for once that is the " +
      "literal truth: there is no photograph and no object here. So the words are not a column beside " +
      "something — they are centred, alone, the only thing in the room.",
    form:
      "12 stanzas. Both kinds of break are his — lines tight inside a stanza (\"Shinchan looking up / " +
      "and saying,\") and air between stanzas. \"And then...\" is his line and his ellipsis; it is not " +
      "a bare beat and it is not a pause for the animation to take.",
    max: null, // the manuscript decides
    enters: "Once the desk is dark and empty. All of it at once, never line by line.",
    holds: "Until she says she is done with it. Then it goes, and the next memory begins.",
    purpose:
      "A thing that happened once and was funny for five minutes and is still funny. The manuscript " +
      "remembers the laughing, not the joke — he says outright that he cannot remember the episode. " +
      "Nothing here explains, subtitles or translates the word: it was never meant to make sense to " +
      "anyone else, and the line that matters is \"It was just ours.\"",
  },
  GREEN_FOREST_NOTE: {
    where:
      "In the dark between Sleeping and Cheek — his choice. It happened in their room, and Sleeping " +
      "and Cheek are the two photographs of that room, so it sits between them. There is no " +
      "photograph and no object, so the words are not a column beside something — they are centred, " +
      "alone, the only thing on the glass.",
    form:
      "WORDS. Not WORDS + MOTIF: he ruled out a motif explicitly, and there is nothing to make one " +
      "of. 13 stanzas, and every one of them is a single line — the third manuscript built entirely " +
      "of air, after Balcony and Air Hockey. He said to treat every line break as intentional, and " +
      "every one of them is.",
    // This slot used to say `form: "unknown until the words exist", max: 120`,
    // which was honest about not knowing. The words came and decided it.
    max: null, // the manuscript decides
    enters: "Once the desk is dark and empty. All of it at once, never line by line.",
    holds: "Until she says she is done with it. Then it goes, and Cheek begins.",
    purpose:
      "Her smile is the strongest image and there is no photograph of it — which is the whole of the " +
      "memory, not a shortfall in the archive. She said a thing he did not understand, he smiled as " +
      "though he had, and he still doesn't know what she meant. NOTHING HERE EXPLAINS \"Green " +
      "Forest\": not a gloss, not a subtitle, not a hint dressed up as composition. He said outright " +
      "there is no hidden metaphor to invent and that the mystery is to be preserved exactly as it " +
      "survived. The line that matters is the one he does know — that he never wanted to be anything " +
      "else. Kusurimas keeps its word unexplained for the same reason; this one keeps it unexplained " +
      "even from him.",
  },
  AIR_HOCKEY_NOTE: {
    where:
      "In the dark between Cheek and Kusurimas. There is no photograph and no object here, so the " +
      "words are not a column beside something — they are centred on the glass, and they stay there. " +
      "The puck is left of them with air between. This is the first of the two photograph-less " +
      "memories; Kusurimas follows it.",
    form:
      "WORDS + EPHEMERAL MOTIF. The words: 18 stanzas, and every one of them is a single line. No " +
      "tight breaks anywhere — the second manuscript in the piece built entirely of air, after " +
      "Balcony. \"7–4.\" is a stanza of its own and nothing is done to it: it is not bigger, " +
      "brighter, or held. The line break already is the emphasis.\n\n" +
      "The motif: a matte puck, drawn rather than photographed, carrying a restrained white 7–4 on " +
      "its face. It is NOT an object and must never be made into one — it never rests on the desk, " +
      "never casts a desk shadow, and does not remain. It leads the words by 1.0s and leaves with " +
      "them. The absence of a shadow is the whole statement: a shadow is what makes a thing rest, " +
      "and this one was never kept and is not claiming to have been. The score on the face is not " +
      "decoration and not a second copy of the line — the line is what the scoreboard said, the " +
      "face is the proof it was true.",
    // This slot used to say `form: "one short line", max: 60, holds: "Briefly."`.
    // It was written before the words existed and the words superseded it, the
    // same way MEMORY_NOTE_LEAVING's "one sentence, max 90" received 342
    // characters. The guess is not evidence of anything; the manuscript is.
    max: null, // the manuscript decides
    enters: "Once the desk is dark and empty. All of it at once, never line by line.",
    holds: "Until she says she is done with it. Then it goes, and Kusurimas begins.",
    purpose:
      "She won, and he remembers the number. That is the joke and the tenderness. But the manuscript " +
      "does not remember the games — it says outright it can't — it remembers looking up and finding " +
      "her on the other side of the table, completely determined to beat him, and the laughter being " +
      "louder than the puck. The score is what he kept; her determination is what he saw.",
  },
  BALCONY_NOTE: {
    where:
      "Left of the glass, outside the photograph. The photograph sits right of centre — chosen so the " +
      "two beer bottles end up at the outer edge of the screen rather than in the middle of it, " +
      "because they belong to a different memory and the eye should never travel through them to " +
      "reach his words. He is left of centre in his own frame, looking straight out at her, so the " +
      "words sit on the side he is already facing.",
    form:
      "17 stanzas, and every one of them is a single line — this is the only manuscript in the piece " +
      "with no tight breaks at all. Every line has air on both sides. \"Maggi.\" / \"Takeout.\" / " +
      "\"Whatever we felt like eating.\" are three separate stanzas, not one list, and the four lines " +
      "of the last thought are four stanzas. The slowness is the writing.",
    max: null, // the manuscript decides
    enters: "Only once the photograph has completely settled. All of it at once, never line by line.",
    holds: "Until she says she is done with it. Nothing is scheduled against her.",
    purpose:
      "A balcony that quietly became a dining table, and two people looking after each other on it. " +
      "Not the food and not the drink: the reaching across. The bottles are in the photograph and are " +
      "not what it is about.",
  },
  COFFEE_NOTE: {
    where: "Its own moment.",
    form: "one short line",
    max: 80,
    enters: "TBD.",
    holds: "Briefly.",
    purpose: "Unknown to the builder.",
    text: null,
  },
  TICKLING_NOTE: {
    where:
      "In the dark between Kusurimas and Leaving — his choice. It happened in their room, like Green " +
      "Forest, but it sits at the end of the photograph-less run rather than in the middle: the game, " +
      "the joke, this, and then she walks away. There is no photograph and no object, so the words " +
      "are not a column beside something — they are centred, alone, the only thing on the glass. " +
      "There is nothing on the desk to put away when it begins; it was already empty.",
    form:
      "WORDS. Not WORDS + MOTIF — he ruled a motif out, and there is nothing to make one of. 16 " +
      "stanzas, and every one of them is a single line — the fourth manuscript built entirely of " +
      "air, after Balcony, Air Hockey and Green Forest. He said to treat every line break as " +
      "intentional, and every one of them is. \"A poke.\" and \"A smile.\" are two stanzas, not one " +
      "line — the beat between them is the writing.",
    // This slot used to say `form: "one short line", max: 80, holds: "Briefly."`.
    // It was written before the words existed and the words superseded it, the same
    // way MEMORY_NOTE_LEAVING's "one sentence, max 90" received 342 characters.
    max: null, // the manuscript decides
    enters: "Once the dark is there — and it already is. All of it at once, never line by line.",
    holds: "Until she says she is done with it. Then it goes, and Leaving begins.",
    purpose:
      "The playfulness, kept exactly as it survived. She always started it, he always lost, and he " +
      "laughs uncontrollably when he is tickled — so she would look at him gasping and ask \"Kya " +
      "hua, bebe?\" as if she didn't already know. NOTHING HERE IS MADE BIGGER THAN IT WAS and no " +
      "symbolism is invented: the tenderness is that she knew exactly what was happening and asked " +
      "anyway. Her line is not translated or glossed, the same way Kusurimas leaves its word alone — " +
      "it is theirs, and it is left theirs.",
  },

  // ─────────────────────────── the ending ───────────────────────────
  // This one he has written. It is his, exactly as he typed it, and it is here
  // rather than in the markup so it lives with everything else he owns.
  ENDING_LETTER: {
    where: "The final page, beside the keepsake. Nothing else on the screen.",
    form: "multiple paragraphs",
    max: 1200,
    enters: "Slowly, after the keepsake has been alone for a moment.",
    holds: "Forever. There is no replay, no credits, no restart. It stays until she closes it.",
    purpose: "The last thing she reads. He wrote this one.",
  },
  ENDING_SIGNATURE: {
    where: "Below the ending letter.",
    form: "a name",
    max: 24,
    enters: "Last of all, long after the letter.",
    holds: "Forever.",
    purpose: "Nothing else follows this.",
  },
};

// Everything still waiting on him. Silent slots are not waiting — they are done.
export function unwritten() {
  return Object.entries(CONTENT).filter(([, v]) => v.text === null).map(([k]) => k);
}

// Everything he has decided should say nothing.
export function silent() {
  return Object.entries(CONTENT).filter(([, v]) => v.text === EMPTY).map(([k]) => k);
}
