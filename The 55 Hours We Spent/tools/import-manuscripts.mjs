// import-manuscripts.mjs — Word in, notebook out.
//
// Reads every .docx in manuscripts/ and writes js/manuscripts.json. That file is
// the only place the notebook's words exist in the repository, and it is
// generated — never edited. Replace a .docx, run this, reload: the notebook has
// the new writing and not one line of code has changed.
//
//     node tools/import-manuscripts.mjs
//
// ── HOW WORD MAPS ONTO THE PAGE ──
//
//     Enter           a new paragraph  → a new stanza, with air before it
//     Shift+Enter     a line break     → a new line INSIDE the stanza, tight
//     italic / bold                    → carried through and rendered
//     a blank paragraph                → kept, as a blank line
//
// Those first two are the whole reason this works. His writing has always had
// exactly two kinds of break and Word has always had exactly two kinds of break,
// and they are the same two.
//
// ── WHY THE TEXT IS A PLAIN STRING ──
//
// A block is stored as `text` — one plain string, newlines and all — with any
// italics or bolds held beside it as character offsets in `marks`. Nothing is
// wrapped in tags inside the words. That keeps "did this survive the round trip"
// a single === comparison against the original, and it means every measurement
// and every typographic rule downstream keeps working on a plain string, exactly
// as it did when the words lived in a JS file.

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readDocx } from "./docx.mjs";

// fileURLToPath, not .pathname. A file: URL percent-encodes its path, so a
// checkout in a directory whose name contains a space — "The 55 Hours We
// Spent", say — gave ROOT with %20 in it, and every read and write below went
// looking for a directory that does not exist. The importer's own "no
// manuscripts/ directory" error was the symptom.
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIR = `${ROOT}manuscripts`;

if (!existsSync(DIR)) {
  console.error("no manuscripts/ directory — nothing to import");
  process.exit(1);
}

const files = readdirSync(DIR).filter((f) => f.endsWith(".docx") && !f.startsWith("~$")).sort();
if (!files.length) {
  console.error("manuscripts/ has no .docx files — refusing to write an empty notebook");
  process.exit(1);
}

const out = {};
const report = [];

for (const file of files) {
  const key = file.replace(/\.docx$/, "");
  const paras = readDocx(readFileSync(`${DIR}/${file}`));

  // Word leaves a trailing empty paragraph in almost every document; that is the
  // editor's artefact, not his writing. Blank paragraphs BETWEEN stanzas are
  // his, and are kept.
  while (paras.length && !paras[paras.length - 1].text.trim()) paras.pop();
  while (paras.length && !paras[0].text.trim()) paras.shift();

  const blocks = paras.map((p) => p.text);
  const marks = {};
  paras.forEach((p, i) => { if (p.marks.length) marks[i] = p.marks; });

  out[key] = Object.keys(marks).length ? { blocks, marks } : { blocks };
  const formatted = Object.keys(marks).length;
  report.push(`  ${key.padEnd(24)} ${String(blocks.length).padStart(3)} stanzas${formatted ? `, ${formatted} formatted` : ""}`);
}

// A slot the registry knows about but Word has nothing for is not an error — it
// is either deliberately silent or not yet written, and the registry says which.
const { CONTENT, EMPTY } = await import(`${ROOT}js/content.js`);
const missing = Object.entries(CONTENT)
  .filter(([k, s]) => s.text !== EMPTY && s.text !== null && !out[k])
  .map(([k]) => k);
const orphans = Object.keys(out).filter((k) => !CONTENT[k]);

writeFileSync(`${ROOT}js/manuscripts.json`, JSON.stringify(out, null, 1) + "\n");

console.log(report.join("\n"));
console.log(`\n${files.length} manuscripts → js/manuscripts.json`);
if (orphans.length) console.log(`note: not in the registry, so not shown anywhere: ${orphans.join(", ")}`);
if (missing.length) console.log(`WARNING: the registry expects these and Word has none: ${missing.join(", ")}`);
