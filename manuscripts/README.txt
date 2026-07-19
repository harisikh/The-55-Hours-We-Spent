manuscripts/ — the writing.

Every word in the notebook lives in this folder, one Word document per
manuscript, and nowhere else. The code does not contain a syllable of it.

TO CHANGE ANYTHING HE WROTE

  1. Open the .docx and edit it. Save it.
  2. node tools/import-manuscripts.mjs
  3. Reload the page.

That is all of it. No code changes, ever. The notebook re-typesets itself around
whatever is now in the file: the type resizes, the pages re-break, and a
manuscript that has grown too long for one page becomes two on its own.

HOW WORD MAPS ONTO THE PAGE

  Enter          a new paragraph   → a new stanza, with air before it
  Shift+Enter    a line break      → a new line inside the stanza, tight against
                                     the one above
  italic, bold                     → carried through and rendered
  a blank paragraph                → kept as a blank line

Those first two matter more than anything else here. His writing has always had
exactly two kinds of break, and they are the two Word already has. A blank line
between stanzas is air; a line break inside one is a tight break. Nothing else
in the notebook needs to know which is which — but the difference is visible on
every page, so use the right key.

WHAT IS NOT IN THIS FOLDER

Three slots are deliberately silent — PASS_BACK_01, PASS_BACK_02 and
MEMORY_NOTE_HANDS — and one, COFFEE_NOTE, has never been written. Silence is a
decision and an unwritten slot is not a bug, so neither is a Word document.
Those states live in js/content.js, which is now only a registry: which slots
exist, and which are quiet. Deleting a .docx makes that manuscript disappear
from the notebook; it does not break it.

A NEW MEMORY

Add the .docx here, add its key to the registry in js/content.js, and add a line
to js/memories.js saying where it comes in the running order and how it is set.
Then run the importer.

NAMING

The filename is the slot key. AIR_HOCKEY_NOTE.docx fills AIR_HOCKEY_NOTE.
Renaming a file re-points it; a file whose name matches no slot is ignored and
the importer says so.

DO NOT EDIT js/manuscripts.json — it is generated, and the importer overwrites
it every time it runs.
