#!/usr/bin/env node
/*
 * coverage — every key finding reaches the brief, or is set aside out loud.
 *
 * Exists because test runs filed findings correctly in the topic files
 * and never once put them in the brief. The writer builds an
 * argument and stops looking. factcheck can't see an omission; a judge
 * only sees what it thinks to ask about. An ID can be counted.
 *
 *   node coverage.js <brief.md> <topic-dir-or-file> [more...]
 *
 * Pass only the topic files the meeting touches, or the whole topic dir.
 *
 * Each bullet under "## Key findings" in a topic file carries an ID:
 *   - **[KF-<topic>-<n>]** **[for]** <finding> · `<source>`
 * The brief cites the ID next to the point that uses it, usually as an
 * HTML comment so the reader never sees it:  <!-- KF-<topic>-<n> -->
 *
 * Checks
 *   NOID     a key finding with no ID — it could never be counted
 *   USED     ID appears in the brief's default view
 *   ASIDE    ID appears only inside the "Not this meeting" fold
 *   FOLDED   ID appears only inside some other fold — FAIL: a fold the
 *            reader may never open is not a decision to set it aside
 *   DROPPED  ID appears nowhere in the brief — FAIL
 *   UNKNOWN  the brief cites an ID no topic file has — FAIL
 *
 * Limit: the check proves the writer accounted for the finding, not that
 * the line it sits on actually uses it. The independent reader covers that.
 *
 * Exit 1 if any FAIL.
 */

const fs = require('fs');
const path = require('path');

const [briefPath, ...topicArgs] = process.argv.slice(2);
if (!briefPath || !topicArgs.length) {
  console.error('usage: node coverage.js <brief.md> <topic-dir-or-file> [more...]');
  process.exit(2);
}

const topicFiles = topicArgs.flatMap(p => fs.statSync(p).isDirectory()
  ? fs.readdirSync(p).filter(f => f.endsWith('.md')).map(f => path.join(p, f))
  : [p]);

const ID = /KF-[A-Za-z0-9][A-Za-z0-9-]*?-\d+/g;

// ---- key findings in the topic files ----
const findings = [];   // { id, topic, text }
const noId = [];       // { topic, text }
for (const file of topicFiles) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^##\s+Key findings[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/m);
  if (!m) continue;
  for (const line of m[1].split('\n')) {
    if (!/^[-*]\s/.test(line)) continue;            // top-level bullets only
    const text = line.replace(/^[-*]\s+/, '').replace(/\*\*\[KF-[^\]]*\]\*\*\s*/, '')
      .replace(/\s+/g, ' ').slice(0, 70);
    const ids = line.match(ID);
    if (ids) findings.push({ id: ids[0], topic: path.basename(file), text });
    else noId.push({ topic: path.basename(file), text });
  }
}

// ---- where each ID sits in the brief ----
const brief = fs.readFileSync(briefPath, 'utf8');
const folds = [...brief.matchAll(/<details>([\s\S]*?)<\/details>/g)].map(m => ({
  summary: ((m[1].match(/<summary>([\s\S]*?)<\/summary>/) || [, ''])[1]).trim(),
  body: m[1],
}));
const aside = folds.filter(f => /not this meeting/i.test(f.summary)).map(f => f.body).join('\n');
const other = folds.filter(f => !/not this meeting/i.test(f.summary)).map(f => f.body).join('\n');
const view = brief.replace(/<details>[\s\S]*?<\/details>/g, ' ');

const has = (s, id) => new RegExp(`\\b${id}\\b`).test(s);
const results = findings.map(f => ({
  ...f,
  state: has(view, f.id) ? 'USED'
       : has(aside, f.id) ? 'ASIDE'
       : has(other, f.id) ? 'FOLDED'
       : 'DROPPED',
}));
const known = new Set(findings.map(f => f.id));
const unknown = [...new Set(brief.match(ID) || [])].filter(id => !known.has(id));

// ---- report ----
const FAIL = new Set(['FOLDED', 'DROPPED']);
const mark = (s) => FAIL.has(s) ? '✗' : '✓';
console.log(`coverage — ${path.relative(process.cwd(), briefPath)}\n`);
for (const r of results)
  console.log(`  ${mark(r.state)} ${r.state.padEnd(8)} ${r.id.padEnd(22)} ${r.text}`);
for (const n of noId)
  console.log(`  ✗ NOID     ${n.topic.padEnd(22)} ${n.text}`);
for (const id of unknown)
  console.log(`  ✗ UNKNOWN  ${id.padEnd(22)} cited in the brief, in no topic file`);

const fails = results.filter(r => FAIL.has(r.state)).length + noId.length + unknown.length;
const used = results.filter(r => r.state === 'USED').length;
const set = results.filter(r => r.state === 'ASIDE').length;
console.log(`\n  ${findings.length} findings · ${used} used · ${set} set aside · ${fails} FAIL\n`);
if (!findings.length && !noId.length)
  console.log('  (no Key findings sections found — nothing to check)\n');
process.exit(fails ? 1 : 0);
