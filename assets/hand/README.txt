assets/hand/ — his handwriting.

These are his, written on one sheet along with two lines that are not used here.
They are the only two marks in the piece made by a hand rather than set in type,
and they are the first and the last thing she is given: her name on the envelope
before she has read a word, and his initial after the last one.

  name.png   "Bebu", on the envelope.              227 x 174
  sign.png   "-H", under the close of the letter.  122 x 107

HOW THEY WERE CUT, so that a replacement matches:

  The paper was keyed out per-region rather than against one white point — the
  sheet is not evenly lit, and a single threshold took one corner and missed
  another. Ink density is how far a pixel falls below the paper AT THAT SPOT.

  Nothing is thresholded, thinned, thickened, smoothed or vectorised. The mask
  decides only where paper stops, never how dark ink is: strokes found above the
  noise ceiling are kept at their own density out to their soft edges, so the
  dry patches, the tapered ends and the wobble in the B are all still there.

  Paper noise reaches 0.12 of full ink and the pen runs to 0.94, so everything
  under the noise ceiling is faded out rather than cut. Cutting it hard left the
  mask boundary showing as a faint rectangle around the signature.

  Colour is unpremultiplied against the local paper, so the soft edge of a
  stroke is thin ink rather than ink mixed with white.

RESOLUTION, honestly: they were written small on a large sheet, so "Bebu" is
only 227px wide natively and is drawn at about 2.4x that on a 3x phone; "-H" is
122px and is drawn at about 3.3x. They read as pen, but they are visibly softer
than the type around them. Re-shooting closer — filling the frame with one word
— is the only thing that would fix it, and it is worth doing if it is ever easy.

The book picks them up automatically — the envelope and the signature swap from
type to ink with no other change, and fall back to a written face if these are
missing. The ink is composited into the paper (multiply), so it sits in the page
rather than on top of it.
