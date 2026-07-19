// docx.mjs — reading and writing Word documents, with nothing installed.
//
// This project has no package.json and no dependencies, and the notebook itself
// must keep it that way. A .docx is only a ZIP with some XML in it, and Node
// ships zlib, so the whole format is about two hundred lines and none of it is
// a supply chain.
//
// What is understood, and nothing else is needed:
//
//   <w:p>      a paragraph          → one stanza
//   <w:br/>    a line break         → a newline INSIDE a stanza (Shift+Enter)
//   <w:t>      a run of text
//   <w:i/>     italic               → a mark
//   <w:b/>     bold                 → a mark
//
// Word's own two kinds of break map exactly onto his two kinds of break, which
// is the reason this pipeline can exist at all: pressing Enter gives air between
// stanzas, pressing Shift+Enter gives a tight line inside one. He has been
// writing in those two gestures since the first manuscript.

import { deflateRawSync, inflateRawSync } from "node:zlib";

/* ── zip ──────────────────────────────────────────────────────────────────── */

const CRC = (() => {
  const t = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return (buf) => {
    let c = -1;
    for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
})();

export function unzip(buf) {
  // Walk back from the end-of-central-directory record rather than scanning
  // forward: a local header's fields can be zeroed with a data descriptor, and
  // the central directory is the only place guaranteed to be honest.
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("not a zip: no end-of-central-directory");

  const count = buf.readUInt16LE(eocd + 10);
  let at = buf.readUInt32LE(eocd + 16);
  const files = new Map();

  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(at) !== 0x02014b50) throw new Error("bad central directory");
    const method = buf.readUInt16LE(at + 10);
    const size = buf.readUInt32LE(at + 20);
    const nameLen = buf.readUInt16LE(at + 28);
    const extraLen = buf.readUInt16LE(at + 30);
    const commentLen = buf.readUInt16LE(at + 32);
    const offset = buf.readUInt32LE(at + 42);
    const name = buf.toString("utf8", at + 46, at + 46 + nameLen);

    const lNameLen = buf.readUInt16LE(offset + 26);
    const lExtraLen = buf.readUInt16LE(offset + 28);
    const start = offset + 30 + lNameLen + lExtraLen;
    const raw = buf.subarray(start, start + size);
    files.set(name, method === 8 ? inflateRawSync(raw) : Buffer.from(raw));

    at += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

export function zip(files) {
  const locals = [];
  const central = [];
  let offset = 0;

  for (const [name, content] of files) {
    const body = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    const deflated = deflateRawSync(body, { level: 9 });
    const nameBuf = Buffer.from(name, "utf8");
    const crc = CRC(body);

    const local = Buffer.alloc(30 + nameBuf.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);            // version needed
    local.writeUInt16LE(0x0800, 6);        // utf-8 names
    local.writeUInt16LE(8, 8);             // deflate
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(deflated.length, 18);
    local.writeUInt32LE(body.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    nameBuf.copy(local, 30);
    locals.push(local, deflated);

    const dir = Buffer.alloc(46 + nameBuf.length);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(0x0800, 8);
    dir.writeUInt16LE(8, 10);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(deflated.length, 20);
    dir.writeUInt32LE(body.length, 24);
    dir.writeUInt16LE(nameBuf.length, 28);
    dir.writeUInt32LE(offset, 42);
    nameBuf.copy(dir, 46);
    central.push(dir);

    offset += local.length + deflated.length;
  }

  const dirBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.size, 8);
  end.writeUInt16LE(files.size, 10);
  end.writeUInt32LE(dirBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, dirBuf, end]);
}

/* ── xml ──────────────────────────────────────────────────────────────────── */

const unescapeXml = (s) =>
  s.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
   .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
   .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
   .replace(/&amp;/g, "&");

const escapeXml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;");

/* ── reading ──────────────────────────────────────────────────────────────── */

// A paragraph comes back as { text, marks } — the text as one plain string with
// its newlines in it, and formatting held OUTSIDE the string as character
// offsets. Keeping the words as a plain string is deliberate: it is what makes
// "did this survive the round trip" a single === comparison, and it means every
// piece of measuring and typesetting downstream carries on working untouched.
export function readDocx(buf) {
  const xml = unzip(buf).get("word/document.xml")?.toString("utf8");
  if (!xml) throw new Error("no word/document.xml — is this a .docx?");

  const body = xml.slice(xml.indexOf("<w:body>"), xml.lastIndexOf("</w:body>"));
  const paras = [...body.matchAll(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>|<w:p\b[^>]*\/>/g)];
  const out = [];

  for (const p of paras) {
    const inner = p[1] ?? "";
    let text = "";
    const marks = [];

    // runs and breaks, in document order
    for (const node of inner.matchAll(/<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g)) {
      const run = node[1];
      const props = run.match(/<w:rPr>([\s\S]*?)<\/w:rPr>/)?.[1] ?? "";
      const italic = /<w:i\/>|<w:i\s[^>]*\/>|<w:i>/.test(props);
      const bold = /<w:b\/>|<w:b\s[^>]*\/>|<w:b>/.test(props);

      for (const bit of run.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>|<w:br\b[^>]*\/?>/g)) {
        if (bit[1] === undefined) { text += "\n"; continue; }   // <w:br/>
        const piece = unescapeXml(bit[1]);
        if (!piece) continue;
        if (italic || bold) {
          marks.push({ s: text.length, e: text.length + piece.length, ...(italic && { i: 1 }), ...(bold && { b: 1 }) });
        }
        text += piece;
      }
    }
    out.push({ text, marks });
  }
  return out;
}

/* ── writing ──────────────────────────────────────────────────────────────── */

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;

// Each block becomes one <w:p>; every newline inside it becomes a <w:br/>, so
// opening the file in Word shows exactly the shape he wrote.
export function writeDocx(blocks) {
  const paras = blocks.map(({ text, marks = [] }) => {
    const runs = [];
    let at = 0;
    // split the string at every mark boundary so each run is uniformly styled
    const edges = [...new Set([0, text.length, ...marks.flatMap((m) => [m.s, m.e])])].sort((a, b) => a - b);
    for (let k = 0; k < edges.length - 1; k++) {
      const [s, e] = [edges[k], edges[k + 1]];
      if (s === e) continue;
      const m = marks.find((m) => m.s <= s && m.e >= e);
      const props = m ? `<w:rPr>${m.i ? "<w:i/>" : ""}${m.b ? "<w:b/>" : ""}</w:rPr>` : "";
      // a newline is a <w:br/>, and it lives between text runs
      const parts = text.slice(s, e).split("\n");
      parts.forEach((part, j) => {
        if (j) runs.push(`<w:r>${props}<w:br/></w:r>`);
        if (part) runs.push(`<w:r>${props}<w:t xml:space="preserve">${escapeXml(part)}</w:t></w:r>`);
      });
      at = e;
    }
    return `<w:p>${runs.join("")}</w:p>`;
  });

  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paras.join("")}</w:body></w:document>`;

  return zip(new Map([
    ["[Content_Types].xml", CONTENT_TYPES],
    ["_rels/.rels", RELS],
    ["word/document.xml", doc],
  ]));
}
