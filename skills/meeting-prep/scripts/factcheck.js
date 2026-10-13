#!/usr/bin/env node
/*
 * factcheck — mechanical verification for briefs and topic digests.
 *
 * Exists because early test runs produced defects with one pattern: the
 * system is reliable on facts it retrieved and unreliable on everything it
 * writes between them. Every one of those six is checkable without
 * judgement.
 *
 *   node tools/factcheck.js <file-or-dir> [more...] [--sources DIR]
 *
 * Checks
 *   QUOTE     every quoted span of 24+ chars appears verbatim in the
 *             source file cited in the same block
 *   LOCATION  a claim like "paragraph five" points at a paragraph that
 *             exists and actually contains the block's subject
 *   CROSSREF  a pointer from one topic digest to another lands on a topic
 *             that mentions the thing being pointed at
 *   NUMBER    advisory. figures that appear in no source at all
 *
 * Exit 1 if any FAIL. REVIEW findings do not fail the run.
 */

const fs = require('fs');
const path = require('path');

// ---------- normalisation ----------

const norm = (s) => s
  .replace(/[‘’‛]/g, "'")
  .replace(/[“”‟]/g, '"')
  .replace(/[–—]/g, '-')
  .replace(/ /g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const WORDS = { one:1, two:2, three:3, four:4, five:5, six:6, seven:7,
                eight:8, nine:9, ten:10, first:1, second:2, third:3,
                fourth:4, fifth:5, sixth:6 };
const toNum = (t) => /^\d+$/.test(t) ? +t : (WORDS[t.toLowerCase()] ?? null);

// ---------- inputs ----------

const argv = process.argv.slice(2);
let sourcesDir = null;
let dataDir = null;
const targets = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--sources') sourcesDir = argv[++i];
  else if (argv[i] === '--data') dataDir = argv[++i];
  else targets.push(argv[i]);
}
if (!targets.length) {
  console.error('usage: node factcheck.js <file-or-dir>... --sources DIR [--data DIR]');
  process.exit(2);
}
sourcesDir = sourcesDir || path.join(process.cwd(), 'corpus', 'sources');

if (!fs.existsSync(sourcesDir)) {
  console.error(`sources directory not found: ${sourcesDir}`);
  process.exit(2);
}

const sources = new Map();   // basename -> { raw, flat, paras }
for (const f of fs.readdirSync(sourcesDir).filter(f => f.endsWith('.md'))) {
  const raw = fs.readFileSync(path.join(sourcesDir, f), 'utf8');
  sources.set(f, {
    raw,
    flat: norm(raw),
    paras: raw.split(/\n\s*\n/).map(norm).filter(Boolean),
  });
}

// Tabular sources (--data DIR of CSVs). Figures can be checked against
// them, but only as raw values: a derived figure — a monthly total, a
// percentage across rows — will not appear in any cell and stays a REVIEW
// for a person. Quotes are never checked against data files.
const dataText = dataDir && fs.existsSync(dataDir)
  ? fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'))
      .map(f => fs.readFileSync(path.join(dataDir, f), 'utf8')).join('\n')
  : '';

const expand = (t) => {
  const st = fs.statSync(t);
  if (st.isDirectory()) {
    return fs.readdirSync(t).filter(f => f.endsWith('.md'))
             .map(f => path.join(t, f));
  }
  return [t];
};
const files = targets.flatMap(expand);

// ---------- findings ----------

const findings = [];
const add = (sev, check, file, detail, extra) =>
  findings.push({ sev, check, file: path.basename(file), detail, extra });

// ---------- per-file checks ----------

const MIN_QUOTE = 24;
const topicNames = new Set(
  files.map(f => path.basename(f, '.md')).filter(n => n !== 'inbox')
);
const topicText = new Map();
for (const f of files) topicText.set(path.basename(f, '.md'), norm(fs.readFileSync(f, 'utf8')));

let shortSkipped = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  // A file never verifies itself. And the reader's own work (sources named
  // my-*) is a source for what they decided, never for what the record
  // says: a figure or quote found only there is flagged, so nothing
  // launders through the submission it is supposed to check.
  const self = path.basename(file);
  const primary = [...sources.entries()].filter(([n]) => n !== self && !n.startsWith('my-'));
  const own = [...sources.entries()].filter(([n]) => n !== self && n.startsWith('my-'));
  // A brief REPORTS, so every figure must trace to a source. A proposal
  // PROPOSES, so it necessarily contains figures no source has — but each
  // one must then be marked [proposed]. Unlabelled invention in a proposing
  // document is the same defect as a fabricated quote in a reporting one,
  // and the type header is how we tell which rule applies.
  const docType = (raw.slice(0, 600).match(/^Type:\s*(\S+)/m) || [, ''])[1].toLowerCase();
  const proposing = docType === 'proposal';
  const blocks = raw.split(/\n\s*\n/);
  const inFence = (() => { // crude: skip fenced code blocks
    let open = false;
    return blocks.map(b => { const t = (b.match(/```/g) || []).length;
      const was = open; if (t % 2) open = !open; return was || /^```/.test(b.trim()); });
  })();

  blocks.forEach((block, bi) => {
    if (inFence[bi]) return;
    // The unit of analysis is a bullet, not a block. A block holding twenty
    // cross-references pools all their citations, so one valid citation
    // vouches for every dead link beside it. Splitting on bullet starts
    // keeps wrapped continuation lines with their own bullet.
    // Callout bullets ("> - …") are units too, or a callout's citations pool.
    const units = block.split(/\n(?=\s*(?:>\s*)?(?:[-*]|\d+\.)\s)/);
    for (const unit of units) runChecks(unit);

    function runChecks(unit) {
    const flat = norm(unit.replace(/`[^`]*`/g, ' '));    // drop inline code
    const flatAll = norm(unit);                          // keep it, for refs
    const cited = [...new Set(
      (unit.match(/[\w][\w.\-]*\.md/g) || []).filter(n => sources.has(n))
    )];

    // ---- QUOTE ----
    for (const m of flat.matchAll(/"([^"]{4,260})"/g)) {
      const q = norm(m[1]).replace(/^[\s.,;:-]+|[\s.,;:-]+$/g, '');
      if (q.length < MIN_QUOTE) { shortSkipped++; continue; }
      // A span that swallowed markdown structure, a blockquote marker or
      // several sentences is an artefact of unbalanced quote marks in the
      // block, not a quotation. Real quotes in a brief are short.
      if (q.length > 160) continue;
      if (q.includes('> ') || q.includes(' | ') || q.includes(' - ') ||
          q.includes('*') || q.includes('](') || q.split(/[.!?]\s/).length > 2) continue;
      // An ellipsis marks words left out. Honest elision passes when every
      // fragment appears, in order, in one source — the cut is checked, not
      // trusted. An earlier version failed a real, honestly cut quote.
      const frags = q.split(/\s*(?:…|\.\.\.)\s*/).map(x => x.trim()).filter(x => x.length >= 6);
      const inOrder = (s) => { let at = 0; for (const fr of frags) { const i = s.flat.indexOf(fr, at); if (i < 0) return false; at = i + fr.length; } return true; };
      const hits = primary.filter(([, s]) => frags.length > 1 ? inOrder(s) : s.flat.includes(q));
      if (hits.length) {
        if (cited.length && !hits.some(([n]) => cited.includes(n))) {
          add('FAIL', 'QUOTE', file,
              `miscited quote — found in ${hits.map(h => h[0]).join(', ')}, not in ${cited.join('/')}`,
              `"${q}"`);
        }
        continue;
      }
      const mine = own.filter(([, s]) => s.flat.includes(q));
      if (mine.length) {
        add('REVIEW', 'QUOTE', file,
            `only in your own submission (${mine.map(h => h[0]).join(', ')}) — not in any transcript or source`, `"${q}"`);
        continue;
      }
      const ci = primary
        .filter(([, s]) => s.flat.toLowerCase().includes(q.toLowerCase()));
      if (ci.length) {
        add('REVIEW', 'QUOTE', file,
            `case/punctuation differs from ${ci.map(c => c[0]).join(', ')}`, `"${q}"`);
      } else {
        add('FAIL', 'QUOTE', file,
            cited.length ? `FABRICATED — appears in no source; cited ${cited.join('/')}`
                         : 'FABRICATED — appears in no source',
            `"${q}"`);
      }
    }

    // ---- LOCATION ----
    for (const m of flat.matchAll(/(?:paragraph|para\.?|¶)\s*([A-Za-z]+|\d+)/gi)) {
      const n = toNum(m[1]);
      if (!n || !cited.length) continue;
      // the block may cite several files. the claim is only wrong if it
      // fails against every one of them.
      const keys = [...new Set(
        (flat.match(/\b\d[\d,.]*\b/g) || [])
          .concat((flat.match(/\b[a-z]{6,}\b/g) || []).slice(0, 12))
      )];
      // Honest about what is mechanical: a paragraph that cannot exist is a
      // FAIL. A paragraph that exists but may be the wrong one is a REVIEW
      // with the text printed, so a reader settles it in one glance.
      const exists = cited.filter(nm => n <= sources.get(nm).paras.length);
      if (!exists.length) {
        add('FAIL', 'LOCATION', file,
            `"${m[0]}" — no cited file has that many paragraphs ` +
            `(${cited.map(nm => `${nm}: ${sources.get(nm).paras.length}`).join(', ')})`, null);
        continue;
      }
      const matched = exists.filter(nm => {
        const t = sources.get(nm).paras[n - 1].toLowerCase();
        return keys.some(k => t.includes(k.toLowerCase()));
      });
      if (!matched.length) {
        add('FAIL', 'LOCATION', file,
            `"${m[0]}" — that paragraph carries nothing from this claim in any cited file`,
            exists.map(nm => `${nm} ¶${n}: "${sources.get(nm).paras[n - 1].slice(0, 70)}..."`).join(' | '));
      } else if (cited.length > 1) {
        add('REVIEW', 'LOCATION', file,
            `"${m[0]}" — verify which file is meant; matched ${matched.join(', ')}`,
            `${matched[0]} ¶${n}: "${sources.get(matched[0]).paras[n - 1].slice(0, 70)}..."`);
      }
    }

    // ---- CROSSREF ----
    for (const name of topicNames) {
      if (path.basename(file, '.md') === name) continue;
      if (!flatAll.includes(name)) continue;
      const target = topicText.get(name) || '';
      // Source filenames only. Proper nouns and figures are far too
      // generous — a common surname appears in every topic, so any capitalised name
      // satisfies the test and a dead link passes. The sharp question is:
      // does the topic being pointed at actually reference the same source
      // document this block is about?
      if (!cited.length) continue;
      const landed = cited.filter(k => target.includes(k));
      if (!landed.length) {
        add('FAIL', 'CROSSREF', file,
            `points at "${name}" — but ${name}.md references none of ${cited.join(', ')}`,
            flat.slice(0, 130) + (flat.length > 130 ? '...' : ''));
      }
    }

    // ---- NUMBER (advisory) ----
    // "$9.1k" and "44.1k" are figures too; an earlier pattern could not
    // see them, and a check that can't see a figure passes it.
    // Read each figure whole: "28.2%" not "2%", "2,551.5" not "551",
    // "$9.1k" not "9". A partial read made made-up figures pass.
    const NUM = String.raw`\$?\d{1,3}(?:,\d{3})+(?:\.\d+)?k?|\$\d+(?:\.\d+)?k?\b|\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?k\b|\b\d{3,}(?:\.\d+)?\b`;
    const numRe = new RegExp(proposing ? NUM + String.raw`|\b\d{1,2}:\d{2}\b` : NUM, 'g');
    const labelled = /\[proposed\]/i.test(flat);
    for (const m of flat.matchAll(numRe)) {
      const v = m[0];
      if (/^(19|20)\d\d$/.test(v)) continue;            // years
      const bare = v.replace(/[$,%]/g, '');
      const anywhere = primary.map(([, s]) => s).some(s =>
        s.flat.includes(v) || s.flat.replace(/,/g, '').includes(bare)) ||
        // A percentage or a short number matches some cell by chance; only a
        // whole cell of 3+ digits counts as found in the data.
        (dataText && !v.endsWith('%') && bare.replace(/\D/g, '').length >= 3 &&
         new RegExp(`(^|,)${bare.replace(/\./g, '\\.')}(,|\\r?$)`, 'm').test(dataText));
      if (anywhere) continue;
      const mineN = own.filter(([, s]) => s.flat.includes(v) || s.flat.replace(/,/g, '').includes(bare));
      if (mineN.length) {
        add('REVIEW', 'NUMBER', file,
            `only in your own submission (${mineN.map(h => h[0]).join(', ')}) — trace it to the data`, v);
        continue;
      }
      if (proposing) {
        if (!labelled) {
          add('FAIL', 'NUMBER', file,
              'figure is in no source and not marked [proposed] — a proposal ' +
              'may invent figures but must label them', v);
        }
      } else {
        add('REVIEW', 'NUMBER', file, 'figure appears in no source', v);
      }
    }
    } // runChecks
  });
}

// ---------- report ----------

const order = { FAIL: 0, REVIEW: 1 };
findings.sort((a, b) => order[a.sev] - order[b.sev] || a.file.localeCompare(b.file));

const fails = findings.filter(f => f.sev === 'FAIL');
const reviews = findings.filter(f => f.sev === 'REVIEW');

console.log(`factcheck — ${files.length} file(s) against ${sources.size} sources\n`);
for (const f of findings) {
  console.log(`${f.sev === 'FAIL' ? '✗ FAIL  ' : '· review'}  [${f.check}] ${f.file}`);
  console.log(`          ${f.detail}`);
  if (f.extra) console.log(`          ${f.extra}`);
  console.log();
}
console.log(`${fails.length} FAIL, ${reviews.length} review` +
            (shortSkipped ? `  (${shortSkipped} short quotes skipped)` : ''));

if (!findings.length) console.log('\nnothing to report.');
process.exit(fails.length ? 1 : 0);
