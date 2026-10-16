# Brief format spec

The shape every prep brief takes. Every rule here came from a real correction by a real reader.

## The skeleton

Four sections. Nothing else at the top level. Anything that doesn't fit
one of them is either cut or collapsed behind a disclosure.

| Section | Holds | Rule |
|---|---|---|
| **Background** | A time axis, plus 1–2 sentences | Minimal, but enough for someone who missed the last few meetings. Full detail collapsed behind *See full timeline*. |
| **Why** | The problem, and what's at stake | 3 bullets maximum. Each one names a consequence, not a fact. |
| **What** | The proposal and why it's right | The recommendation is **one short sentence in a box** — see *The main sentence* below. |
| **How** | What to do about it | A numbered running order of moves — see *How steps* below. No evidence here. When the meeting expects a deliverable from you (a pre-read, a deck), How says when to send it; the deliverable itself is drafted separately. |

**When there is no proposal**, "What" becomes "Where this stands." Some
meetings are status reviews; forcing a recommendation there manufactures a
position you don't hold.

**When you are the one being questioned** — on your own work, plan or
decision — the reader doesn't need a case built; they need to hold one up
under pressure. The skeleton stays, two sections change:

| Section | Holds |
|---|---|
| **What** | Your position, in the main-sentence box, as you'd state it when asked. Then the strongest objection to it and your one-line answer. |
| **How** | **The argument you make, in order** — 3 to 5 points you put on the table, not questions you wait for. Each point: one sentence you'd say, and the one fact behind it. The objection that point will draw sits under it as a single sub-bullet with your answer. Name your own weakest point before they find it. |

Being questioned is not the same as being passive. The reader runs the
argument; the objections are handled inside it, not listed as a quiz.
A list of questions to respond to makes the reader react; an ordered case
lets them lead.

**What you left out is part of the case, not a fold.** When the people
questioning you will probe your omissions, the cuts belong in How: one
point that names what you left out, each cut with the line you'd say.
*Not this meeting* is only for things that genuinely belong to another
conversation.

No speculation about how the meeting might change course.

## Pressure-test the recommendation

A position that follows from the sources can still be wrong. Before
writing What, test it — and put the result in the brief:

- **The strongest objection.** Argue against your own recommendation using
  only the sources. If you can't answer the best case against it in one
  line, the recommendation isn't ready.
- **The runner-up.** Name the best alternative and the one reason it
  loses. A recommendation with no rival hasn't been compared.
- **The inconvenient evidence.** List what in the record cuts against the
  position. Each item is either answered or it changes the position.
- **What would flip it.** The one fact that, if it turned out different,
  would change the recommendation. Say it, and who would know.

These go in What, as bullets under the box — short. The reader should
walk in knowing where their position is weakest.

## The main sentence

The bold sentence in the What box is the line the reader says out loud.
It has to survive being said in one breath.

- **It starts with the decision, as an instruction.** The first word is
  a verb you could say across the table: retire, adopt, approve, hold,
  drop. A noun with a condition hanging off it is a topic, not a
  decision.
- **20 words or fewer.** A backstop, not the test: a short sentence
  with no verb still fails.
- It holds **the decision**, plus at most **the one condition that would
  change it**. A condition that is part of the proposal itself belongs
  here.
- Everything else — checks to run, things left open, fallbacks — goes in
  the bullets under the box, each with a name and a time attached.
- One line of *why* may follow the bold sentence inside the box.

Good: **"Drop the annual plan. Launch monthly — with the discount capped
at one quarter."**

Bad, too long: a 45-word sentence carrying a start date, a sign-off to
obtain and an open allocation at once. Every condition in it was right;
the sentence was unusable.

Bad, no decision: **"Monthly plan — provided finance confirms the margin
holds."** Short, and the reader still has to work out what to say.

## The timeline must be a time axis

Not a list with a date gutter. Dates are positioned **along an axis**, so
the gaps between events are visible as distance.

- 4–5 beats only in the default view. The arc should read without words:
  decided → contradicted → constrained → you're here.
- Mark "today" and shade what's ahead of it.
- The meeting this brief is for is the terminal marker, shaped differently
  from the rest.
- Everything else collapses behind *See full timeline*.

In HTML that's an SVG. In markdown, a horizontal ASCII axis — never a
vertical list of dates.

## Typography of voice

| Marker | Means | Use for |
|---|---|---|
| Labelled callout (`> *italic*` in markdown) | **The brief speaking to you** | "Open with this", "Careful", coaching |
| `"double quotes"` | **Verbatim from a source** | Anything a person actually said |
| Plain text | **Fact from a source** | Everything else |

Never use italics for source quotes — the cue only works if it's
exclusive. On a page, give each callout a typed label (`CAREFUL`,
`OPEN WITH THIS`) rather than relying on the styling alone.

## Callouts

A callout is the bottom line first, then the evidence for it — never
both in one sentence.

```
> *CAREFUL — <the bottom line: what to do or watch. One sentence, 20 words or fewer.>*
> - <evidence, one fact per bullet, quotes verbatim>
> - <evidence>
```

A reader who reads only the first line of every callout should still
walk in knowing what to do.

- **The bottom line is something you say or do in the room** — not an
  instruction about preparing. "Be ready to defend each cut" fails: it
  tells the reader to do the brief's job. *"If they ask why the small
  accounts are out: they need a person, not a tool"* passes.
- **Every bullet under it serves that line.** Evidence that doesn't
  support the bottom line is a different callout, or nothing.
- **Fewer, sharper.** Three callouts that each change a move beat five
  that each add a fact.

## How steps

Each numbered step is a move the reader makes. Read on its own, it must
tell them what to do.

- **Opens with a verb:** ask, tell, propose, hold, close. A step that
  starts with a noun ("Close — pricing, launch date, headcount") is a list of
  topics, not a move.
- **One ask per step.** Three things joined by commas is three steps, or
  a sign two of them belong in another meeting.
- **Self-contained.** Never point elsewhere in the brief ("the box",
  "above", "the CFO's test"). Say the thing.
- **No evidence in How.** The reasons live in Why, What and the
  callouts. How is only what to do, in order. *Exception, when you are
  being questioned:* each point carries its one fact, because the point
  is an argument.
- **At most one sub-bullet per step.** A step that needs three
  sub-points is three steps, or a paragraph pretending to be a list.

Good: **"Ask the CFO, before 10:00, whether the discount is ten per cent
or fifteen."** Bad: **"Open, then propose — the test, then the box."**

## Length

- **Under 700 words** in the default view. Hard ceiling 800.
- Disclosures don't count — but nothing load-bearing hides inside one.
- When it's over, look for **the same point made twice** before editing
  prose. That's where the weight always is.

## Writing rules

- Bullets and sub-bullets, not paragraphs. A sub-bullet is the reason or
  consequence of its parent.
- Concise means fewer words, not fewer judgements. Every section still
  lands somewhere.
- One idea per bullet. If it needs a comma-and, split it.
- No preamble. The first line of a section is the finding.
- **A promise the record doesn't show gets both halves.** Who promised
  what, to whom — and that the minutes or action items don't carry it,
  plus what they record instead. Either half alone leaves the reader
  exposed.
- **Say what you can't close.** Never invent a number that isn't in a
  source — name the gap and who can fill it.

## Accuracy rules — non-negotiable

These exist because runs 01 and 02 broke all four. A brief that fails one
of these is worse than no brief: it walks you into a room with false
confidence.

- **Quotation marks mean verbatim.** If the words in quotes are not
  character-for-character what the source says, don't use quotes —
  paraphrase in plain text. An early version wrote a line for a colleague, put it
  in quotation marks and attributed it to a real file. They never said
  it. The sense was right and the words were fabricated.
- **Cite only what you checked.** A location — "paragraph three", "the
  fourth memo" — is a factual claim like any other. An early version numbered
  a paragraph it had never counted, and got it wrong. If you didn't
  count, don't number.
- **Don't bound what the source leaves open.** An open-ended outage does
  not become "about three weeks." If the source gives no end, say there
  is no end date.
- **Don't argue past your own evidence.** If the brief says a figure
  exists in no source, it cannot then rank options on that figure. Write
  it as *a presumption to test*, not a statement.
- **Never say "today" or "this morning" for the meeting day.** Prep is
  written the evening before and read the morning of. Name the date every
  time.
- **A quote proves what was said, not what happened.** A claim made in a
  call or a note is a claim. When the record holds data that could
  confirm or contradict it, check before you use it — and say which it
  is:
  - confirmed → use it, and say the data backs it;
  - contradicted → never as evidence; write *"X said Y; the data shows
    Z"*, because the gap is usually the finding;
  - can't be checked → only as what that person said, never as proof.
  A verbatim quote passes the fact-checker even when what it describes
  never happened. This rule is the check the fact-checker can't do.

## What belongs in the brief vs the topic file

The topic file is memory. The brief is the product. A fact filed
correctly and left out of the brief is a fact the reader doesn't have.

Both runs lost the same one this way: a spoken promise was filed, but
the brief never said the official action item handed that work to
someone else. The reader learns a commitment is missing without
learning the paper trail points at the wrong person.

Every *Key finding* in the topic files is accounted for: used in the
default view, or set aside in one line in *Not this meeting*. None
disappears between the file and the brief. Cite its ID as an HTML
comment at the end of the line that uses it or sets it aside —
`<!-- KF-<file-name>-<n> -->` — so the reader never sees it and
`coverage.js` can count it. A finding cited only inside some other
fold counts as dropped. Cite an ID only on a line that actually carries
the finding; the independent reader checks the line, not the tag.

If a fact changes what you should do in the room, it goes in the brief —
not in a collapsed fold, and not only in the digest. **That includes facts
filed under a different topic.** Filing decides where a fact is kept, not
which rooms it matters in. If someone in the room holds a private
promise from another topic, the brief says so.

**The test is this room, not relevance.** Another topic's fact gets into
the default view only if it changes what the reader says or does in
*this* meeting. Anything else from another topic — however urgent — gets
one line in a *Not this meeting* fold, with who to raise it with and
when. An urgent side issue in the default view pulls the reader's
attention off the one decision the meeting exists for.

**Before anything goes to *Not this meeting*, check it against your own
plan.** If a step in How, or the recommendation in What, depends on that
fact — needs it to be true, or needs it before a date — it is not a side
issue. It stays in the default view, next to the step it constrains. A
fact can be off-topic for the meeting and still decide whether your plan
works. Use the topic files' *Depends on* sections to find these.
