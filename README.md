# Mr. System

A classroom game about systemic inequality in education, for 30–60 students in one room.

**▶ Play it: https://amberbellou.github.io/mr-system/**
**🎞 See how it plays (walkthrough deck for professors): https://amberbellou.github.io/mr-system/walkthrough.html**

Twenty-four families try to get to school, get home, and make it to tomorrow. Everyone follows
the same rules. Almost nobody gets the same result. The game runs about 35 minutes in core mode and ends on a debrief
screen that shows the class what just happened to them.

---

## What happens in a game

| Phase | What the room does |
| --- | --- |
| Setup | Pick a class size (30–60) and a roster: CORE (a curated ten — the default, fits a class period), FULL (all twenty-four), or CUSTOM. Families not played by hand fold into the background crowd. |
| Rounds 1–3 | Morning, evening, night. Each family faces a dilemma and picks A/B/C. Some choices trigger a timed challenge; some resolve on their own — and a choice that leaves a kid unprotected can draw an interruption from Mr. System himself (see danger mode below). |
| The vote | Before every vote, Mr. System files official "recommendations for disqualification" — grounded-sounding charges that only ever target the already-struggling, absurd charges with bureaucratic confidence, and the occasional charge against a thriving student, struck through and withdrawn. Then the surviving families vote one student out. Ghosts mime; they cannot vote. |
| Final round | Homework is due, then the music starts. Last one in is tardy, and tardy is out. Some students never had to rush. |
| Debrief | Who survived, who didn't, and a survival rate broken down by class band. |

The point is the shape of the choices, not the choosing. David picks between good outcomes all
game. Marcus picks which sibling absorbs the cost. Lucia's round 1 has three options and all three
end out of school — she is eliminated before she makes a decision.

## Danger mode

By default, some choices that leave a kid unsupervised, unaccompanied, or unprotected carry a
small chance that Mr. System strikes: a near-miss at a crossing with no guard, a breakdown on a
road where nobody is expecting you. Standard mode narrates injury and near-misses; the kid
survives. Unsparing mode is the unsoftened version — a kid can die. Off disables every roll.
The toggle is in PROF EDIT → Endgame. Upper-tier choices never carry danger, with one deliberate,
severity-buffered exception. Say which mode you are running in your content warning.

## Running it with students

Read **[docs/FACILITATOR.md](docs/FACILITATOR.md)** first. Several families carry crisis
storylines, and the elimination vote needs debriefing in the room. There is a content warning and
a suggested framing in there.

## Printing the physical game

The site is the demo; the real game is notecards. **PRINT PACK** (top right) generates role cards,
round cards, challenge cards, Kaia's script book (with answer keys and dice instructions for danger
events), Mr. System's memo sheets, the status board, ghost tents, star cards, vote slips, and a
one-page run of show — all from the current content pack and roster, so PROF EDIT localization
flows straight onto paper. Bring one d6.

## Editing the content

Everything on screen — dilemmas, choices, outcomes, characters, challenges, timers, every line of
narration, the reflection questions — is editable from inside the game. Click **PROF EDIT** in the
top right and enter the passcode (`mrsystem` by default; change it on the Content pack tab).

Edits are saved in your own browser, so what a student opens is never changed by what another
student types. To move your version to another machine or hand it to a colleague, copy the JSON out
of the Content pack tab and paste it into the same box there.

The passcode is a soft lock. It keeps students out of the panel; anyone who reads the page source
can find it. Because edits are per-browser, a student who did get in would only change their own
screen.

`content/default-pack.json` is the shipped content as a plain file, if you would rather edit it in
a text editor and paste it in.

## What's in here

```
index.html                  the whole game — one file, no build step, no dependencies
walkthrough.html            the 15-slide walkthrough deck (regenerate: tools/build-walkthrough.py)
content/default-pack.json   the default content pack
react/MrSystem.jsx          the same game as a React component
docs/FACILITATOR.md         how to run it, content warnings, debrief guidance
```

**Running it locally:** open `index.html` in a browser. That's the whole install.

**Using the React version:** drop `react/MrSystem.jsx` into a React 18 project and render
`<MrSystem />`. Add the Google Fonts link from the comment at the top of the file. The editor UI
lives in the HTML build; the React component takes content through its data structures.

## Design notes

The pixel art is generated, not clip art: a 12×14 sprite engine with per-character palettes and
body templates (wheelchair, headwrap, cap, glasses) plus 8×8 icon sprites. Status is always an icon
plus a text label, never colour alone. The page has a light theme (morning, drifting clouds) and a
dark one (dusk, stars); the toggle is in the top right and it also follows your system setting.
Tested at 375px and up.
