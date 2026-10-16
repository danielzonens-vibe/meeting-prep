# meeting-prep

A Claude Code skill that gets you ready for your next meeting.

It finds the meeting, reads what's relevant from your own sources — calendar, email, chat, meeting notes, or a folder of files — and writes a **one-page prep brief**: the background on a time axis, why it matters, a clear position you could say out loud, and the moves to make in the room. It drafts any message you should send beforehand. **It never sends anything.**

Every quote and figure in the brief is checked against the source it came from before you see it. If a quote isn't word-for-word, it doesn't stay in quotation marks.

Then a second, independent model reads your raw material — not the skill's notes — writes down what you must walk in knowing, and checks the brief against that list. If the brief misses something important, it gets revised; if it still misses it, the brief carries a warning at the top naming what's missing and where it is. This check is a full extra model run, so a brief costs noticeably more tokens than in v0.1.

## Install

In Claude Code:

```
/plugin marketplace add danielzonens-vibe/meeting-prep
/plugin install meeting-prep@danielzonens
```

Pick a scope when asked (user scope makes it available everywhere). You'll need **Node.js 18 or later** for the checks — `node --version` to confirm.

## Use

In any Claude Code session:

```
prep me for my next meeting
```

or name it: *"brief me for Thursday's pricing review"*, *"get me ready for the 2pm with Sam"*.

On the first run it asks:
1. **Where your material lives** — your connected tools (calendar, email, chat, transcripts), a folder, or you paste it in.
2. **Which topics this meeting touches** — you name 2–4. It never invents topics; that's on purpose.

From the second meeting on, it remembers: each topic keeps a running digest of decisions, open questions and who owes what.

## What stays where

Everything stays **on your machine**, in a `meeting-prep/` folder in the directory you run it from:

```
meeting-prep/
  topics/     a running digest per topic
  sources/    the excerpts the brief relied on, saved word-for-word so they can be checked
  briefs/     one brief per meeting
  drafts/     messages to send — never sent
  lessons.md  your corrections, remembered for next time
```

Reading your connected tools is read-only. Delete the folder whenever you like.

## Feedback

At the end of each brief it asks you two questions and prints a short **feedback card**:

```
meeting-prep feedback · v0.2
meeting type: …
sources: …
brief: … words · factcheck … FAIL · shape …/8
coverage: … findings · … used · … set aside
reader: room-changers … · position … · runnable … · rounds …
bar: yes | no
reads: 0 | 1 | 2
note: …
```

The card holds **no meeting content** — no names, numbers or quotes. The note is your own words; check it holds nothing private, then send the card to the person who shared this skill with you. That's the whole feedback loop, and it's how the skill gets better.

## The bar it's built to

> Did this beat a blank page plus twenty minutes?

If it didn't, say so in the note. A "no" with one line of why is the most useful thing you can send.
