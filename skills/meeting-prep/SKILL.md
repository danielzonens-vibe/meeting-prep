---
name: meeting-prep
description: Prepare for an upcoming meeting. Finds the meeting, gathers what's relevant from the person's own sources (calendar, email, chat, meeting notes, files), keeps a running digest per topic, writes a one-page prep brief with a clear position and the moves to make, drafts any messages to send beforehand, and checks every quote and figure before handing it over. Use when asked to prep for a meeting, brief me for my next meeting, get me ready for a call, or work out what I need before a meeting.
when_to_use: When the person says things like prep me for my 2pm, brief me for tomorrow's review, what do I need for this meeting, or get me ready for the call with someone.
allowed-tools: Bash(node ${CLAUDE_SKILL_DIR}/scripts/*)
---

# Meeting prep

You maintain **topics** and prepare the person for what's next. You are
not a notetaker — a notetaker's output is an *input* here.

## Read these first. They are the contract, not background.

- `${CLAUDE_SKILL_DIR}/references/FRAME.md` — the five rules: never
  auto-create a topic, never auto-merge two, digests not logs, draft-only,
  every correction remembered.
- `${CLAUDE_SKILL_DIR}/references/TOPIC-TEMPLATE.md` — the shape a topic
  file takes.
- `${CLAUDE_SKILL_DIR}/references/BRIEF-FORMAT.md` — the shape the brief
  takes. Follow it exactly.
- `${CLAUDE_SKILL_DIR}/references/DRAFT-FORMAT.md` — the shape of a
  message to send before the meeting.

Follow their rules. Don't restate them in your output.

---

## Step 0 — Set up (ask before doing anything else)

**Ask the person where their material lives.** Use a multiple-choice
question if your environment offers one. The options:

1. **My connected tools** — calendar, email, chat, meeting transcripts,
   docs: whatever connectors are available in this session. List the ones
   you can actually see; say plainly if a needed one (usually the
   calendar) is missing.
2. **A folder** — notes, transcripts or exports on disk. Ask for the path.
3. **I'll paste it** — they paste material into the chat.

Confirm two things in the same breath, so nothing is guessed later:
- **Who the reader is** — the person you're talking to, by name and role.
- **When this is being written** — normally now, for a meeting ahead. If
  the material is older than today (a test, or old notes), ask which day
  to write as: it sets every "open N days", every deadline and the
  today-marker on the time axis.

Then settle the **working folder** — where topic files, saved excerpts and
briefs live, on the person's own machine. Default: `meeting-prep/` in the
current directory. Say where it is and that they can delete it any time.
If it already exists, read `meeting-prep/lessons.md` and the topic files
before anything else: that is the memory from earlier runs.

```
meeting-prep/
  topics/        one file per topic, plus inbox.md
  sources/       excerpts the brief relies on, saved verbatim
  briefs/        one brief per meeting
  drafts/        messages to send, never sent
  lessons.md     corrections the person made, and why
```

**Topics are the person's.** If no topic files exist, ask them to name 2–4
topics this meeting touches (suggest candidates from what you can see, but
let them choose and name). Never create a topic they didn't name.

## Step 1 — Find the meeting

From the calendar, or ask: the meeting, its time, attendees, and the stated
goal. Note anything earlier the same day whose outcome you can't know yet —
that is a condition on the brief, not a fact. One brief covers one meeting.

**Decide what kind of meeting it is** — it sets the brief's shape:
- **Proposing** — the person brings a recommendation.
- **Status** — no proposal; "Where this stands".
- **Being questioned** — the person defends their own work, plan or
  decision. How becomes the argument they make, in order.

## Step 2 — Gather and file

Read only what bears on the meeting: threads with the attendees, the
topics' recent history, documents named in the invite. Read-only — never
send, reply, accept or change anything in their tools.

**Save what you use.** Every excerpt the brief or a topic file relies on
goes into `meeting-prep/sources/` as its own markdown file, copied
verbatim, with a header:

```
Source: <tool and item — e.g. "Email from J. Ortiz, 'Q3 pricing'">
Type: <email | chat thread | meeting transcript | doc | calendar | note>
Date: <yyyy-mm-dd>

<the excerpt, verbatim>
```

- **An excerpt** is the passage you rely on plus enough around it to read
  it in context. A short file can be saved whole.
- **If the material already has a header** (a file from a folder often
  does), keep it — don't add a second one.
- **Type** is a short description; the list above is examples, not a
  closed set. **Date** is `undated` when the material has none.

This is what lets the fact-checker verify every quote. Save the person's
*own* work they will be asked about (a deck, a proposal) with a file name
starting `my-` — it is evidence of what they decided, never of what
happened. Tabular data (exports, CSVs) goes in `meeting-prep/sources/data/`.

Then file into the topics, following the template:
- Match each item to a topic the person named. No match → `inbox.md`.
- Matches two → file in one, link from the other.
- Record who said a thing, when, and where it was recorded. The gap
  between what was said and what the record shows is usually the finding.
- Fill *Claims to check*, *Key findings* and *Depends on*.

## Step 3 — Write the brief

Follow `BRIEF-FORMAT.md`. Before you write What:

- **Account for every key finding** — each one used in the brief, or set
  aside in one line. Check the list's breadth: if every finding sits close
  to one example, go back for the strongest evidence from the others.
- **Check every claim the argument leans on.** Something someone *said*
  happened is a claim until the data confirms it. Confirmed → can carry
  weight. Contradicted → a finding, never a support. Can't be checked →
  only what that person said.
- **Pressure-test the position**: the strongest objection, the runner-up,
  the evidence against, the one fact that would flip it. If it doesn't
  survive, change it. When the position is the person's own work, check
  their claims against the record before anyone else does.
- **Read every Depends on** in the topics: anything a step needs that runs
  out before the step lands goes next to that step.

Write it to `meeting-prep/briefs/<yyyy-mm-dd>-<short-name>.md`.

## Step 4 — Draft what must go out before the meeting

Follow `DRAFT-FORMAT.md`. Only for asks that happen before the meeting;
one draft per subject; written for everyone who could see it. **If the
meeting expects something from the person** — a pre-read, a deck, a
written proposal — draft that as well, in `meeting-prep/drafts/`, built on
the brief's position. It is often the thing they most need. Anything too
delicate, or that depends on the outcome, gets a line in
`meeting-prep/drafts/queue-note.md` instead. **Nothing is sent.**

## Step 5 — Verify. Two gates.

Run, from the directory that holds `meeting-prep/`:

```bash
node ${CLAUDE_SKILL_DIR}/scripts/factcheck.js meeting-prep/briefs/<the brief> meeting-prep/drafts meeting-prep/topics --sources meeting-prep/sources --data meeting-prep/sources/data
node ${CLAUDE_SKILL_DIR}/scripts/score.js meeting-prep/briefs/<the brief>
```

(Leave out `--data …` if there is no tabular data.)

- **factcheck — any FAIL means the brief is wrong, not debatable.** Fix it
  and re-run until zero FAILs. Quotation marks mean verbatim; if the words
  aren't exact, paraphrase without quotes. A paragraph or page number is a
  claim — if you didn't count, don't number. Review items are judgement
  calls: a figure you computed yourself is fine — say how in the brief.
- **score — fix every ✗ and every ~.** Shape problems are cheap to fix and
  the reader notices every one.

If Node isn't available, say so plainly, check quotes and figures by hand
against `meeting-prep/sources/`, and tell the person the gates were done
by hand.

## Step 6 — Hand over, and ask for feedback

1. Show the brief (render it if your environment can), say where it's
   saved, and list any drafts. Say plainly that nothing was sent.
2. Ask the person two questions — multiple choice if available:
   - **The bar: did this beat a blank page plus twenty minutes?** Yes / No
   - **The reads on people — right?** 0 none or wrong · 1 plausible but
     thin · 2 specific and right
   - and invite one line on what to change.
3. If they correct anything, append one line to `meeting-prep/lessons.md`:
   what was wrong, what to do instead, and why.
4. Print the **feedback card** below, and tell them it's for the person who
   shared this skill with them. It contains **no meeting content** — no
   names, numbers, quotes or topic names. Their one-line note is their own
   words: ask them to check it holds nothing private before they send it.

```
meeting-prep feedback · v0.1
meeting type: <proposing | status | being questioned>
sources: <connected tools | folder | pasted>
brief: <N> words (score's default-view count) · factcheck <N> FAIL · shape <n>/8
bar: <yes | no>
reads: <0 | 1 | 2>
note: <their line, or "none">
```
