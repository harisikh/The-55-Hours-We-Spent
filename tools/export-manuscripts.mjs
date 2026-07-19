// export-manuscripts.mjs — run ONCE, to get the writing out of the code.
//
// Takes every manuscript currently living in js/content.js and writes it out as
// a Word document, one per slot, into manuscripts/. After this the .docx files
// are the source of truth and js/content.js keeps only the registry: which slots
// exist, what form each takes, and which are deliberately silent or not yet
// written. No prose remains in the code.
//
// This is not part of the build. It ran once. It is kept because it documents
// how the writing left the repository, and because if the manuscripts ever have
// to be regenerated from a JSON snapshot it is the file that knows how.
//
//     node tools/export-manuscripts.mjs

import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { writeDocx } from "./docx.mjs";

// fileURLToPath, not .pathname — see the note in import-manuscripts.mjs. A path
// with a space in it percent-encodes and every read and write misses.
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const { CONTENT, EMPTY } = await import(`${ROOT}js/content.js`);

mkdirSync(`${ROOT}manuscripts`, { recursive: true });

let written = 0, silent = 0, unwritten = 0;
for (const [key, slot] of Object.entries(CONTENT)) {
  if (slot.text == null) { unwritten++; continue; }
  if (slot.text === EMPTY) { silent++; continue; }
  const blocks = (Array.isArray(slot.text) ? slot.text : [slot.text]).map((text) => ({ text }));
  writeFileSync(`${ROOT}manuscripts/${key}.docx`, writeDocx(blocks));
  written++;
}
console.log(`${written} manuscripts written to manuscripts/`);
console.log(`${silent} deliberately silent and ${unwritten} unwritten — those stay in the registry, not in Word`);

// ── take the prose out of js/content.js ───────────────────────────────────
// Only the `text:` values go. Every comment in that file is someone's reasoning
// about a slot and is worth more than the few lines it costs to keep.
const path = `${ROOT}js/content.js`;
const lines = readFileSync(path, "utf8").split("\n");
const kept = [];
let skipping = false;
for (const line of lines) {
  if (skipping) { if (/^\s*\],\s*$/.test(line)) skipping = false; continue; }
  if (/^\s*text:\s*\[\s*$/.test(line)) { skipping = true; continue; }          // text: [ … ],
  if (/^\s*text:\s*["'`]/.test(line)) continue;                                 // text: "…",
  kept.push(line);
}
writeFileSync(path, kept.join("\n"));
console.log("js/content.js is now a registry: no manuscript text remains in it");
