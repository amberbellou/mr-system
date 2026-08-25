# Mr. System

A classroom game about systemic inequality in education, for 30–60 students in one room.

**▶ Play it: https://amberbellou.github.io/mr-system/**

Ten families try to get to school, get home, and make it to tomorrow. Everyone follows the same
rules. Almost nobody gets the same result. The game runs about 20 minutes and ends on a debrief
screen that shows the class what just happened to them.

---

## What happens in a game

| Phase | What the room does |
| --- | --- |
| Setup | Pick a class size (30–60). Ten families are played by hand; the rest are grouped and resolved by the same rules in the background. |
| Rounds 1–3 | Morning, evening, night. Each family faces a dilemma and picks A/B/C. Some choices trigger a timed challenge; some resolve on their own. |
| The vote | After every round the surviving families vote one student out. Eliminated students stay in the room as ghosts — they can mime, they cannot vote. |
| Final round | Homework is due, then the music starts. Last one in is tardy, and tardy is out. Some students never had to rush. |
| Debrief | Who survived, who didn't, and a survival rate broken down by class band. |

The point is the shape of the choices, not the choosing. David picks between good outcomes all
game. Marcus picks which sibling absorbs the cost. Lucia's round 1 has three options and all three
end out of school — she is eliminated before she makes a decision.

## Running it with students

Read **[docs/FACILITATOR.md](docs/FACILITATOR.md)** first. Several families carry crisis
storylines, and the elimination vote needs debriefing in the room. There is a content warning and
a suggested framing in there.

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
