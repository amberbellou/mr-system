# Style rules for Mr. System (all writing, all files, every session)

1. NEVER use em dashes or en dashes as punctuation. Not in game text, deck slides,
   print pack, docs, commit messages, or UI labels. Restructure the sentence instead:
   comma, period, colon, or split it in two. Hyphens inside compound words
   (grandma-led, working-class) are fine. The middle dot (·) is fine as a UI separator.

2. Sound like a person, not a machine:
   - Contractions are encouraged where a person would use them.
   - No "It's not X, it's Y" constructions.
   - Don't make everything come in threes. Vary list lengths and sentence shapes.
   - Banned words: delve, tapestry, myriad, testament, leverage, robust, seamless,
     moreover, furthermore, foster (as a verb), navigate (as metaphor).
   - Imperfect grammar beats machinic polish. A comma splice a person would write
     is better than a perfect sentence a person wouldn't.
   - Every line a narrator reads aloud must pass a read-aloud test. If it would make
     a human stumble or sound like a terms-of-service, rewrite it plainer.
   - One aphorism per surface, maximum. No new "Same X, different Y" lines.

3. Protected lines, do not touch, ever: Rebecca's cost lines including "Helmet hair";
   Marcus's "$2.50 for a $3 fare" and the crossing outcome; Lucia's Round 1; Aisha's
   uniform charge; "jogging with purpose"; Chase's black ice outcome; "Nobody chose
   wrong. Look at what each of them was choosing between."; "The wolf is the rules."

4. Honesty: never claim playtests, results, or observations that did not happen.
   The vote simulation is a design prediction, not evidence.

5. Ghost rule scope: when a family is eliminated, the entire group playing that
   family ghosts together, guardians included. Say "the whole group" wherever the
   ghost rule is explained.

## Build notes (how the pieces stay in sync)

- index.html is the source of truth for all content. The React build's data block,
  the walkthrough deck (tools/build-walkthrough.py), and content/default-pack.json
  are derived from it. After any content change: sync the React data block,
  re-run the walkthrough builder, and regenerate the pack.
- The PROF EDIT passcode lives in docs/FACILITATOR.md only. Never print it on a
  public surface.
