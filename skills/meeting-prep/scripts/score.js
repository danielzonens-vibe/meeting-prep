#!/usr/bin/env node
/*
 * score — the mechanical half of the quality rubric (shape only).
 *
 * factcheck asks "is it true". This asks "is it the right shape". Shape
 * is reported, not weighted: it is cheap to fix and rarely why a brief
 * fails the bar. It exists so a human reader doesn't spend judgement on it.
 *
 *   node score.js <brief.md> [more...]
 *
 * Checks
 *   LENGTH    default-view words <= 700 (warn to 800, fail past it)
 *   SKELETON  Background / Why / What|Where this stands / How, in order
 *   WHY       3 top-level bullets or fewer
 *   BOX       What opens with the recommendation in a blockquote
 *   AXIS      Background holds a horizontal time axis, not a date list
 *   DAY       prose never says today / tonight / this morning
 *   CALLOUT   each labelled callout opens with a bottom line of 20 words
 *             or fewer; evidence follows as bullets
 *   HOWSTEP   no How step points elsewhere, is a label and a list, or has 2+ sub-points
 *
 * Exit 0 always. Shape never gates.
 */

const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node score.js <brief.md>...');
  process.exit(2);
}

// Default view = what a reader sees without opening anything. Folds,
// fenced diagrams and the trailing source footer don't count as words.
const defaultView = (raw) => raw
  .replace(/<!--[\s\S]*?-->/g, ' ')            // finding IDs (coverage.js)
  .replace(/<details>[\s\S]*?<\/details>/g, ' ')
  .replace(/```[\s\S]*?```/g, ' ');

const words = (s) => (s
  .replace(/^---[\s\S]*$/m, '')          // source footer after the last rule
  .replace(/`[^`]*`/g, ' ')              // filenames
  .replace(/[#>*|_]/g, ' ')
  .match(/[A-Za-z0-9$][\w'’.,$%-]*/g) || []).length;

const sections = (raw) => {
  const out = [];
  const re = /^##\s+(.+)$/gm;
  let m, last = null;
  while ((m = re.exec(raw))) {
    if (last) last.body = raw.slice(last.end, m.index);
    last = { title: m[1].trim(), end: re.lastIndex };
    out.push(last);
  }
  if (last) last.body = raw.slice(last.end);
  return out;
};

const kind = (title) => {
  const t = title.toLowerCase();
  if (t.startsWith('background')) return 'Background';
  if (t.startsWith('why')) return 'Why';
  if (t.startsWith('what') || t.startsWith('where this stands')) return 'What';
  if (t.startsWith('how')) return 'How';
  return null;
};

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const secs = sections(raw);
  const by = Object.fromEntries(secs.map(s => [kind(s.title), s]));
  const results = [];
  const put = (check, state, detail) => results.push({ check, state, detail });

  // ---- LENGTH ----
  const n = words(defaultView(raw));
  put('LENGTH', n <= 700 ? 'pass' : n <= 800 ? 'warn' : 'fail', `${n} words in the default view`);

  // ---- SKELETON ----
  const order = secs.map(s => kind(s.title));
  const want = ['Background', 'Why', 'What', 'How'];
  const extra = secs.filter(s => !kind(s.title)).map(s => s.title);
  const ok = JSON.stringify(order) === JSON.stringify(want);
  put('SKELETON', ok ? 'pass' : 'fail',
      ok ? 'four sections, in order'
         : `found: ${secs.map(s => s.title).join(' / ')}` + (extra.length ? ` — extra: ${extra.join(', ')}` : ''));

  // ---- WHY ----
  if (by.Why) {
    const b = defaultView(by.Why.body).split('\n').filter(l => /^[-*]\s/.test(l)).length;
    put('WHY', b <= 3 ? 'pass' : 'fail', `${b} top-level bullets`);
  } else put('WHY', 'fail', 'no Why section');

  // ---- BOX ----
  if (by.What) {
    const first = by.What.body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)[0] || '';
    // A box is a blockquote or a one-cell table. The spec only ever said
    // "in a box"; one writer drew a table, and failing it enforced a
    // convention nobody wrote down.
    const boxed = /^(>|\|)/.test(first) && /\*\*/.test(first);
    // The main sentence is the bold span. Calibration round 1: the brief
    // the reader found wordy had a 46-word box; the one they preferred, 12.
    const main = (first.replace(/^>\s?/gm, '').match(/\*\*([\s\S]*?)\*\*/) || [, ''])[1];
    const n = words(main);
    if (!boxed) put('BOX', 'fail', 'first block of What is not a boxed recommendation');
    else put('BOX', n <= 20 ? 'pass' : 'fail', `main sentence ${n} words (max 20)`);
  } else put('BOX', 'fail', 'no What section');

  // ---- AXIS ----
  // An axis is a fenced block with a long horizontal rule and several
  // dates sharing one line. A date gutter is dates down the left edge.
  if (by.Background) {
    const fences = by.Background.body.match(/```[\s\S]*?```/g) || [];
    const DATE = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{1,2}\b|\b\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/gi;
    const axis = fences.some(f => {
      const lines = f.split('\n');
      const rule = lines.some(l => /[-─=━#]{20,}/.test(l.replace(/[●*|◆▼V┼O]/g, '-')));
      // "Sep 4 ... 11 ... 17" is a date row too: one month name, then
      // bare days. A real brief drew exactly that and an earlier version missed it.
      // One brief staggered its labels above and below the line, so count
      // dates across the whole diagram. The long horizontal rule is what
      // separates an axis from a vertical date list.
      const named = (f.match(DATE) || []).length;
      const bare = lines.reduce((n, l) =>
        n + (l.replace(DATE, ' ').match(/(?:^|\s)\d{1,2}(?=\s|$)/g) || []).length, 0);
      const row = named >= 1 && named + bare >= 3;
      return rule && row;
    });
    put('AXIS', axis ? 'pass' : 'fail', axis ? 'horizontal axis found' : 'no horizontal axis in Background');
  } else put('AXIS', 'fail', 'no Background section');

  // ---- DAY ----
  // Prep is written the evening before and read the morning of. "Today"
  // on the diagram, marking the writing date, is fine; in prose it is
  // ambiguous every time.
  // Wrapped lines are rejoined first: "this\nmorning" is the same slip.
  const prose = raw.replace(/```[\s\S]*?```/g, ' ').replace(/\s*\n\s*/g, ' ');
  const hits = [...prose.matchAll(/[^.]{0,50}\b(today|tonight|this\s+morning)\b[^.]{0,30}/gi)]
    .map(m => m[0].trim());
  put('DAY', hits.length ? 'fail' : 'pass',
      hits.length ? hits.map(h => `"${h.slice(0, 70)}"`).join(' · ') : 'dates named');

  // ---- CALLOUT ----
  // Bottom line first, evidence as bullets below. Everything before the
  // first bullet is the bottom line, and it must fit in 20 words. A real brief's
  // warnings ran the verdict and its evidence together in one paragraph,
  // and the reader said so.
  const callouts = defaultView(raw).split(/\n\s*\n/).map(b => b.trim())
    .filter(b => /^>\s*\*[A-Za-z]/.test(b));             // labelled, not the bold box
  const long = callouts.map(b => {
    const lines = b.split('\n').map(l => l.replace(/^>\s?/, ''));
    const head = lines.slice(0, (lines.findIndex(l => /^\s*[-*]\s/.test(l)) + 1 || lines.length + 1) - 1).join(' ');
    const label = (head.match(/^\*?([A-Z][A-Z ]+[A-Z])/) || [, ''])[1];
    const line = head.replace(/^\*?[A-Z][A-Z ]+[A-Z]\s*[—-]?\s*/, '');
    // A bottom line that tells the reader to prepare ("Be ready…", "Have a
    // line for…") hands the brief's job back to them. The reader
    // stopped on exactly that; the check catches the opening, the judge the rest.
    const meta = /^\*?\s*(be ready|be prepared|have (a|one|an)|prepare|remember|keep in mind|know)\b/i.test(line);
    return { label: label || head.slice(0, 20), n: words(line), meta };
  }).filter(c => c.n > 20 || c.meta);
  put('CALLOUT', long.length ? 'fail' : 'pass',
      !callouts.length ? 'no callouts'
      : long.length ? long.map(c => c.meta ? `${c.label}: an instruction to prepare, not a move`
                                           : `${c.label}: ${c.n}-word bottom line`).join(' · ')
      : `${callouts.length} callout(s), bottom line first`);

  // ---- HOWSTEP ----
  // Each How step must stand alone as a move. Two patterns are checkable:
  // a step that points elsewhere in the brief ("the box", "above"), and a
  // bold label followed by a dash and a list of topics. A reader
  // stopped on both. Whether a step is a real move stays the judge's (J3).
  if (by.How) {
    const steps = defaultView(by.How.body).split('\n')
      .filter(l => /^\d+\.\s/.test(l)).map(l => l.replace(/^\d+\.\s+/, ''));
    // Sub-points per step: indented bullets between one numbered step and
    // the next. A reader: "too many sub points for how".
    const subs = [];
    for (const l of defaultView(by.How.body).split('\n')) {
      if (/^\d+\.\s/.test(l)) subs.push(0);
      else if (subs.length && /^\s+[-*]\s/.test(l)) subs[subs.length - 1]++;
    }
    const bad = steps.map((s, i) => {
      const why = [];
      if (subs[i] > 1) why.push(`${subs[i]} sub-points (max 1)`);
      if (/\b(the box|above|below|see (the )?(box|fold|timeline|section))\b/i.test(s)) why.push('points elsewhere');
      if (/^\*\*[^*]+\*\*\s*(\([^)]*\)\s*)?[—–]/.test(s)) why.push('label, then a list');
      return why.length ? `step ${i + 1}: ${why.join(', ')}` : null;
    }).filter(Boolean);
    put('HOWSTEP', bad.length ? 'fail' : 'pass',
        bad.length ? bad.join(' · ') : `${steps.length} steps, each stands alone`);
  } else put('HOWSTEP', 'fail', 'no How section');

  // ---- report ----
  const passed = results.filter(r => r.state === 'pass').length;
  console.log(`score — ${path.relative(process.cwd(), file)}\n`);
  for (const r of results) {
    const mark = { pass: '✓', warn: '~', fail: '✗' }[r.state];
    console.log(`  ${mark} ${r.check.padEnd(9)} ${r.detail}`);
  }
  console.log(`\n  shape ${passed}/${results.length}\n`);
}
