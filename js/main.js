// main.js — hand her the notebook.
//
// There is nothing to wire. The order lives in js/memories.js, which reads like
// a table of contents; the book knows how to be a book. This file exists only so
// that something has to say "begin".

import { makeBook, useManuscripts } from "./book.js";

// His writing lives in manuscripts/*.docx and is compiled to this file by
// tools/import-manuscripts.mjs. Nothing in the code contains a word of it, and
// replacing a Word document and re-running the importer is the whole of editing.
const words = await fetch(new URL("./manuscripts.json", import.meta.url)).then((r) => r.json());
useManuscripts(words);

makeBook(document.getElementById("notebook"));
