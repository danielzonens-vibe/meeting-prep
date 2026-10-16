# Topic template

The shape every topic file takes. A **digest**, not a log (Frame rule 3).
Hard cap: if a section grows past its limit, compress it — don't append.

---

# <Topic name>

**Owner:** <you, or someone else>
**Status:** active | parked | closed
**Last updated:** <date> from <source file>

## Where this stands
Two or three sentences. What is true right now. Someone who has never seen
this topic should be able to walk into a meeting on it after reading this.

## So what — one line per entry, where it matters

Any entry below may carry one sub-bullet saying what follows from it —
the consequence nobody wrote down. Label it as your reading, because no
source states it:

- **<entry>** — <date>, <who>, `<source>`
  - *Reading, not stated by any source:* <what follows> · <how to check it>

A fact filed without its consequence is half filed. The typical miss: a
clause is recorded accurately, and nobody notes that it undoes the
reason someone is relying on it.

## Decisions on record
Each one: what was decided, when, by whom, and where it's recorded.
A decision that's been reversed stays here, marked reversed — the history
of a reversal is usually the point.
_Cap: 10. Fold older ones into "Where this stands"._

- **<decision>** — <date>, <who>, `<source file>`
- ~~**<reversed decision>**~~ — <date>, <who>, `<source>` · **reversed** <date> by `<source>`

## Open questions
Questions actually asked and not answered. Include who asked and when —
a question that's been open three weeks is a different problem than one
asked yesterday.
_Cap: 8._

- <question> — asked by <who>, <date>, `<source>` · **unanswered <N> days**

## Commitments outstanding
Who owes what to whom, by when. Includes commitments made *to* customers.
A commitment stated in conversation but absent from the action items is
still a commitment — flag it as unrecorded.
_Cap: 12._

- <who> → <what> → <to whom>, due <when> · `<source>` · [unrecorded]

## Hard constraints
Numbers, dates and limits that bound any decision on this topic, with the
source. These are the things that get buried in paragraph 3 of an email
and then blow up a meeting.

- <constraint> — <who set it>, <date>, `<source>`

## Claims to check
What people said happened, or will happen, that the record's data could
confirm or contradict. Each one gets a status — never left blank.
_Cap: 10. Keep the ones the position could lean on._

- <who> said <claim> · `<source>` · **checked ✓** <the data that backs it>
- <who> said <claim> · `<source>` · **contradicted ✗** <what the data shows instead>
- <who> said <claim> · `<source>` · **can't be checked** <what's missing>

## Key findings
The facts in this topic that most strengthen or weaken the position the
reader is likely to take — including inferences, labelled as such. Each
one tagged **for** or **against**. These are the facts a brief must
either use or set aside out loud.
_Cap: 5. Pick by how much the position would change if the fact were
missing, not by how interesting it is._

**Breadth.** When the position rests on one case — one customer, one
team, one example — at least two key findings must come from *other*
cases: the strongest evidence that it generalizes, and the strongest
that it doesn't. Picking only evidence near the reader's own example is
the easiest bias to miss, because every fact picked is true.

**IDs.** Every finding opens with an ID: `KF-`, this file's name without
`.md`, and a number. Numbers are never reused within a file — a finding
that drops off the list takes its number with it. The brief cites the ID
where it uses the finding, so `coverage.js` can count what reached it.

- **[KF-<file-name>-1]** **[for]** <finding> · `<source>` or *Reading, not stated by any source*
- **[KF-<file-name>-2]** **[against]** <finding> · `<source>`

## Depends on
Every open plan or likely decision on this topic, and what it relies on —
including facts filed under other topics. Each dependency gets the date it
runs out. This is where a plan quietly breaks: it needs something that
stops being available before the plan gets there.
_Cap: 8._

- <plan or likely decision> **needs** <thing> — available until <date> ·
  `<source>` · also in `topics/<other>.md` if it lives there
  - *Reading, not stated by any source:* <what breaks, and when>

Check each plan's dates against each dependency's date. If the plan lands
after the dependency runs out, say so here — that is the most useful line
in the file.

## Artifacts produced
- <date> — <what> — `<path>`

## Not this topic
Adjacent things that keep getting pulled in and shouldn't be (Frame rule 2).

- <adjacent topic> — owned by <who> — see `topics/<other>.md`

## Sources filed
- `<source file>` — <date> — <one line on what it contributed>
