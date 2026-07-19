assets/marks/ — the impressions.

Five pages in the notebook have no photograph and never had one, because
nothing was photographed and nothing survived. These are what those pages carry
instead: a mark in the paper, the kind a thing leaves on the page it was kept
beside. They are not illustrations of what he wrote, and they are not
decoration.

  shinchan.png      Kusurimas.    Low and right of the type.
  greenforest.png   Green Forest. A seal, centred, the way a seal is stamped.
  whiterabbit.png   The sweet.    The WRAPPER, not an animal — the thing she hid
                                  in the room for him to find.
  airhockey.png     The puck.     A MARK, not the object that was once cut from
                                  that memory. It never rests on a desk and it
                                  casts nothing: it is not claiming to have
                                  survived, only to have left an impression.
  perfume.png       The bottle.   Standing, so it is the only one set upright and
                                  against an edge. Also a mark, for the same
                                  reason the puck is: the perfume was cut from
                                  the closing page for being a photograph of a
                                  glossy object under a different light, and an
                                  impression is not that.

They are monochrome PNGs with a transparent background, keyed off the paper they
were drawn on and renormalised to full-strength ink — so the opacity in the CSS
is the only thing deciding how faint they end up. Keyed but not renormalised,
already-faint art at 5% opacity disappears completely.

To replace one, drop your own image in at the same path and nothing else has to
change. The page loads whatever is at assets/marks/<name>.png.

Four rules, if you replace one:

  1. It goes UNDER the writing, always. That is handled in CSS and there is no
     case in which one of these is composited on top of a word.

  2. It is nearly invisible. All five sit at 9.5% in css/notebook.css. They were
     set a third of that to begin with and nobody ever found one; then two
     thirds, and the two drawn in the finest line still went unnoticed. 9.5% is
     the point at which each one can be found without any of them arriving
     before the writing. If one becomes the first thing you see on its page, it
     is wrong, and turning it down is the whole of the fix.

  3. It multiplies into the paper, so the fibre and the age of the sheet come
     through it. A mark that ignores the paper is a sticker.

  4. It stays out of the way of the words. Where each one sits on its page is in
     css/notebook.css, and the empty half of the page is where it belongs.

Monochrome art works best. Anything with its own colour will fight the room,
which changes with every memory.
