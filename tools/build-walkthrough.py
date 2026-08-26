#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate walkthrough.html — the professor-facing slide deck — from index.html.

index.html is the source of truth: this tool extracts the game's theme tokens,
sprite engine, and content data verbatim, so deck text can never drift from game
text. Re-run after any content change:  python3 tools/build-walkthrough.py
"""
import re, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "index.html")
OUT = os.path.join(ROOT, "walkthrough.html")

src = open(SRC, encoding="utf-8").read()

# ---- 1. theme tokens (the :root palette + dark overrides), verbatim ----
css = re.search(r"<style>([\s\S]*?)</style>", src).group(1)
tok_start = css.index(":root{")
tok_end = css.index("*{box-sizing")
tokens = css[tok_start:tok_end]

# ---- 2. game data: sprite engine through DILEMMAS + SETTINGS/CHARGES ----
js = re.search(r"<script>([\s\S]*?)</script>", src).group(1)
a = js.index("/* ==========================================================\n   1. PIXEL SPRITE ENGINE")
b = js.index("/* ==========================================================\n   4.7 PRINT PACK")
data = js[a:b]

# ---- 3. narration blocks ----
text_block = re.search(r"let TEXT = \{[\s\S]*?\n\};", js).group(0)
priv_block = re.search(r"let PRIV = \{[\s\S]*?\};", js).group(0)
rname_block = re.search(r"let ROUND_NAME = \{[\s\S]*?\};", js).group(0)
rkaia_block = re.search(r"let ROUND_KAIA = \{[\s\S]*?\};", js).group(0)

DECK_CSS = r"""
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:var(--ground);color:var(--ink);
  font-family:"IBM Plex Sans",-apple-system,sans-serif;overflow:hidden}
.px{font-family:"Press Start 2P","Courier New",monospace;line-height:1.5}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace}

.deck{height:100dvh;display:flex;flex-direction:column}
.bar{height:6px;background:var(--panel-2);flex:none}
.bar i{display:block;height:100%;background:var(--clay);transition:width .25s}
.stage{flex:1;position:relative;overflow:hidden}
.slide{position:absolute;inset:0;padding:clamp(18px,4vh,44px) clamp(16px,5vw,70px);
  display:none;flex-direction:column;overflow:hidden}
.slide.on{display:flex}
.slide-eyebrow{font-family:"Press Start 2P",monospace;font-size:clamp(8px,1.1vw,11px);
  letter-spacing:2px;color:var(--clay);margin:0 0 clamp(8px,1.6vh,16px)}
.slide h2{font-family:"Press Start 2P",monospace;font-size:clamp(15px,2.6vw,28px);
  line-height:1.4;margin:0 0 clamp(10px,2vh,20px);text-wrap:balance}
.slide p{margin:0}
.body{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:clamp(10px,2vh,22px)}
.caption{font-size:clamp(13px,1.5vw,17px);color:var(--ink-2);max-width:72ch}
.caption b{color:var(--ink)}
.bigline{font-family:"Press Start 2P",monospace;font-size:clamp(11px,1.8vw,18px);
  line-height:1.7;color:var(--ink);text-wrap:balance}

.nav{flex:none;display:flex;align-items:center;gap:12px;padding:10px clamp(16px,4vw,50px) 14px}
.nav-btn{font-family:"Press Start 2P",monospace;font-size:12px;cursor:pointer;
  border:3px solid var(--edge);background:var(--panel);color:var(--ink);
  padding:10px 16px;box-shadow:3px 3px 0 var(--edge)}
.nav-btn:hover{background:var(--gold);color:#141C26}
.nav-btn:active{transform:translate(2px,2px);box-shadow:0 0 0 var(--edge)}
.nav-btn[disabled]{opacity:.35;cursor:default}
.counter{font-family:"IBM Plex Mono",monospace;font-size:13px;font-weight:600;
  color:var(--ink-2);min-width:5ch;text-align:center}
.nav .spacer{flex:1}
:focus-visible{outline:3px solid var(--focus);outline-offset:3px}

/* shared pixel components */
.panel{background:var(--panel);border:3px solid var(--edge);box-shadow:5px 5px 0 var(--edge);padding:clamp(10px,1.8vh,18px)}
.qbox{background:var(--gold);color:#141C26;border:3px solid var(--edge);
  box-shadow:5px 5px 0 var(--edge);padding:clamp(12px,2vh,20px);
  font-size:clamp(14px,1.7vw,19px);font-weight:600;max-width:34ch}
.kbox{background:var(--edge);color:#E8EDF4;border:3px solid var(--edge);
  padding:clamp(11px,1.8vh,17px);font-size:clamp(13px,1.5vw,17px)}
.chip{display:inline-block;font-family:"IBM Plex Mono",monospace;font-size:clamp(9px,1vw,11px);
  font-weight:600;text-transform:uppercase;letter-spacing:.05em;border:2px solid currentColor;padding:1px 6px}
.c-upper{color:var(--violet)} .c-work{color:var(--clay)} .c-pov{color:var(--alarm)}
.cost{font-family:"IBM Plex Mono",monospace;font-size:clamp(10px,1.15vw,13px);
  font-weight:600;color:var(--clay)}
.callout{position:relative;border:3px dashed var(--clay);color:var(--clay);
  padding:8px 12px;font-family:"IBM Plex Mono",monospace;font-size:clamp(11px,1.2vw,13.5px);
  font-weight:700;align-self:flex-start}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:clamp(12px,2vw,26px);align-items:start}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(10px,1.6vw,22px)}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(8px,1.2vw,16px)}
@media (max-width:820px){.cards{grid-template-columns:repeat(2,1fr)}.grid2,.grid3{grid-template-columns:1fr}}
.mini-card{background:var(--panel-2);border:3px solid var(--edge);padding:10px;font-size:clamp(10px,1.1vw,13px)}
.mini-card .nm{font-family:"Press Start 2P",monospace;font-size:clamp(8px,1vw,11px);margin:6px 0 4px}
.load{font-family:"IBM Plex Mono",monospace;letter-spacing:2px;font-size:clamp(9px,1vw,12px);margin-top:6px;color:var(--ink-2)}
.dil-sit{font-size:clamp(13px,1.5vw,17px);line-height:1.5;margin-bottom:clamp(8px,1.4vh,14px)}
.dil-choice{display:flex;gap:10px;border:2px solid var(--edge);background:var(--panel-2);
  padding:8px 11px;margin-bottom:7px;font-size:clamp(12px,1.3vw,15px)}
.dil-choice b{font-family:"Press Start 2P",monospace;font-size:clamp(9px,1vw,12px);flex:none;
  border:2px solid var(--edge);width:1.7em;height:1.7em;display:flex;align-items:center;justify-content:center}
.mrsys{display:flex;gap:12px;border:3px solid var(--alarm);border-left-width:9px;
  background:var(--panel-3);padding:14px 16px}
.mrsys b{font-family:"Press Start 2P",monospace;font-size:10px;color:var(--alarm);flex:none;letter-spacing:1px}
.mrsys p{font-size:clamp(13px,1.5vw,17px)}
.ghost-strip{border:3px dashed var(--st-ghost);padding:10px 14px;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.ghost-strip .lbl{font-family:"Press Start 2P",monospace;font-size:9px;color:var(--st-ghost);letter-spacing:1px}
.ghost{display:flex;align-items:center;gap:6px;color:var(--st-ghost);
  font-family:"IBM Plex Mono",monospace;font-size:12px;font-style:italic}
.ghost canvas{animation:sway 1.6s steps(2) infinite}
@keyframes sway{50%{transform:translateX(3px)}}
.memo{border:3px solid var(--edge);background:var(--panel-2)}
.memo-head{background:var(--edge);color:#E8EDF4;padding:8px 12px;
  font-family:"Press Start 2P",monospace;font-size:clamp(8px,1vw,10px);letter-spacing:1px}
.memo ul{list-style:none;margin:0;padding:10px 16px;display:flex;flex-direction:column;gap:10px}
.memo li{font-size:clamp(12px,1.35vw,15.5px)}
.memo li b{font-family:"Press Start 2P",monospace;font-size:clamp(8px,1vw,10px)}
.memo .pol{font-family:"IBM Plex Mono",monospace;font-size:clamp(10px,1.05vw,12px);color:var(--ink-3)}
.memo li.wd{color:var(--st-star)}
.memo li.wd .struck{text-decoration:line-through;text-decoration-thickness:2px}
.pbar-row{display:grid;grid-template-columns:clamp(110px,14vw,170px) 1fr 56px;gap:12px;align-items:center}
.pbar-l{font-family:"IBM Plex Mono",monospace;font-size:clamp(10px,1.15vw,13px);font-weight:600;text-transform:uppercase}
.pbar{height:clamp(16px,2.4vh,24px);border:2px solid var(--edge);display:flex;background:var(--panel-2)}
.pbar i{display:block;height:100%}
.pbar-v{font-family:"Press Start 2P",monospace;font-size:clamp(9px,1.1vw,12px);text-align:right}
.takeaway{background:var(--panel-2);border:3px solid var(--edge);border-top:6px solid var(--clay);
  padding:clamp(9px,1.5vh,15px);font-size:clamp(11px,1.25vw,14.5px)}
.takeaway b{display:block;font-family:"Press Start 2P",monospace;font-size:clamp(7.5px,.9vw,9.5px);margin-bottom:6px;line-height:1.5}
.pipe{display:flex;gap:clamp(8px,1.4vw,18px);align-items:center;flex-wrap:wrap;
  font-size:clamp(12px,1.4vw,16px);font-weight:600}
.pipe .step{background:var(--panel-2);border:3px solid var(--edge);padding:10px 14px}
.pipe .arrow{font-family:"Press Start 2P",monospace;color:var(--clay)}
.timing{display:flex;height:clamp(22px,3vh,30px);border:3px solid var(--edge);overflow:hidden;
  font-family:"IBM Plex Mono",monospace;font-size:clamp(8px,.95vw,11px);font-weight:600}
.timing i{display:flex;align-items:center;justify-content:center;color:#141C26;white-space:nowrap;overflow:hidden}
.sprites-row{display:flex;gap:4px;flex-wrap:wrap;justify-content:center}
.bellviz{display:flex;flex-direction:column;gap:clamp(14px,2.6vh,26px);max-width:920px;width:100%;margin-top:6px}
.bell-row{display:flex;align-items:center;gap:12px}
.bell-who{display:flex;gap:3px;align-items:center;flex:none;min-width:clamp(80px,10vw,130px)}
.bell-name{font-family:"Press Start 2P",monospace;font-size:clamp(7px,.9vw,9px);margin-left:4px}
.bell-line{flex-grow:1;flex-basis:0;height:0;border-top:3px dashed var(--ink-3);position:relative;display:block}
.bell-gap{flex-basis:0;height:0;display:block}
.bell-line em{position:absolute;top:-2em;left:2px;font-style:normal;
  font-family:"IBM Plex Mono",monospace;font-size:clamp(9px,1vw,11.5px);color:var(--ink-2);white-space:nowrap}
.bell-school{flex:none;display:flex;align-items:center;gap:6px;
  font-family:"Press Start 2P",monospace;font-size:clamp(7px,.85vw,9px);color:var(--ink-2)}
.minitrack{position:relative;border:3px solid var(--edge);background:var(--panel-2);
  height:clamp(64px,10vh,92px);overflow:hidden;margin-top:8px}
.minitrack .rl{position:absolute;top:0;bottom:0;width:4px;background:var(--alarm);opacity:.8}
.minitrack .rn{position:absolute;bottom:6px;text-align:center}
.minitrack .rn i{display:block;font-family:"IBM Plex Mono",monospace;font-size:8px;font-style:normal;color:var(--ink-2)}
.tk-ic{display:block;margin-bottom:7px}
.sprites-row canvas{image-rendering:pixelated}
.beat{background:var(--panel);border:3px solid var(--edge);box-shadow:4px 4px 0 var(--edge);
  padding:clamp(10px,1.8vh,18px);text-align:center}
.beat b{font-family:"Press Start 2P",monospace;font-size:clamp(9px,1.15vw,12px);display:block;margin-bottom:6px}
.beat span{font-size:clamp(11px,1.25vw,14px);color:var(--ink-2)}
.beat-vote{font-family:"IBM Plex Mono",monospace;font-size:clamp(9px,1vw,12px);font-weight:700;
  color:var(--alarm);text-align:center;align-self:center}
.idx{position:fixed;inset:0;z-index:60;background:rgba(10,16,24,.86);display:none;place-items:center;padding:20px}
.idx.on{display:grid}
.idx-panel{background:var(--panel);border:4px solid var(--edge);box-shadow:8px 8px 0 rgba(0,0,0,.4);
  max-width:660px;width:100%;padding:22px;max-height:86vh;overflow:auto}
.idx-grid{display:grid;gap:7px;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-top:14px}
.idx-b{display:flex;gap:8px;align-items:baseline;text-align:left;cursor:pointer;font-family:inherit;
  font-size:13.5px;border:2px solid var(--edge);background:var(--panel-2);color:var(--ink);padding:8px 10px}
.idx-b:hover{background:var(--gold);color:#141C26}
.idx-b em{font-family:"Press Start 2P",monospace;font-size:8px;color:var(--clay);font-style:normal}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
@media print{
  body{overflow:visible;background:#fff}
  .deck{height:auto}
  .bar,.nav{display:none}
  .stage{overflow:visible}
  .slide{position:static;display:flex!important;min-height:7.4in;page-break-after:always;
    background:#fff;color:#111}
  :root{--ground:#fff;--panel:#fff;--panel-2:#f2f2f2;--panel-3:#e8e8e8;--ink:#111;--ink-2:#333;
    --ink-3:#666;--edge:#111;--gold:#e8c95a;--clay:#8a3d1a;--alarm:#8a1f1c;--violet:#4a3266;
    --st-ghost:#777;--st-star:#4a3266;--st-in:#2f6f45;--st-strug:#8a5a10;--st-out:#8a1f1c}
}
"""

DECK_JS = r"""
/* ================= DECK ENGINE ================= */
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g,
  m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const stage = document.getElementById("stage");

function spriteEl(id, px, ghost){
  const ch = BY_ID[id]; if (!ch) return document.createElement("span");
  return sprite(ch, px || 3, !!ghost);
}
function miniCard(id){
  const ch = BY_ID[id];
  const tierClass = ch.tier === "upper" ? "c-upper" : ch.tier === "work" ? "c-work" : "c-pov";
  let load = "";
  for (let i = 1; i <= 5; i++) load += i <= ch.load ? "■" : "□";
  return `<div class="mini-card"><span data-sp="${ch.id}" data-px="3"></span>
    <div class="nm">${esc(ch.name)}</div>
    <span class="chip ${tierClass}">${esc(ch.cls)}</span>
    <div class="load">${load} ${ch.load}/5</div></div>`;
}
function dilemmaPanel(id, opts){
  opts = opts || {};
  const d = DILEMMAS[1][id], ch = BY_ID[id];
  return `<div class="panel">
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
      <span data-sp="${id}" data-px="3"></span>
      <b class="px" style="font-size:clamp(9px,1.1vw,12px)">${esc(ch.name)}</b></div>
    <p class="dil-sit">${esc(d.sit)}</p>
    ${d.choices.slice(0, opts.max || 4).map(c => `<div class="dil-choice"><b>${esc(c.k)}</b>
      <span>${esc(c.t)}<br><span class="cost" ${opts.markCost ? 'data-cost="1"' : ""}>COST: ${esc(c.cost)}</span></span></div>`).join("")}
  </div>`;
}
function chalPanel(key){
  const c = CHALLENGES[key];
  return `<div class="panel">
    <b class="px" style="font-size:clamp(9px,1.1vw,12px)">${esc(c.title)}</b>
    <div class="px" style="font-size:clamp(18px,3vw,30px);margin:10px 0;border:3px solid var(--edge);
      display:inline-block;padding:8px 14px">${c.secs}s</div>
    <p style="font-size:clamp(12px,1.35vw,15px)">${esc(c.brief)}</p>
    <p class="mono" style="font-size:clamp(10px,1.1vw,13px);font-weight:700;margin-top:8px;color:var(--ink-2)">
      ${c.kind === "list" ? "Name any " + c.need : "Need " + Math.min(c.need, (c.qs||[]).length) + " of " + (c.qs||[]).length}</p>
  </div>`;
}
const findAbsurd = frag => (CHARGES.absurd || []).find(x => x.text.indexOf(frag) >= 0) || CHARGES.absurd[0];
const findPattern = id => (CHARGES.patterns || []).find(x => x.forId === id);
const findWithdrawn = id => (CHARGES.withdrawn || []).find(x => x.forId === id);
const marcusDanger = (DILEMMAS[1].marcus.choices.find(c => c.danger) || {}).danger;

/* ================= SLIDES ================= */
const SLIDES = [
{ id:"title", name:"Title", build: () => `
  <div class="body" style="align-items:center;text-align:center">
    <p class="slide-eyebrow">A GAME ABOUT SYSTEMIC INEQUALITY IN EDUCATION</p>
    <h2 class="px" style="font-size:clamp(28px,6vw,58px);text-shadow:5px 5px 0 var(--clay)">MR. SYSTEM</h2>
    <p class="caption" style="text-align:center">You are a student trying to get to school, get home, and
      make it to tomorrow. Your choices matter — but so do the systems built long before you got here.</p>
    <div class="sprites-row">${CAST.map(c => `<span data-sp="${c.id}" data-px="3"></span>`).join("")}</div>
    <p class="mono" style="font-size:clamp(11px,1.2vw,14px);color:var(--ink-3)">
      A game for 30–60 students · 35–45 minutes · click →</p>
    <p class="mono" style="font-size:clamp(10px,1.05vw,12.5px);color:var(--ink-3);margin-top:4px">
      A final project for [COURSE NAME] — designed by [NAME], built with a lot of index cards.</p>
  </div>`},
{ id:"intro", name:"Introduction", build: () => `
  <p class="slide-eyebrow">2 · INTRODUCTION</p>
  <h2>THE SAME FIRST BELL</h2>
  <div class="body">
    <p class="bigline">We wanted a room full of people to live one school morning under different rules
      — and then talk about why the rules felt so different.</p>
    <div class="bellviz">
      ${[["ayesha",6,"one crosswalk"],["david",24,"a ride, door to door"],
         ["fatima",58,"two school runs first, fasting"],["marcus",95,"ninety minutes on foot, four kids"]]
        .map(([id,wpc,lbl]) => `<div class="bell-row">
          <span class="bell-who"><span data-sp="${id}" data-px="3"></span>
            <span class="bell-name">${BY_ID[id].name}</span></span>
          <span class="bell-line" style="flex-grow:${wpc}"><em>${lbl}</em></span>
          <span class="bell-gap" style="flex-grow:${100-wpc}"></span>
          <span class="bell-school"><span data-ic="home" data-px="3"></span>8:30</span>
        </div>`).join("")}
    </div>
    <div class="grid2" style="max-width:900px">
      <div class="qbox">How do systems perpetuate inequity?</div>
      <div class="qbox">What would have to change for everyone to survive the same morning?</div>
    </div>
  </div>`},
{ id:"concept", name:"The Concept", build: () => `
  <p class="slide-eyebrow">3 · THE CONCEPT</p>
  <h2>LOUP GAROU, RESKINNED</h2>
  <div class="body">
    <p class="caption">The village is a school day. The wolf is <b>Mr. System</b> — not a person,
      but the thing everyone is actually playing against. Nobody is secretly the wolf. The wolf is the rules.</p>
    <div style="display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:clamp(6px,1vw,14px);align-items:stretch">
      <div class="beat"><b>MORNING</b><span>Get to school</span></div>
      <div class="beat-vote">▶ VOTE</div>
      <div class="beat"><b>EVENING</b><span>Get home</span></div>
      <div class="beat-vote">▶ VOTE</div>
      <div class="beat"><b>NIGHT</b><span>Make it to tomorrow</span></div>
    </div>
    <div class="beat" style="align-self:center;min-width:min(420px,80%)"><b>FINAL ROUND</b>
      <span>Homework due · musical chairs · the tardy rule</span></div>
    <p class="caption" style="font-style:italic">${esc(ROUND_KAIA[1])}</p>
  </div>`},
{ id:"families", name:"The Families", build: () => `
  <p class="slide-eyebrow">4 · THE FAMILIES</p>
  <h2>TWENTY-FOUR FAMILIES. THE SAME FIRST BELL.</h2>
  <div class="body">
    <div class="cards">${["david","mei","carlos","isabella","marie","marcus","lucia","amina"].map(miniCard).join("")}</div>
    <p class="caption">Load 1/5 to 5/5: <b>how heavy the morning is before a single choice gets made.</b>
      Same identity, different class, completely different morning. The deck is built so you can watch
      that happen.</p>
  </div>`},
{ id:"round", name:"How a Round Works", build: () => `
  <p class="slide-eyebrow">5 · HOW A ROUND WORKS</p>
  <h2>SITUATION → CHOICES → COST</h2>
  <div class="body">
    <div class="grid2" style="align-items:center">
      ${dilemmaPanel("rebecca", {markCost:true})}
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="callout">← The argument lives in the COST line.</div>
        <p class="caption">The family reads the card together, argues it out loud, and commits to a letter.
          Only the narrator's script knows what happens next — the reveal is the wolf's move.</p>
      </div>
    </div>
  </div>`},
{ id:"contrast", name:"The Contrast", build: () => `
  <p class="slide-eyebrow">6 · THE THESIS SLIDE</p>
  <h2>THE CONTRAST</h2>
  <div class="body">
    <div class="grid2">
      ${dilemmaPanel("rebecca", {max:3})}
      ${dilemmaPanel("marcus", {max:3})}
    </div>
    <p class="bigline" style="text-align:center">Cozy choices next to impossible ones.<br>That is the whole machine.</p>
  </div>`},
{ id:"challenges", name:"Challenges", build: () => `
  <p class="slide-eyebrow">7 · CHALLENGES</p>
  <h2>THE DIFFICULTY IS RIGGED. ON PURPOSE.</h2>
  <div class="body">
    <div class="grid2">${chalPanel("homework30")}${chalPanel("resources45")}</div>
    <p class="caption"><b>Failing costs David nothing</b> — his fail line literally ends
      "nobody writes anything down." <b>Failing sends Marcus's sibling home.</b> The clock is identical.
      What failing costs is not.</p>
  </div>`},
{ id:"danger", name:"Mr. System Strikes", build: () => `
  <p class="slide-eyebrow">8 · THE DANGER LAYER</p>
  <h2>MR. SYSTEM STRIKES</h2>
  <div class="body">
    <div class="mrsys"><b>MR. SYSTEM</b><p>${esc(marcusDanger ? marcusDanger.standard.say : "")}</p></div>
    <p class="caption">Danger only attaches to <b>exposure</b> — the unguarded crossing, the siblings home
      alone, the ride nobody is expecting. It doesn't punish the choice. It goes after the kid the choice
      left uncovered: no adult watching, no money waiting, no one expecting them at the other end.
      Professors set it to <b>off</b>, <b>standard</b>, or <b>unsparing</b>.</p>
  </div>`},
{ id:"vote", name:"The Vote", build: () => `
  <p class="slide-eyebrow">9 · THE VOTE</p>
  <h2>VOTE TO ELIMINATE</h2>
  <div class="body">
    <p class="caption" style="font-style:italic">${esc(TEXT.voteKaia)}</p>
    <div class="cards">${["mei","carlos","isabella","marcus"].map(miniCard).join("")}</div>
    <div class="ghost-strip"><span class="lbl">ELIMINATED — MIMING, NOT VOTING</span>
      <span class="ghost"><span data-sp="lucia" data-px="2" data-ghost="1"></span>LUCIA</span>
      <span class="ghost"><span data-sp="jayson" data-px="2" data-ghost="1"></span>JAYSON</span></div>
    <div class="callout">In every playtest, the room votes out whoever is already struggling.
      That's not a bug — it's the single most teachable moment in the game.</div>
  </div>`},
{ id:"memo", name:"The Memo", build: () => {
  const pat = findPattern("isabella"), abs = findAbsurd("Hummed"), wd = findWithdrawn("david");
  return `
  <p class="slide-eyebrow">10 · BEFORE EVERY VOTE</p>
  <h2>MR. SYSTEM RECOMMENDS</h2>
  <div class="body">
    <div class="memo" style="max-width:860px">
      <div class="memo-head">📋 MR. SYSTEM RECOMMENDS</div>
      <ul>
        <li><b>ISABELLA</b> — ${esc(pat ? pat.text : "")} <span class="pol">(Policy ${esc(pat ? pat.policy : "")})</span></li>
        <li><b>CARLOS</b> — ${esc(abs.text)} <span class="pol">(Policy ${esc(abs.policy)})</span></li>
        <li class="wd"><b>DAVID</b> — <span class="struck">${esc(wd ? wd.charge : "")}</span>
          <span class="mono" style="font-weight:700">WITHDRAWN: ${esc(wd ? wd.excuse : "")}</span></li>
      </ul>
    </div>
    <p class="bigline">Same offense. Different verdict. On screen.</p>
  </div>`; }},
{ id:"final", name:"The Final Round", build: () => `
  <p class="slide-eyebrow">11 · THE FINAL ROUND</p>
  <h2>HOMEWORK · MUSIC · TARDY</h2>
  <div class="body">
    <div class="grid3">
      <div class="panel"><b class="px" style="font-size:clamp(8px,1vw,10px)">THE BIN</b>
        <p style="font-size:clamp(11px,1.25vw,14px);margin-top:8px">${esc(TEXT.homeworkNote)}</p></div>
      <div class="panel"><b class="px" style="font-size:clamp(8px,1vw,10px)">THE RED LINES</b>
        <div class="px" style="font-size:clamp(20px,3vw,32px);color:var(--violet);margin:8px 0">12</div>
        <div class="minitrack">
          <span class="rl" style="left:8%"></span><span class="rl" style="left:50%"></span><span class="rl" style="left:92%"></span>
          <span class="rn" style="left:14%"><span data-sp="carlos" data-px="2"></span><i>running</i></span>
          <span class="rn" style="left:40%"><span data-sp="isabella" data-px="2"></span><i>running</i></span>
          <span class="rn" style="left:64%"><span data-sp="ayesha" data-px="2"></span><i>⭐ not rushing</i></span>
        </div>
        <p class="mono" style="font-size:clamp(9px,1vw,11.5px);color:var(--ink-3);margin-top:7px;font-style:italic">
          Musical chairs, but the chairs are attendance policy.</p></div>
      <div class="panel" style="border-color:var(--st-star)"><b class="px" style="font-size:clamp(8px,1vw,10px);color:var(--st-star)">⭐ SPECIAL TREATMENT</b>
        <p style="font-size:clamp(11px,1.2vw,13.5px);margin-top:8px">${esc(PRIV.ayesha || "")}</p>
        <p style="font-size:clamp(11px,1.2vw,13.5px);margin-top:6px">${esc(PRIV.david || "")}</p></div>
    </div>
    <p class="caption">Everyone can do the homework — <b>the homework was never the filter.</b>
      The last one in when the music stops is tardy, and tardy is out. Three students never had to run.</p>
  </div>`},
{ id:"pattern", name:"The Pattern", build: () => `
  <p class="slide-eyebrow">12 · THE DEBRIEF CHART</p>
  <h2>WHO IS STILL IN THE BUILDING</h2>
  <div class="body">
    <div style="display:flex;flex-direction:column;gap:12px;max-width:860px">
      <div class="pbar-row"><span class="pbar-l">Upper-class</span>
        <div class="pbar"><i style="width:100%;background:var(--st-in)"></i></div>
        <span class="pbar-v" style="color:var(--st-in)">~100%</span></div>
      <div class="pbar-row"><span class="pbar-l">Working-class</span>
        <div class="pbar"><i style="width:38%;background:var(--st-in)"></i><i style="width:24%;background:var(--st-strug)"></i><i style="width:38%;background:var(--st-out)"></i></div>
        <span class="pbar-v" style="color:var(--st-strug)">~60%</span></div>
      <div class="pbar-row"><span class="pbar-l">Poverty / crisis</span>
        <div class="pbar"><i style="width:10%;background:var(--st-in)"></i><i style="width:12%;background:var(--st-strug)"></i><i style="width:78%;background:var(--st-out)"></i></div>
        <span class="pbar-v" style="color:var(--st-out)">~15–30%</span></div>
    </div>
    <div class="kbox" style="max-width:76ch">Lucia's Round 1 had three options and all three ended out of
      school. She was eliminated before she made a decision. That is what a barrier is.
      <span class="mono" style="display:block;margin-top:7px;font-size:clamp(9px,1vw,11px);color:var(--gold)">— generated on the debrief screen</span></div>
    <div class="kbox" style="max-width:76ch">The room eliminated the struggling families. Mr. System had
      recommended most of them. It felt like due process. It was a suggestion box with one suggestion.
      <span class="mono" style="display:block;margin-top:7px;font-size:clamp(9px,1vw,11px);color:var(--gold)">— generated on the debrief screen</span></div>
  </div>`},
{ id:"reflect", name:"Let's Reflect", build: () => `
  <p class="slide-eyebrow">13 · LET'S REFLECT</p>
  <h2>ASK THE ROOM</h2>
  <div class="body">
    <div style="display:flex;flex-direction:column;gap:10px;max-width:860px">
      ${(TEXT.questions || []).map((q, i) => `<div class="kbox"><b class="px"
        style="font-size:9px;color:var(--gold);margin-right:10px">${i + 1}</b>${esc(q)}</div>`).join("")}
    </div>
    <p class="bigline">The question is never what Marcus should have done differently.</p>
  </div>`},
{ id:"takeaways", name:"Takeaways", build: () => `
  <p class="slide-eyebrow">14 · TAKEAWAYS</p>
  <h2>THINGS WE DESIGNED INTO THE GAME</h2>
  <div class="body">
    <div class="grid3">
      <div class="takeaway"><span class="tk-ic" data-ic="note" data-px="4"></span><b>COST LINES</b>We put
        the argument in the price tags — "Nothing." against "A risk you cannot take back."</div>
      <div class="takeaway"><span class="tk-ic" data-ic="clock" data-px="4"></span><b>RIGGED CHALLENGES</b>We
        rigged the difficulty to follow class. Failing up is free; failing down prices a sibling.</div>
      <div class="takeaway"><span class="tk-ic" data-ic="x" data-px="4"></span><b>THE VOTE</b>We gave the room
        a democracy and watched it punish whoever was already struggling. Then we gave Mr. System a memo to
        make it feel official.</div>
      <div class="takeaway"><span class="tk-ic" data-ic="warn" data-px="4"></span><b>DANGER = EXPOSURE</b>We let
        Mr. System strike only where no adult, no money, and no margin were covering the kid.</div>
      <div class="takeaway"><span class="tk-ic" data-ic="star" data-px="4"></span><b>THE FINISH LINE</b>We built
        a finish line some students never had to run for — and star cards that say so out loud.</div>
      <div class="takeaway"><span class="tk-ic" data-ic="book" data-px="4"></span><b>THE DEBRIEF</b>We end by
        handing the room a chart of what it just did to itself.</div>
    </div>
  </div>`},
{ id:"run", name:"How to Run It", build: () => `
  <p class="slide-eyebrow">15 · HOW TO RUN IT</p>
  <h2>DEMO → LOCALIZE → PRINT</h2>
  <div class="body">
    <div class="pipe">
      <span class="step">🎮 Play this demo</span><span class="arrow">→</span>
      <span class="step">✏️ PROF EDIT (passcode is in the facilitator guide)</span><span class="arrow">→</span>
      <span class="step">🖨 PRINT PACK — the real notecard game</span>
    </div>
    <div class="timing" role="img" aria-label="Run of show: deal 5, round one 10, vote 3, round two 8, vote 3, round three 6, vote 3, final 6, debrief 10 minutes">
      <i style="flex:5;background:var(--gold)">DEAL 5</i><i style="flex:10;background:var(--grass);color:#fff">R1 · 10</i>
      <i style="flex:3;background:var(--alarm);color:#fff">V</i><i style="flex:8;background:var(--grass);color:#fff">R2 · 8</i>
      <i style="flex:3;background:var(--alarm);color:#fff">V</i><i style="flex:6;background:var(--grass);color:#fff">R3 · 6</i>
      <i style="flex:3;background:var(--alarm);color:#fff">V</i><i style="flex:6;background:var(--violet);color:#fff">FINAL 6</i>
      <i style="flex:10;background:var(--sky);color:#fff">DEBRIEF 10+</i>
    </div>
    <p class="caption"><b>Before round one:</b> counselor's name + 988 on the board; players may pass on any
      character; pick your danger mode. Never end on an elimination.</p>
    <p class="caption mono">Play: amberbellou.github.io/mr-system · Code + facilitator guide:
      github.com/amberbellou/mr-system</p>
    <p class="caption" style="font-style:italic">Be nicer to the Marcuses in your building.</p>
    <div style="display:flex;gap:14px;align-items:flex-end">
      <h2 class="px" style="font-size:clamp(16px,3vw,30px);margin:0;text-shadow:4px 4px 0 var(--clay)">THANKS FOR PLAYING</h2>
      <canvas id="corgi" width="84" height="66" style="image-rendering:pixelated" role="img" aria-label="A pixel corgi standing on a brick"></canvas>
    </div>
  </div>`},
];

/* ================= RENDER + NAV ================= */
let cur = 0;
function renderDeck(){
  stage.innerHTML = SLIDES.map((s, i) => `<section class="slide${i === cur ? " on" : ""}" role="group"
    aria-roledescription="slide" aria-label="Slide ${i + 1} of ${SLIDES.length}: ${esc(s.name)}"
    ${i === cur ? "" : 'aria-hidden="true"'}>${s.build()}</section>`).join("");
  stage.querySelectorAll("[data-sp]").forEach(n => {
    n.appendChild(spriteEl(n.dataset.sp, +(n.dataset.px || 3), n.dataset.ghost === "1"));
  });
  stage.querySelectorAll("[data-ic]").forEach(n => {
    n.appendChild(icon(n.dataset.ic, +(n.dataset.px || 3), getComputedStyle(n).color));
  });
  drawCorgi();
  paintNav();
}
function paintNav(){
  document.getElementById("counter").textContent = (cur + 1) + " / " + SLIDES.length;
  document.getElementById("progress").style.width = ((cur + 1) / SLIDES.length * 100) + "%";
  document.getElementById("prev").disabled = cur === 0;
  document.getElementById("next").disabled = cur === SLIDES.length - 1;
  document.querySelectorAll(".slide").forEach((el, i) => {
    el.classList.toggle("on", i === cur);
    if (i === cur) el.removeAttribute("aria-hidden"); else el.setAttribute("aria-hidden", "true");
  });
  document.getElementById("live").textContent = "Slide " + (cur + 1) + " of " + SLIDES.length + ": " + SLIDES[cur].name;
}
function goTo(i){ cur = Math.max(0, Math.min(SLIDES.length - 1, i)); paintNav(); }
document.getElementById("prev").addEventListener("click", () => goTo(cur - 1));
document.getElementById("next").addEventListener("click", () => goTo(cur + 1));
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); goTo(cur + 1); }
  if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); goTo(cur - 1); }
  if (e.key === "Home") goTo(0);
  if (e.key === "End") goTo(SLIDES.length - 1);
  if (e.key === "Escape") document.getElementById("idx").classList.remove("on");
});
let tx = null;
stage.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, {passive: true});
stage.addEventListener("touchend", e => {
  if (tx == null) return;
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 48) goTo(cur + (dx < 0 ? 1 : -1));
  tx = null;
}, {passive: true});
document.getElementById("indexBtn").addEventListener("click", () => {
  const idx = document.getElementById("idx");
  document.getElementById("idxGrid").innerHTML = SLIDES.map((s, i) =>
    `<button class="idx-b" data-i="${i}"><em>${String(i + 1).padStart(2, "0")}</em>${esc(s.name)}</button>`).join("");
  idx.classList.add("on");
});
document.getElementById("idx").addEventListener("click", e => {
  const b = e.target.closest(".idx-b");
  if (b){ goTo(+b.dataset.i); document.getElementById("idx").classList.remove("on"); return; }
  if (e.target.id === "idx" || e.target.closest("[data-close]")) document.getElementById("idx").classList.remove("on");
});
document.getElementById("themeBtn").addEventListener("click", () => {
  const dark = document.documentElement.getAttribute("data-theme") === "dark"
    || (!document.documentElement.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", dark ? "light" : "dark");
  document.getElementById("themeBtn").textContent = dark ? "MORNING" : "DUSK";
});

/* the closer's corgi, on its brick */
function drawCorgi(){
  const cv = document.getElementById("corgi"); if (!cv) return;
  const g = cv.getContext("2d"), P = 6;
  const rows = [
    ".OO.....OO....",
    ".OOO...OOO....",
    ".OOOOOOOOO....",
    ".OWKWOWKWO....",
    ".OWWWWWWWO....",
    "..OWWkWWO.....",
    ".OOOOOOOOOOO..",
    ".OWWOOOOOOWO.O",
    ".OOOOOOOOOOOO.",
    "..O..O..O..O..",
  ];
  const pal = {O:"#C97B36", W:"#F2E3C8", K:"#141C26", k:"#141C26"};
  g.clearRect(0, 0, cv.width, cv.height);
  rows.forEach((row, y) => { for (let x = 0; x < row.length; x++){
    const c = row[x]; if (c === ".") continue;
    g.fillStyle = pal[c] || pal.O; g.fillRect(x * P, y * P, P, P);
  }});
  g.fillStyle = "#A0522D";
  g.fillRect(0, 60, 84, 6);
  g.fillStyle = "#8a4423";
  for (let x = 0; x < 84; x += 14) g.fillRect(x, 60, 2, 6);
}

renderDeck();
"""

SHELL = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="description" content="A click-through walkthrough of Mr. System, the classroom game about systemic inequality in education.">
<title>Mr. System — Walkthrough</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<style>
/* THEME TOKENS — extracted verbatim from index.html (source of truth). Regenerate with tools/build-walkthrough.py */
__TOKENS__
__DECKCSS__
</style>
</head>
<body>
<div class="deck">
  <div class="bar"><i id="progress"></i></div>
  <div class="stage" id="stage"></div>
  <div class="nav">
    <button class="nav-btn" id="prev" aria-label="Previous slide">&#8592;</button>
    <button class="nav-btn" id="next" aria-label="Next slide">&#8594;</button>
    <span class="counter" id="counter">1 / 15</span>
    <span class="spacer"></span>
    <button class="nav-btn" id="indexBtn" style="font-size:9px">INDEX</button>
    <button class="nav-btn" id="themeBtn" style="font-size:9px">MORNING</button>
    <a class="nav-btn" style="font-size:9px;text-decoration:none" href="index.html">PLAY THE GAME</a>
  </div>
</div>
<div class="idx" id="idx" role="dialog" aria-modal="true" aria-label="Slide index">
  <div class="idx-panel"><b class="px" style="font-size:11px">SLIDES</b>
    <div class="idx-grid" id="idxGrid"></div>
    <button class="nav-btn" data-close style="margin-top:14px;font-size:9px">CLOSE</button></div>
</div>
<p class="sr" id="live" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"></p>
<script>
/* GAME DATA — extracted verbatim from index.html (source of truth). Regenerate with tools/build-walkthrough.py */
__DATA__
__TEXT__
__PRIV__
__RNAME__
__RKAIA__
__DECKJS__
</script>
</body>
</html>
"""

out = (SHELL
  .replace("__TOKENS__", tokens)
  .replace("__DECKCSS__", DECK_CSS)
  .replace("__DATA__", data)
  .replace("__TEXT__", text_block)
  .replace("__PRIV__", priv_block)
  .replace("__RNAME__", rname_block)
  .replace("__RKAIA__", rkaia_block)
  .replace("__DECKJS__", DECK_JS))
open(OUT, "w", encoding="utf-8").write(out)
print("walkthrough.html:", len(out), "bytes")
