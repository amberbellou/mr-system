/**
 * Mr. System - a classroom game about systemic inequality in education.
 * Single-file React component. No dependencies beyond React 18+.
 *
 *   import MrSystem from "./MrSystem";
 *   <MrSystem />
 *
 * Fonts: add these to your index.html <head> (or import them in your CSS):
 *   <link rel="preconnect" href="https://fonts.googleapis.com">
 *   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 *   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
 *
 * Content note: several families carry crisis storylines. See the debrief screen's
 * facilitator note before running this with students.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";

const CSS = `
/* ============================================================
   MR. SYSTEM - screen deck
   Palette: morning sky + dusk. Earth tones, hard edges, no radii.
   ============================================================ */
:root{
  /* grounds + surfaces (slate-blue-biased neutrals, never pure grey) */
  --ground:#BCD7EE;
  --ground-2:#A8C9E6;
  --panel:#F4E9D2;
  --panel-2:#E8D9B8;
  --panel-3:#DCC9A2;
  --ink:#141C26;
  --ink-2:#3E4C5E;
  --ink-3:#6B7A8C;
  --edge:#141C26;
  --hairline:#B9A981;
  /* accents */
  --sky:#2F6FB0;
  --clay:#B85325;
  --grass:#3B8F55;
  --gold:#DFA018;
  --alarm:#C4332F;
  --violet:#6C4E96;
  /* semantic status */
  --st-in:#3B8F55;
  --st-strug:#C97B14;
  --st-out:#C4332F;
  --st-ghost:#7E8B9B;
  --st-star:#6C4E96;
  --focus:#B85325;
  --sky-canvas:#BCD7EE;
  --cloud:#F4F8FC;
  --cloud-2:#D3E5F4;
  --shadow:6px 6px 0 var(--edge);
  --shadow-sm:4px 4px 0 var(--edge);
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --ground:#0D131C;
    --ground-2:#131C28;
    --panel:#1A2532;
    --panel-2:#22303F;
    --panel-3:#2C3D4F;
    --ink:#E6EDF4;
    --ink-2:#B3C2D1;
    --ink-3:#8093A6;
    --edge:#05080C;
    --hairline:#3A4C60;
    --sky:#68A9E0;
    --clay:#E4794A;
    --grass:#5FBF7E;
    --gold:#F0BC46;
    --alarm:#EC5F5A;
    --violet:#A98BD6;
    --st-in:#5FBF7E;
    --st-strug:#F0A93C;
    --st-out:#EC5F5A;
    --st-ghost:#6C7E92;
    --st-star:#A98BD6;
    --focus:#F0BC46;
    --sky-canvas:#0D131C;
    --cloud:#27374A;
    --cloud-2:#1B2836;
  }
}
:root[data-theme="dark"]{
  --ground:#0D131C; --ground-2:#131C28; --panel:#1A2532; --panel-2:#22303F; --panel-3:#2C3D4F;
  --ink:#E6EDF4; --ink-2:#B3C2D1; --ink-3:#8093A6; --edge:#05080C; --hairline:#3A4C60;
  --sky:#68A9E0; --clay:#E4794A; --grass:#5FBF7E; --gold:#F0BC46; --alarm:#EC5F5A; --violet:#A98BD6;
  --st-in:#5FBF7E; --st-strug:#F0A93C; --st-out:#EC5F5A; --st-ghost:#6C7E92; --st-star:#A98BD6;
  --focus:#F0BC46; --sky-canvas:#0D131C; --cloud:#27374A; --cloud-2:#1B2836;
}

*{box-sizing:border-box}
body{
  margin:0;
  background:var(--ground);
  color:var(--ink);
  font-family:"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  font-size:16px;
  line-height:1.55;
  -webkit-font-smoothing:antialiased;
}
#sky{position:fixed;inset:0;width:100%;height:100%;z-index:-1;image-rendering:pixelated}
h1,h2,h3,h4{margin:0;text-wrap:balance}
p{margin:0}
canvas{display:block}
a{color:var(--clay)}

/* ---------- pixel type ---------- */
.px{font-family:"Press Start 2P","Courier New",monospace;font-weight:400;line-height:1.5;letter-spacing:0}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums}

/* ---------- shared bits ---------- */
.kaia{
  display:flex;gap:12px;border-left:5px solid var(--violet);background:var(--panel-2);
  padding:12px 14px;margin-bottom:22px;
}
.kaia-who{font-family:"Press Start 2P",monospace;font-size:8px;color:var(--violet);
  flex:none;padding-top:3px;letter-spacing:1px}
.kaia-say{font-size:15px;font-style:italic;color:var(--ink)}
.eyebrow{font-family:"Press Start 2P",monospace;font-size:8px;letter-spacing:2px;color:var(--clay)}
.screen-title{font-family:"Press Start 2P",monospace;font-size:clamp(13px,2.6vw,19px);
  line-height:1.45;margin:10px 0 6px}
.hr{height:3px;background:var(--edge);border:0;margin:22px 0;opacity:.85}
.dotrule{height:0;border-top:3px dotted var(--hairline);margin:20px 0}

/* buttons */
.btn{
  font-family:"Press Start 2P",monospace;font-size:11px;line-height:1;cursor:pointer;
  border:4px solid var(--edge);background:var(--gold);color:#141C26;padding:15px 22px;
  box-shadow:var(--shadow-sm);transition:transform .06s steps(2),box-shadow .06s steps(2);
}
.btn:hover{background:var(--clay);color:#FFF6EA}
.btn:active{transform:translate(4px,4px);box-shadow:0 0 0 var(--edge)}
.btn-ghost{background:transparent;color:var(--ink);box-shadow:none;border-width:3px;font-size:9px;padding:11px 14px}
.btn-ghost:hover{background:var(--ink);color:var(--panel)}
:focus-visible{outline:3px solid var(--focus);outline-offset:3px}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}

/* chips + badges */
.chip{display:inline-flex;align-items:center;gap:6px;font-family:"IBM Plex Mono",monospace;
  font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;
  border:2px solid currentColor;padding:2px 7px}
.chip canvas{image-rendering:pixelated;width:12px;height:12px}
.c-upper{color:var(--violet)} .c-mid{color:var(--sky)} .c-work{color:var(--clay)} .c-pov{color:var(--alarm)}
.badge{display:inline-flex;align-items:center;gap:7px;font-family:"Press Start 2P",monospace;
  font-size:9px;letter-spacing:.5px;border:3px solid currentColor;padding:6px 9px;line-height:1}
.badge canvas{image-rendering:pixelated;width:14px;height:14px}
.b-in{color:var(--st-in)} .b-strug{color:var(--st-strug)} .b-out{color:var(--st-out)}
.b-ghost{color:var(--st-ghost)} .b-star{color:var(--st-star)}

/* ============ APP SHELL ============ */
#sky{position:fixed;inset:0;width:100%;height:100%;z-index:-1;image-rendering:pixelated}
.app{max-width:1180px;margin:0 auto;padding:18px 16px 70px}
@media (min-width:960px){.app{padding:26px 24px 90px}}

.topbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px}
.logo{font-family:"Press Start 2P",monospace;font-size:13px;letter-spacing:1px;
  color:var(--ink);text-shadow:3px 3px 0 var(--clay)}
.topbar-right{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.pill{font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:600;letter-spacing:.04em;
  border:2px solid var(--hairline);color:var(--ink-2);padding:4px 9px;text-transform:uppercase;
  background:var(--panel);white-space:nowrap}
.pill b{color:var(--ink)}
.mini{font-family:"Press Start 2P",monospace;font-size:8px;line-height:1;cursor:pointer;
  border:2px solid var(--edge);background:var(--panel);color:var(--ink);padding:8px 10px}
.mini:hover{background:var(--gold);color:#141C26}
.mini[aria-pressed="true"]{background:var(--violet);color:#FFF6EA;border-color:var(--violet)}

/* the game screen frame */
.screen{position:relative;background:var(--panel);border:4px solid var(--edge);
  box-shadow:var(--shadow);overflow:hidden}
.screen::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:3;
  background:repeating-linear-gradient(to bottom,rgba(20,28,38,.05) 0 2px,transparent 2px 4px);
  mix-blend-mode:multiply}
:root[data-theme="dark"] .screen::after{mix-blend-mode:screen;
  background:repeating-linear-gradient(to bottom,rgba(160,200,240,.045) 0 2px,transparent 2px 4px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .screen::after{mix-blend-mode:screen;
  background:repeating-linear-gradient(to bottom,rgba(160,200,240,.045) 0 2px,transparent 2px 4px)}}
.chrome{display:flex;align-items:center;gap:10px;background:var(--edge);color:#E8EDF4;
  padding:9px 12px;font-family:"Press Start 2P",monospace;font-size:8px;letter-spacing:1px;
  position:relative;z-index:4}
.chrome-dot{width:8px;height:8px;background:var(--clay);flex:none}
.chrome-right{margin-left:auto;color:#93A5B8;font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:0}
.pad{padding:24px 20px;position:relative;z-index:2}
@media (min-width:760px){.pad{padding:34px 34px}}

/* two-column: dashboard rail + stage */
.layout{display:grid;gap:18px;align-items:start}
@media (min-width:960px){.layout{grid-template-columns:minmax(0,1fr) 292px}}

/* ============ DASHBOARD RAIL ============ */
.dash{background:var(--panel);border:4px solid var(--edge);box-shadow:var(--shadow-sm)}
.dash-head{background:var(--edge);color:#E8EDF4;padding:9px 12px;
  font-family:"Press Start 2P",monospace;font-size:8px;letter-spacing:1px}
.dash-body{padding:12px}
.tally{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px}
.tally-cell{border:2px solid currentColor;padding:6px 4px;text-align:center}
.tally-n{font-family:"Press Start 2P",monospace;font-size:15px;line-height:1.3}
.tally-l{font-family:"IBM Plex Mono",monospace;font-size:9px;font-weight:600;
  letter-spacing:.06em;text-transform:uppercase}
.bar{display:flex;height:12px;border:2px solid var(--edge);margin-bottom:14px;overflow:hidden}
.bar span{display:block;height:100%}
.roster{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:3px}
.rrow{display:flex;align-items:center;gap:8px;padding:4px 5px;border:2px solid transparent}
.rrow.is-now{border-color:var(--gold);background:var(--panel-2)}
.rrow canvas{width:20px;height:24px;image-rendering:pixelated;flex:none}
.rrow-name{font-family:"IBM Plex Mono",monospace;font-size:12px;font-weight:600;
  letter-spacing:.02em;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rrow-dot{width:14px;height:14px;flex:none;image-rendering:pixelated}
.rrow.is-out .rrow-name{color:var(--st-ghost);text-decoration:line-through;text-decoration-thickness:2px}
.rrow.is-out canvas{opacity:.45}
.crowd{margin-top:12px;border-top:3px dotted var(--hairline);padding-top:10px}
.crowd-l{font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:600;
  text-transform:uppercase;letter-spacing:.06em;color:var(--ink-3);margin-bottom:7px}
.crowd-grid{display:flex;flex-wrap:wrap;gap:2px}
.crowd-grid i{width:8px;height:8px;display:block}

/* ============ CHOICES ============ */
.choices{display:flex;flex-direction:column;gap:10px;margin-top:6px}
.choice{display:flex;gap:13px;align-items:flex-start;width:100%;text-align:left;cursor:pointer;
  border:3px solid var(--edge);background:var(--panel-2);color:var(--ink);padding:14px 15px;
  font-family:inherit;font-size:15px;line-height:1.45;
  box-shadow:var(--shadow-sm);transition:transform .06s steps(2),box-shadow .06s steps(2),background .1s}
.choice:hover{background:var(--gold);color:#141C26}
.choice:active{transform:translate(4px,4px);box-shadow:0 0 0 var(--edge)}
.choice[disabled]{cursor:not-allowed;opacity:.55;box-shadow:none}
.choice-k{font-family:"Press Start 2P",monospace;font-size:13px;flex:none;
  width:30px;height:30px;display:grid;place-items:center;border:3px solid currentColor}
.choice-t{flex:1;min-width:0}
.choice-cost{display:block;margin-top:6px;font-family:"IBM Plex Mono",monospace;font-size:11.5px;
  font-weight:600;letter-spacing:.02em;color:var(--clay)}
.choice:hover .choice-cost{color:#5A2A0E}
.choice-ic{width:20px;height:20px;image-rendering:pixelated;flex:none;margin-top:5px}

/* ============ CHALLENGE ============ */
.chal-top{display:flex;flex-wrap:wrap;gap:14px;align-items:center;
  border:3px solid var(--edge);background:var(--panel-2);padding:14px 16px;margin-bottom:20px}
.clock{font-family:"Press Start 2P",monospace;font-size:clamp(26px,7vw,44px);line-height:1;
  color:var(--st-in);min-width:3.4ch;font-variant-numeric:tabular-nums}
.clock.warn{color:var(--st-strug)}
.clock.crit{color:var(--st-out);animation:blink .5s steps(2,end) infinite}
@keyframes blink{50%{opacity:.35}}
.chal-meta{flex:1;min-width:180px}
.chal-diff{display:flex;gap:3px;align-items:center;margin-top:6px}
.chal-diff i{width:11px;height:11px;border:2px solid var(--edge);display:block;background:transparent}
.chal-diff i.on{background:var(--clay)}
.chal-diff span{font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:600;
  text-transform:uppercase;letter-spacing:.06em;margin-left:6px;color:var(--ink-2)}
.tbar{height:10px;border:2px solid var(--edge);width:100%;margin-top:12px;overflow:hidden}
.tbar i{display:block;height:100%;background:var(--st-in);transition:width .95s linear}
.tbar.warn i{background:var(--st-strug)} .tbar.crit i{background:var(--st-out)}
.q{border-left:5px solid var(--sky);background:var(--panel-2);padding:12px 14px;margin-bottom:12px}
.q-n{font-family:"Press Start 2P",monospace;font-size:8px;color:var(--sky);letter-spacing:1px}
.q-t{font-size:15.5px;margin-top:7px;font-weight:600}
.opts{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px}
.opt{font-family:"IBM Plex Mono",monospace;font-size:14px;font-weight:600;cursor:pointer;
  border:3px solid var(--edge);background:var(--panel);color:var(--ink);padding:9px 14px}
.opt:hover{background:var(--sky);color:#FFF}
.opt[aria-pressed="true"]{background:var(--ink);color:var(--panel);border-color:var(--ink)}
.field{width:100%;font-family:"IBM Plex Mono",monospace;font-size:15px;color:var(--ink);
  background:var(--panel);border:3px solid var(--edge);padding:12px 13px;resize:vertical}
.field::placeholder{color:var(--ink-3)}
.hint{font-size:13.5px;color:var(--ink-2);margin-top:9px}

/* ============ RESULTS ============ */
.res{display:flex;gap:14px;border:3px solid var(--edge);background:var(--panel-2);
  padding:14px 15px;margin-bottom:10px;border-left-width:9px}
.res.r-in{border-left-color:var(--st-in)}
.res.r-strug{border-left-color:var(--st-strug)}
.res.r-out{border-left-color:var(--st-out);background:var(--panel-3)}
.res canvas{width:34px;height:40px;image-rendering:pixelated;flex:none}
.res.r-out canvas{opacity:.4}
.res-b{flex:1;min-width:0}
.res-n{font-family:"Press Start 2P",monospace;font-size:11px;letter-spacing:.5px}
.res-say{font-size:14.5px;color:var(--ink-2);margin:7px 0 10px}
.res-say b{color:var(--ink);font-weight:600}
.reveal{opacity:0;transform:translateY(10px);animation:pop .28s steps(4) forwards}
@keyframes pop{to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none}}

/* ============ VOTING ============ */
.votes{display:grid;gap:10px;grid-template-columns:1fr}
@media (min-width:640px){.votes{grid-template-columns:1fr 1fr}}
.vcard{display:flex;gap:11px;align-items:center;text-align:left;cursor:pointer;
  border:3px solid var(--edge);background:var(--panel-2);color:var(--ink);padding:11px 12px;font-family:inherit}
.vcard:hover{background:var(--gold);color:#141C26}
.vcard[aria-pressed="true"]{background:var(--alarm);color:#FFF3F0;border-color:var(--alarm)}
.vcard canvas{width:26px;height:31px;image-rendering:pixelated;flex:none}
.vcard-n{display:block;font-family:"Press Start 2P",monospace;font-size:10px;line-height:1.4}
.vcard-s{display:block;font-family:"IBM Plex Mono",monospace;font-size:11.5px;margin-top:6px;opacity:.85}
.tallybar{display:flex;align-items:center;gap:10px;margin:7px 0}
.tallybar-n{font-family:"IBM Plex Mono",monospace;font-size:12.5px;font-weight:600;width:88px;flex:none}
.tallybar-t{flex:1;height:16px;border:2px solid var(--edge);background:var(--panel-2)}
.tallybar-t i{display:block;height:100%;background:var(--alarm);transition:width .5s steps(8)}
.tallybar-c{font-family:"Press Start 2P",monospace;font-size:10px;width:2ch;text-align:right}
.mimes{border:3px dashed var(--st-ghost);padding:13px 14px;margin-top:20px;background:transparent}
.mimes-h{font-family:"Press Start 2P",monospace;font-size:8px;color:var(--st-ghost);
  letter-spacing:1px;margin-bottom:11px}
.mime-row{display:flex;flex-wrap:wrap;gap:14px}
.mime{display:flex;align-items:center;gap:8px;color:var(--st-ghost);
  font-family:"IBM Plex Mono",monospace;font-size:12px;font-style:italic}
.mime canvas{width:22px;height:26px;image-rendering:pixelated;opacity:.55;animation:sway 1.6s steps(2) infinite}
@keyframes sway{50%{transform:translateX(3px)}}

/* ============ FINAL ROUND ============ */
.bin{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-top:6px}
.binrow{display:flex;align-items:center;gap:9px;border:3px solid var(--edge);
  background:var(--panel-2);padding:9px 11px;font-family:"IBM Plex Mono",monospace;
  font-size:12.5px;font-weight:600}
.binrow canvas{width:16px;height:16px;image-rendering:pixelated;flex:none}
.sketch{border:3px solid var(--edge);background:var(--panel);touch-action:none;cursor:crosshair;
  width:100%;max-width:420px;height:210px;image-rendering:pixelated;display:block}
.eq{display:flex;align-items:flex-end;gap:4px;height:52px}
.eq i{width:9px;background:var(--violet);display:block;animation:eq .7s steps(4) infinite alternate}
.eq i:nth-child(2n){background:var(--sky);animation-duration:.5s}
.eq i:nth-child(3n){background:var(--clay);animation-duration:.9s}
@keyframes eq{from{height:14%}to{height:100%}}
@media (prefers-reduced-motion:reduce){.eq i{height:60%}}
.track{position:relative;border:3px solid var(--edge);background:var(--panel-2);
  height:150px;overflow:hidden;margin-top:16px}
.track-line{position:absolute;top:0;bottom:0;width:5px;background:var(--alarm);opacity:.8}
.runner{position:absolute;bottom:12px;transition:left .3s linear;text-align:center}
.runner canvas{width:28px;height:33px;image-rendering:pixelated;animation:hop .34s steps(2) infinite}
@keyframes hop{50%{transform:translateY(-5px)}}
.runner b{display:block;font-family:"IBM Plex Mono",monospace;font-size:9.5px;font-weight:600;
  margin-top:2px;white-space:nowrap}

/* ============ DEBRIEF ============ */
.pattern{display:grid;gap:8px;margin:8px 0 4px}
.prow{display:grid;grid-template-columns:130px 1fr 60px;gap:10px;align-items:center}
.prow-l{font-family:"IBM Plex Mono",monospace;font-size:12px;font-weight:600;
  text-transform:uppercase;letter-spacing:.03em}
.prow-t{height:20px;border:2px solid var(--edge);background:var(--panel-2);display:flex}
.prow-t i{display:block;height:100%}
.prow-v{font-family:"Press Start 2P",monospace;font-size:10px;text-align:right}
.legend{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px}
.legend span{display:flex;align-items:center;gap:6px;font-family:"IBM Plex Mono",monospace;
  font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.legend i{width:12px;height:12px;border:2px solid var(--edge);display:block}
.cols{display:grid;gap:18px}
@media (min-width:720px){.cols{grid-template-columns:1fr 1fr}}
.list{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:7px}
.list li{display:flex;gap:9px;align-items:flex-start;font-size:14.5px;line-height:1.45}
.list canvas{width:14px;height:14px;image-rendering:pixelated;flex:none;margin-top:4px}
.list .who{font-weight:600}
.list .why{color:var(--ink-2)}
.qs{counter-reset:q;list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:12px}
.qs li{counter-increment:q;display:flex;gap:12px;font-size:15.5px;line-height:1.5}
.qs li::before{content:counter(q);font-family:"Press Start 2P",monospace;font-size:11px;
  color:var(--clay);flex:none;border:3px solid var(--clay);width:30px;height:30px;
  display:grid;place-items:center}
.note{border-left:5px solid var(--clay);background:var(--panel-2);padding:13px 15px;
  font-size:14px;color:var(--ink-2);margin-top:20px}
.note b{color:var(--ink)}

/* ============ SETUP / CAST ============ */
.setup-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:16px 0 6px}
.stepper{display:flex;align-items:center;gap:0;border:3px solid var(--edge);background:var(--panel-2)}
.stepper button{font-family:"Press Start 2P",monospace;font-size:13px;cursor:pointer;border:0;
  background:transparent;color:var(--ink);padding:12px 16px;line-height:1}
.stepper button:hover{background:var(--gold);color:#141C26}
.stepper output{font-family:"Press Start 2P",monospace;font-size:19px;padding:0 18px;min-width:4.4ch;
  text-align:center;font-variant-numeric:tabular-nums}
.cast{display:grid;gap:11px;grid-template-columns:repeat(auto-fit,minmax(228px,1fr))}
.ccard{border:3px solid var(--edge);background:var(--panel-2);padding:13px;box-shadow:var(--shadow-sm)}
.ccard-h{display:flex;gap:10px;align-items:center;margin-bottom:9px}
.ccard-h canvas{width:32px;height:38px;image-rendering:pixelated;flex:none}
.ccard-n{font-family:"Press Start 2P",monospace;font-size:11px}
.ccard-tags{list-style:none;margin:9px 0 0;padding:0;display:flex;flex-direction:column;gap:4px}
.ccard-tags li{font-size:13px;color:var(--ink-2);padding-left:13px;position:relative;line-height:1.4}
.ccard-tags li::before{content:"";position:absolute;left:0;top:7px;width:6px;height:6px;background:var(--ink-3)}
.meter{display:flex;gap:3px;align-items:center;margin-top:11px}
.meter i{width:13px;height:9px;border:2px solid var(--edge);display:block}
.meter i.on{background:var(--clay)}
.meter span{font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:600;
  text-transform:uppercase;letter-spacing:.05em;color:var(--ink-2);margin-left:6px}
.actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:26px}
.actions .spacer{flex:1}

/* index overlay */
.idx{position:fixed;inset:0;z-index:60;background:rgba(10,16,24,.86);
  display:grid;place-items:center;padding:20px;overflow:auto}
.idx-panel{background:var(--panel);border:4px solid var(--edge);box-shadow:10px 10px 0 rgba(0,0,0,.4);
  max-width:640px;width:100%;padding:24px}
.idx-grid{display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-top:16px}
.idx-b{display:flex;gap:9px;align-items:baseline;text-align:left;cursor:pointer;font-family:inherit;
  font-size:14px;border:3px solid var(--edge);background:var(--panel-2);color:var(--ink);padding:10px 11px}
.idx-b:hover{background:var(--gold);color:#141C26}
.idx-b em{font-family:"Press Start 2P",monospace;font-size:8px;color:var(--clay);font-style:normal}
.idx-b:hover em{color:#5A2A0E}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;

/* ==========================================================
   1. PIXEL SPRITE ENGINE
   12x14 character sprites + 8x8 icons, drawn to canvas.
   ========================================================== */
const BASE = [
"....HHHH....","...HHHHHH...","..HHHHHHHH..","..HSSSSSSH..","..HSESSESH..",
"..HSSSSSSH..","...SSSSSS...","....SSSS....","..TTTTTTTT..",".STTTTTTTTS.",
".STTTTTTTTS.","..TTTTTTTT..","..PPP..PPP..","..BBB..BBB.."];
const TEMPLATES = {
  base: BASE,
  wheel: BASE.slice(0,12).concat([".WWPPPPPPWW.",".WW.WWWW.WW."]),
  wrap: ["....AAAA....","...AAAAAA...","..AAAAAAAA..","..ASSSSSSA..","..ASESSESA..",
         "..ASSSSSSA..","..ASSSSSSA..","..AASSSSAA.."].concat(BASE.slice(8)),
  cap: ["...AAAAAA...","..AAAAAAAA..",".AAAAAAAAAA."].concat(BASE.slice(3)),
  long: ["....HHHH....","...HHHHHH...","..HHHHHHHH..","..HSSSSSSH..","..HSESSESH..",
         "..HSSSSSSH..","..HSSSSSSH..","..HHSSSSHH..","..TTTTTTTT..",".STTTTTTTTS.",
         ".STTTTTTTTS.","..TTTTTTTT..","..PPP..PPP..","..BBB..BBB.."]
};
const GHOST_PAL = {H:"#7E8B9B",S:"#96A3B2",E:"#5A6675",T:"#8894A3",P:"#78848F",
                   B:"#6C7883",A:"#8894A3",W:"#78848F",L:"#AAB6C2"};

function drawSprite(cv, ch, opts){
  opts = opts || {};
  const rows = TEMPLATES[ch.tmpl] || BASE;
  const pal = opts.ghost ? GHOST_PAL : Object.assign({E:"#141C26"}, ch.pal);
  const w = 12, h = 14, px = opts.px || 3;
  cv.width = w*px; cv.height = h*px;
  const g = cv.getContext("2d");
  g.imageSmoothingEnabled = false;
  g.clearRect(0,0,cv.width,cv.height);
  for (let y=0; y<h; y++){
    const row = rows[y] || "";
    for (let x=0; x<w; x++){
      let c = row[x];
      if (!c || c === ".") continue;
      if (ch.glasses && y===4 && (x===3||x===8)) c = "L";
      if (ch.glasses && y===4 && (x===4||x===7)) c = "E";
      const col = pal[c] || pal.T;
      if (!col) continue;
      g.fillStyle = col;
      g.fillRect(x*px, y*px, px, px);
    }
  }
  if (opts.ghost) cv.style.opacity = ".6";
  return cv;
}
function sprite(ch, px, ghost){
  const cv = document.createElement("canvas");
  cv.setAttribute("role","img");
  cv.setAttribute("aria-label", (ghost ? "Pixel ghost of " : "Pixel portrait of ") + ch.name);
  return drawSprite(cv, ch, {px: px||3, ghost: !!ghost});
}

const ICONS = {
  check:["........","......#.",".....##.","#...##..","##.##...",".####...","..##....","........"],
  warn: ["...##...","...##...","...##...","..####..","..####..","........","..####..","..####.."],
  x:    ["........",".#....#.",".##..##.","..####..","..####..",".##..##.",".#....#.","........"],
  star: ["...##...","...##...",".######.","########","..####..",".######.",".##..##.","#......#"],
  car:  ["........","..####..",".######.","########","########","#o####o#",".o....o.","........"],
  bus:  ["........",".######.",".#o##o#.",".######.",".#o##o#.",".######.",".o....o.","........"],
  walk: ["...##...","...##...","..####..",".#.##.#.","...##...","..#..#..",".#....#.","#......#"],
  clock:["..####..",".#....#.","#..#...#","#..#...#","#..###.#","#......#",".#....#.","..####.."],
  home: ["...##...","..####..",".######.","########",".#....#.",".#.##.#.",".#.##.#.",".######."],
  bin:  ["..####..","########","........",".######.",".#.##.#.",".#.##.#.",".#.##.#.",".######."],
  note: ["....###.","....###.","....#.#.","....#...","..###...",".####...",".###....","........"],
  ghost:["..####..",".######.","#o####o#","########","########","########","#.#..#.#","........"],
  heart:[".##..##.","########","########","########",".######.","..####..","...##...","........"],
  book: [".##..##.","######.#","#....#.#","#....#.#","#....#.#","#....#.#","######.#",".##..##."]
};
function icon(name, px, color, accent){
  const rows = ICONS[name] || ICONS.warn, p = px||2;
  const cv = document.createElement("canvas");
  cv.width = 8*p; cv.height = 8*p; cv.setAttribute("aria-hidden","true");
  const g = cv.getContext("2d"); g.imageSmoothingEnabled = false;
  for (let y=0;y<8;y++) for (let x=0;x<8;x++){
    const c = rows[y][x];
    if (c === "." ) continue;
    g.fillStyle = c === "o" ? (accent || "#F4E9D2") : (color || "currentColor");
    g.fillRect(x*p,y*p,p,p);
  }
  return cv;
}
function iconFor(status){
  return status === "in" ? "check" : status === "strug" ? "warn" : "x";
}
function cssVar(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

/* ==========================================================
   2. CAST
   ========================================================== */
const CAST = [
{id:"david", name:"DAVID", cls:"Upper-class", tier:"upper", pri:true,
 who:"White, wealthy, two parents at home. His dad runs the front office.",
 tags:["Two parents, one stays flexible","Car in the driveway","Dad is the principal"],
 load:1, tmpl:"base", pal:{H:"#3B2A1C",S:"#F2CBA0",T:"#2F6FB0",P:"#2C3A4C",B:"#1B222B"}},
{id:"alejandra", name:"ALEJANDRA", cls:"Upper-class", tier:"upper", pri:true,
 who:"Colombian, wealthy family, enormous performance pressure.",
 tags:["Driver takes her to school","Four AP classes, no margin","Failure is not discussed"],
 load:2, tmpl:"long", pal:{H:"#241A14",S:"#D9A374",T:"#6C4E96",P:"#2C3A4C",B:"#1B222B"}},
{id:"priya", name:"PRIYA", cls:"Upper-middle", tier:"upper",
 who:"Indian-American, wealthy immigrant family, heavy parental expectation.",
 tags:["Tutor twice a week","Translates every school letter","Sleeps five hours"],
 load:2, tmpl:"long", glasses:true, pal:{H:"#1E1512",S:"#C98B5E",T:"#3B8F55",P:"#33404F",B:"#1B222B"}},
{id:"carlos", name:"CARLOS", cls:"Working-class", tier:"work",
 who:"Mexican-American, both parents work opposite shifts.",
 tags:["Opens the shop before class","Shares one car with three adults","Won't call any office"],
 load:3, tmpl:"cap", pal:{H:"#2A1D14",S:"#C08A5C",T:"#B85325",P:"#2F3E52",B:"#1B222B",A:"#1F4E7A"}},
{id:"chase", name:"CHASE", cls:"Working-class", tier:"work",
 who:"Lakota, reservation poverty, father living with substance use.",
 tags:["70-minute route to school","No internet past the county line","Grandmother holds it together"],
 load:4, tmpl:"long", pal:{H:"#17110D",S:"#B57F52",T:"#1F4E7A",P:"#3A2E22",B:"#1B222B"}},
{id:"isabella", name:"ISABELLA", cls:"Working-class", tier:"work",
 who:"Puerto Rican, single mom, plus-size, severe undiagnosed endometriosis.",
 tags:["Pain dismissed as weight-related","No diagnosis, no 504 plan","Mom can't miss another shift"],
 load:4, tmpl:"long", pal:{H:"#241713",S:"#CE9367",T:"#C4332F",P:"#2F3E52",B:"#1B222B"}},
{id:"marcus", name:"MARCUS", cls:"Poverty", tier:"pov",
 who:"Black, sibling-led household, no parents. Oldest of four.",
 tags:["Raising three siblings","$2.50 for a $3 fare","Youngest needs constant supervision"],
 load:5, tmpl:"base", pal:{H:"#120C09",S:"#8A5A34",T:"#DFA018",P:"#2C3A4C",B:"#1B222B"}},
{id:"lucia", name:"LUCIA", cls:"Poverty", tier:"pov",
 who:"Central American, undocumented, single parent detained last month.",
 tags:["Siblings are 6, 8 and 10","No adult on the emergency card","Cannot ask anyone official"],
 load:5, tmpl:"wrap", pal:{H:"#1A120C",S:"#C08A5C",T:"#3B8F55",P:"#2F3E52",B:"#1B222B",A:"#B85325"}},
{id:"jayson", name:"JAYSON", cls:"Poverty", tier:"pov",
 who:"Black, trans, sibling-led household, in an active mental health crisis.",
 tags:["Deadnamed on every roster","Two younger siblings depend on him","Waitlisted for counseling since fall"],
 load:5, tmpl:"cap", pal:{H:"#120C09",S:"#7E5232",T:"#6C4E96",P:"#2C3A4C",B:"#1B222B",A:"#C4332F"}},
{id:"sophia", name:"SOPHIA", cls:"Poverty", tier:"pov",
 who:"White, sibling-led household, mother in psychiatric crisis.",
 tags:["Mom hasn't gotten up in nine days","Hides it from every teacher","Rent is 11 days late"],
 load:5, tmpl:"long", pal:{H:"#8A6A3E",S:"#EAC099",T:"#7E8B9B",P:"#3A2E22",B:"#1B222B"}}
];
const BY_ID = Object.fromEntries(CAST.map(c => [c.id, c]));
const TIER_LABEL = {upper:"Upper-class", work:"Working-class", pov:"Poverty / crisis"};
const TIER_CLASS = {upper:"c-upper", work:"c-work", pov:"c-pov"};

/* ==========================================================
   3. CHALLENGES
   ========================================================== */
const CHALLENGES = {
homework30: {kind:"quiz", secs:30, diff:1, diffLabel:"Easy", title:"HOMEWORK CHECK",
  brief:"Answer 2 questions before the timer runs out.", need:1, qs:[
  {q:"7 x 8 = ?", opts:["54","56","58"], a:1},
  {q:"Which word is a noun?", opts:["quickly","bridge","became"], a:1}]},
apchem25: {kind:"quiz", secs:25, diff:3, diffLabel:"Tight", title:"AP CHEM, IN THE CAR",
  brief:"Your mother is reading over your shoulder. Both correct or it doesn't count.", need:2, qs:[
  {q:"A solution with pH 3 is\u2026", opts:["basic","acidic","neutral"], a:1},
  {q:"Avogadro's number is closest to\u2026", opts:["6.02 x 10^23","3.14 x 10^8","1.60 x 10^-19"], a:0}]},
translate25: {kind:"quiz", secs:25, diff:3, diffLabel:"Tight", title:"TRANSLATE THE DISTRICT LETTER",
  brief:"Your parents need this before you leave. Get both right.", need:2, qs:[
  {q:"\u201cChronic absenteeism\u201d means\u2026", opts:["a medical condition","missing 10% of school days","a discipline referral"], a:1},
  {q:"\u201cThis notice requires a guardian signature by Friday\u201d means\u2026",
   opts:["someone must sign it by Friday","you may sign it yourself","it is optional"], a:0}]},
shopclock25: {kind:"quiz", secs:25, diff:3, diffLabel:"Tight", title:"CLOSE OUT THE REGISTER",
  brief:"You can't leave until the drawer balances.", need:2, qs:[
  {q:"Drawer holds $128.50. Float is $75. Deposit = ?", opts:["$53.50","$63.50","$203.50"], a:0},
  {q:"Three customers, $4.25 each. Total?", opts:["$12.25","$12.75","$13.25"], a:1}]},
routebus30: {kind:"quiz", secs:30, diff:3, diffLabel:"Tight", title:"KILL 70 MINUTES ON THE BUS",
  brief:"You do the reading on the ride, or it doesn't get done.", need:1, qs:[
  {q:"A treaty is an agreement between\u2026", opts:["two schools","sovereign nations","a buyer and a seller"], a:1},
  {q:"Which is a renewable resource?", opts:["coal","wind","natural gas"], a:1}]},
resources45: {kind:"list", secs:45, diff:5, diffLabel:"Brutal", need:3,
  title:"NAME 3 FREE FOOD RESOURCES", brief:"Real places a kid can walk into today. Separate with commas.",
  placeholder:"food pantry, church on 4th, school breakfast\u2026",
  keys:["pantry","food bank","foodbank","church","mosque","temple","shelter","ymca","community center",
        "rec center","breakfast","free lunch","summer meals","wic","snap","ebt","soup kitchen","library",
        "mutual aid","salvation army","red cross","neighbor","clinic","backpack program"]},
pain60: {kind:"list", secs:60, diff:4, diffLabel:"Heavy", need:3,
  title:"DESCRIBE YOUR SYMPTOMS", brief:"You get one chance to be believed. Separate with commas.",
  placeholder:"cramping, nausea, can't stand upright\u2026",
  keys:["pain","cramp","cramping","nausea","vomit","bleeding","heavy","faint","dizzy","fatigue",
        "back","pelvic","stabbing","sharp","can't stand","cant stand","can't walk","cant walk","exhausted","fever"]},
chaos30: {kind:"rapid", secs:30, diff:5, diffLabel:"Brutal", title:"6 PM, ALL AT ONCE",
  brief:"Answer as fast as they come. There is no right answer, only a cheaper one.", need:3, qs:[
  {q:"The little one is screaming. Dinner is burning.", opts:["Pull the pan off","Pick him up","Keep stirring"]},
  {q:"Your sister's homework is due and she can't read the sheet.", opts:["Read it to her","Tell her to wait","Do it for her"]},
  {q:"The landlord is knocking.", opts:["Don't answer","Answer it","Send a sibling"]},
  {q:"It's 11 PM. Your own assignment is untouched.", opts:["Start it","Sleep","Copy in homeroom"]}]},
keepit30: {kind:"quiz", secs:30, diff:4, diffLabel:"Heavy", title:"ACT NORMAL IN HOMEROOM",
  brief:"Every answer has to sound like nothing is wrong.", need:2, qs:[
  {q:"\u201cHow's your mom doing?\u201d", opts:["\u201cShe's good, working a lot.\u201d","\u201cI don't want to talk about it.\u201d","\u201cShe hasn't gotten up in nine days.\u201d"], a:0},
  {q:"\u201cYou missed the permission slip again.\u201d", opts:["\u201cI'll bring it tomorrow.\u201d","\u201cNobody can sign it.\u201d","Say nothing"], a:0}]},
hotspot30: {kind:"quiz", secs:30, diff:4, diffLabel:"Heavy", title:"ONE BAR OF SIGNAL",
  brief:"Get the assignment submitted before the connection drops.", need:1, qs:[
  {q:"Upload fails at 80%. Best move?", opts:["Retry the same file","Send a photo of the pages","Give up"], a:1},
  {q:"Portal says \u201cdue 11:59 PM\u201d and it's 11:52.", opts:["Submit what you have","Finish it properly","Email tomorrow"], a:0}]}
};

/* ==========================================================
   4. DILEMMAS  (round -> character id)
   ========================================================== */
const A = (k,t,cost,ic,extra) => Object.assign({k:k,t:t,cost:cost,icon:ic}, extra);
const DILEMMAS = {
1:{
 david:{sit:"Your parents can drive you. They also want to drop your brother at soccer first. First bell is 8:30.", choices:[
  A("A","Ask them to skip the soccer drop-off","Your brother sulks. That is the entire cost.","car",
    {chal:"homework30",
     pass:{st:"in",say:"You are in your seat by 8:20 with your homework done in the car."},
     fail:{st:"in",say:"You blank on the second question. Your dad runs the front office. Nobody writes it down."}}),
  A("B","Ride along and walk in five minutes late","Five minutes.","clock",
    {auto:{st:"in",say:"The office waves you through without looking up. No tardy is recorded."}}),
  A("C","Your parents manage both, perfectly","Nothing.","check",
    {auto:{st:"in",say:"Soccer, then school, then a bagel. You arrive early enough to be bored."}})]},
 alejandra:{sit:"The driver leaves at 7:15. Your mother wants last night's AP chem lab reviewed in the car. Your hands are shaking.", choices:[
  A("A","Review the lab in the car","Your morning belongs to her.","book",
    {chal:"apchem25",
     pass:{st:"in",say:"Both correct. She nods once and goes back to her phone. You are on time."},
     fail:{st:"strug",say:"One wrong. She says nothing the rest of the ride. You are present and already behind in your own head."}}),
  A("B","Tell her you'll do it at lunch","Nine texts before first period.","clock",
    {auto:{st:"in",say:"You arrive rested. Your phone buzzes nine times before first period."}}),
  A("C","Skip breakfast and finish everything","You eat nothing until 2 PM.","warn",
    {auto:{st:"strug",say:"The lab is perfect. You are in school, shaking, running on nothing."}})]},
 priya:{sit:"A district letter needs translating for your parents before you leave. Your tutor wants last night's problem set checked. You have 25 minutes.", choices:[
  A("A","Translate the letter, skip the set","Your tutor reports it to your father.","book",
    {chal:"translate25",
     pass:{st:"in",say:"Your parents understand the deadline. You are on time and quietly proud."},
     fail:{st:"strug",say:"You miss a line about the signature. Your father signs nothing. You are in school, worrying."}}),
  A("B","Do the set, leave the letter on the counter","An enrollment deadline passes.","warn",
    {auto:{st:"strug",say:"The set is flawless. The letter sits unread until Friday. Something lapses that nobody explains to you."}}),
  A("C","Both. Get up at 4:40.","Four hours of sleep.","clock",
    {auto:{st:"strug",say:"You do all of it. You are in school, on time, and cannot keep your eyes open."}})]},
 carlos:{sit:"You open the shop at 6. Your dad's shift ended at 5:30 and the car isn't back. School is 40 minutes on foot.", choices:[
  A("A","Wait ten minutes for the car, close out the register","Ten minutes you don't have.","car",
    {chal:"shopclock25",
     pass:{st:"strug",say:"The drawer balances, the car pulls in, you slide into second period. Tardy #4 this month."},
     fail:{st:"strug",say:"The drawer is short. You leave anyway. Tardy #4, and you'll hear about the register tonight."}}),
  A("B","Lock up early and walk","The shop loses the morning rush.","walk",
    {auto:{st:"strug",say:"You walk in at 9:05. Tardy. Your mother finds the shop closed and understands exactly why."}}),
  A("C","Stay until your dad is back","The whole day.","home",
    {auto:{st:"out",say:"He gets back at 10:40. There is no point going in now."}})]},
 chase:{sit:"The route bus is 70 minutes, if it runs. Your dad took the truck last night and hasn't come back.", choices:[
  A("A","Take the route bus and read on the way","70 minutes each way.","bus",
    {chal:"routebus30",
     pass:{st:"in",say:"You finish the reading somewhere past the second cattle gate. You make first bell."},
     fail:{st:"strug",say:"You doze off over the book. You make first bell with nothing prepared."}}),
  A("B","Ask your grandmother's neighbor for a ride","You owe someone now.","car",
    {auto:{st:"in",say:"He drops you at the flagpole at 8:12 and won't take gas money. You are in."}}),
  A("C","Go look for the truck first","The morning.","warn",
    {auto:{st:"out",say:"You find the truck. You do not find your dad. It is 11 AM."}})]},
 isabella:{sit:"Bad pain day. You can barely stand upright. Your mom already left; she cannot miss another shift.", choices:[
  A("A","Go anyway and try to get someone to believe you","The whole day, spent on staying upright.","walk",
    {chal:"pain60",
     pass:{st:"strug",say:"You name every symptom clearly. The nurse writes \u201ccramps\u201d and sends you back to class. You stay, in pain, all day."},
     fail:{st:"strug",say:"You can't get the words out fast enough. The nurse suggests losing weight. You go back to class."}}),
  A("B","Stay home","An unexcused absence. Your fifth.","home",
    {auto:{st:"out",say:"You lie on the bathroom floor until 2 PM. The absence is marked unexcused."}}),
  A("C","Call the nurse advice line","Forty minutes on hold.","clock",
    {auto:{st:"strug",say:"\u201cThis is likely weight-related. Try walking more.\u201d You go in late with nothing."}})]},
 marcus:{sit:"You and three younger siblings. $2.50 for fares that cost $3 each. The youngest won't put his shoes on.", choices:[
  A("A","All take the bus; one of you stays home","One sibling loses the day.","bus",
    {chal:"resources45",
     pass:{st:"strug",say:"You get three of you there by 8:50. Your youngest is home alone with a plan and a phone number."},
     fail:{st:"out",say:"You can't name a single place to send him. You take everyone back inside."}}),
  A("B","Walk it. Ninety minutes. Everyone late.","Ninety minutes and four tardies.","walk",
    {chal:"resources45",
     pass:{st:"strug",say:"Four of you walk in at 9:20. Four tardies. Everyone is in a building."},
     fail:{st:"out",say:"The youngest sits down in the road at minute forty and will not get up."}}),
  A("C","Leave the youngest home alone","A risk you cannot take back.","warn",
    {auto:{st:"strug",say:"You get to school at 8:35. You check your phone eleven times before lunch."}}),
  A("D","Everybody stays home","Four absences.","home",
    {auto:{st:"out",say:"You keep all four of them safe and none of you sees a classroom."}})]},
 lucia:{sit:"Your mom did not come home from her night shift. Your siblings are 6, 8 and 10. No money, no adult you are allowed to call.",
  note:"There is no challenge here. There is nothing to win.", choices:[
  A("A","Go to school and leave them","A 6-year-old alone all day.","walk",
    {auto:{st:"out",say:"You get to the corner and turn around. You cannot make your feet do it."}}),
  A("B","Stay home with them","Everyone is out of school.","home",
    {auto:{st:"out",say:"You make cereal, lock the door, and count the hours. Everyone is safe. Nobody is in school."}}),
  A("C","Go look for your mom","The 10-year-old is now in charge.","warn",
    {auto:{st:"out",say:"You don't know which facility. You don't have anyone you can ask. You come home at noon with nothing."}})]},
 jayson:{sit:"You didn't sleep. The roster still has your old name on it. Two siblings need walking to the elementary door.", choices:[
  A("A","Walk them, then go in","Being called the wrong name for six hours.","walk",
    {auto:{st:"strug",say:"Both siblings are in by 8:15. You sit through attendance being read wrong and say nothing."}}),
  A("B","Walk them, then go home","One more absence.","home",
    {auto:{st:"out",say:"You get them to the door, then go back and sleep until three."}}),
  A("C","Ask the front office for help","A form and a wait.","clock",
    {auto:{st:"strug",say:"The counselor covers four schools. Next opening: three weeks. You are marked present. Nothing else changes."}})]},
 sophia:{sit:"Your mom hasn't left her room in nine days. If anyone finds out, you and your brother get separated.", choices:[
  A("A","Get your brother in, go in, say nothing","Six hours of acting.","check",
    {chal:"keepit30",
     pass:{st:"strug",say:"You give the right answers to every question. Nobody looks twice. You are in school and completely alone in it."},
     fail:{st:"out",say:"You freeze on the permission slip question. The teacher walks you to the office. The day goes elsewhere."}}),
  A("B","Stay home and keep her drinking water","A day.","home",
    {auto:{st:"out",say:"You get her to take three sips. Nobody at school knows why you're gone."}}),
  A("C","Tell a teacher","The thing you are most afraid of.","warn",
    {auto:{st:"out",say:"A report is filed within the hour. You spend the day in an office, not a classroom."}})]}
},
2:{
 david:{sit:"Debate club, a chapter of history, and a friend waiting on FaceTime. You have four hours before sleep.", choices:[
  A("A","Skip debate club","One club meeting.","clock",
    {auto:{st:"in",say:"Homework by nine, FaceTime until eleven, eight hours of sleep."}}),
  A("B","Do the homework late and lose an hour of sleep","One hour.","book",
    {auto:{st:"in",say:"You're tired in first period tomorrow. That is the worst of it."}}),
  A("C","Your parents hired a tutor. Do all three.","Nothing.","star",
    {auto:{st:"in",say:"The tutor arrives at six and leaves at seven with the chapter outlined for you. Everything fits."}})]},
 alejandra:{sit:"Two hours of test prep are scheduled. You have a headache that started Tuesday and hasn't stopped.", choices:[
  A("A","Do the full two hours","Your evening, and the headache.","book",
    {auto:{st:"strug",say:"You finish at 10:40 and lie awake until two. Everything is done. Nothing is okay."}}),
  A("B","Tell them you need to sleep","A conversation at breakfast.","home",
    {auto:{st:"in",say:"You sleep nine hours for the first time in a month. Nobody says anything at breakfast, which is its own kind of saying something."}}),
  A("C","Do the prep and hide the headache","Both.","warn",
    {auto:{st:"strug",say:"Nobody in the house knows you've had a headache for four days."}})]},
 priya:{sit:"Tutor at six, your own homework after, and a school voicemail nobody but you can understand.", choices:[
  A("A","Tutor, homework, voicemail. In that order.","Sleep.","book",
    {chal:"hotspot30",
     pass:{st:"in",say:"Submitted at 11:58. You translate the voicemail for your mother at midnight."},
     fail:{st:"strug",say:"The upload dies at 11:59. You'll take the late penalty and explain it to nobody."}}),
  A("B","Skip the tutor and sleep","Your father hears about it.","clock",
    {auto:{st:"in",say:"Eight hours. Your father is told you cancelled. It comes up on Sunday."}}),
  A("C","All of it, plus your brother's science fair board","Everything.","warn",
    {auto:{st:"strug",say:"You go to bed at 1:50 AM. The board looks great."}})]},
 carlos:{sit:"The shop needs closing at seven. Your homework is untouched. Your dad is asleep before you get home.", choices:[
  A("A","Close the shop, homework at eleven","Sleep, again.","home",
    {chal:"shopclock25",
     pass:{st:"strug",say:"Drawer balanced, two of four assignments done. You sleep four hours."},
     fail:{st:"strug",say:"You give up on the math at midnight. Two of four done."}}),
  A("B","Skip the shift and do the work","Your mother covers the hours.","book",
    {auto:{st:"in",say:"Everything is done and turned in. Your mother worked until nine to make that possible and neither of you mentions it."}}),
  A("C","Both, badly","Both, badly.","warn",
    {auto:{st:"strug",say:"You do half of each. The shop is fine. The homework is not."}})]},
 chase:{sit:"70 minutes home. There is no internet past the county line, and the assignment is online.", choices:[
  A("A","Ride home and do what you can offline","The half you can't submit.","bus",
    {auto:{st:"strug",say:"You write it out longhand. There is no way to upload it before midnight."}}),
  A("B","Stay at school until six for the wifi","The last bus.","warn",
    {auto:{st:"out",say:"The assignment uploads at 5:58. The last bus left at 5:40. You are 31 miles from your bed."}}),
  A("C","Borrow the hotspot from the library cart","One bar of signal.","clock",
    {chal:"hotspot30",
     pass:{st:"in",say:"Photographed the pages, submitted at 11:57 from the parking lot. It counts."},
     fail:{st:"strug",say:"The upload fails twice and the library closes. You'll ask for an extension you probably won't get."}})]},
 isabella:{sit:"It is a bad pain day and it is only getting worse. The doctors called it weight-related and closed the file. There is no diagnosis, and no healthcare you can reach.", choices:[
  A("A","Get through the evening managing the pain","The evening, and a little more of your health.","heart",
    {chal:"pain60",
     pass:{st:"strug",say:"You name it all precisely: pelvic, stabbing, nausea, can't stand. Nobody with authority hears it. You get through the night and you are worse than yesterday."},
     fail:{st:"strug",say:"You run out of time trying to explain. You get through the night anyway, because that is what you do."}}),
  A("B","Give up on the evening entirely","Homework, dinner, and hope.","home",
    {auto:{st:"out",say:"You go to bed at six and don't get up. Nothing is done. Something in you goes quiet."}}),
  A("C","Tell someone","Being told it again.","warn",
    {auto:{st:"strug",say:"You tell your mom. She cries, and then she goes to work, because the rent is the rent."}})]},
 marcus:{sit:"Pick the youngest up from the elementary school across town. Walk all four of you home by five. Cook. Homework. Bedtime.", choices:[
  A("A","Cook, help with their homework, handle the meltdowns","Your own homework, and sleep.","home",
    {chal:"chaos30",
     pass:{st:"strug",say:"Everyone eats. Everyone's homework is done except yours. You are up at 5:40 tomorrow."},
     fail:{st:"strug",say:"Dinner burns, two of them cry, and it gets done anyway. Yours doesn't."}}),
  A("B","Do your own homework first","Their dinner, their homework, their night.","book",
    {auto:{st:"strug",say:"You finish your assignment. Nobody eats until nine and the little one falls asleep in his clothes."}}),
  A("C","Both. All of it.","Everything you have left.","warn",
    {auto:{st:"out",say:"At 1 AM you are asleep at the kitchen table with the pan still on the stove. Tomorrow does not happen."}})]},
 jayson:{sit:"The dysphoria is crushing today and you are running on nothing. Two younger siblings still need picking up at 3:15.", choices:[
  A("A","Push through it and get them","Everything you have.","walk",
    {auto:{st:"strug",say:"You collect them, feed them, read to the youngest. You hold it together on the outside all evening and none of it on the inside."}}),
  A("B","Tell your sister you can't today","Asking a 12-year-old to cover.","home",
    {auto:{st:"strug",say:"She walks the little one home herself and does not complain, which is somehow worse."}}),
  A("C","Call the crisis line while you walk","Twenty minutes and the truth out loud.","heart",
    {auto:{st:"strug",say:"Someone stays on the line the whole walk. Nothing about tomorrow changes. Tonight is survivable, and that counts."}})]},
 sophia:{sit:"Nine days becomes ten. Your brother is asking questions. Rent was due on the first.", choices:[
  A("A","Cook, do his homework with him, keep the story going","Being eleven years older than you are.","home",
    {chal:"keepit30",
     pass:{st:"strug",say:"He eats, he sleeps, he believes you. You sit in the dark kitchen afterwards for a long time."},
     fail:{st:"out",say:"He asks why mom's door is closed and you don't have an answer left. It comes apart at eight o'clock."}}),
  A("B","Call your aunt in Ohio","The thing that starts the paperwork.","warn",
    {auto:{st:"out",say:"She says she'll drive out Saturday and asks whether she should call someone. You say no. She calls someone."}}),
  A("C","Do nothing and hope","Ten days becomes eleven.","clock",
    {auto:{st:"out",say:"You lie on the floor of your room with headphones on until it's tomorrow."}})]}
},
3:{
 david:{sit:"It's 9 PM. Everything's done. There's a party Friday and a group chat arguing about it.", choices:[
  A("A","Go to bed","Nothing.","home",{auto:{st:"in",say:"Nine hours. You wake up before your alarm."}}),
  A("B","Stay up in the group chat","An hour.","clock",{auto:{st:"in",say:"You're a little tired tomorrow. That's the whole story."}}),
  A("C","Get a head start on next week","Nothing.","star",{auto:{st:"in",say:"You read ahead two chapters. Your teacher will notice on Thursday."}})]},
 alejandra:{sit:"Your mother has laid out a college list on the kitchen table. It's 10:40 PM.", choices:[
  A("A","Sit down and go through it","Another hour awake.","book",{auto:{st:"strug",say:"You agree to everything. You go to bed at midnight with your jaw clenched."}}),
  A("B","Say you'll look tomorrow","A cold morning.","clock",{auto:{st:"in",say:"You sleep. The list is still there at breakfast, exactly where she left it."}}),
  A("C","Tell her the truth about how you're doing","Something you can't unsay.","heart",{auto:{st:"in",say:"She listens for eleven minutes without interrupting. It is not fixed. It is the first crack of light in months."}})]},
 priya:{sit:"Your father wants to talk about your chemistry grade. It is an A minus.", choices:[
  A("A","Promise to bring it up","Another commitment.","book",{auto:{st:"strug",say:"You promise. You add two more hours a week you do not have."}}),
  A("B","Go to sleep mid-conversation","Nothing you'll admit to.","home",{auto:{st:"in",say:"You fall asleep on the couch. He puts a blanket on you and lets it go until Sunday."}}),
  A("C","Ask him what happens if you don't","A very long silence.","warn",{auto:{st:"in",say:"He doesn't have an answer ready. Neither of you sleeps well, but something got said."}})]},
 carlos:{sit:"Your dad's alarm goes off at 4:20 AM for a shift he can barely stand up for. You hear it through the wall.", choices:[
  A("A","Get up and drive him","Ninety minutes of sleep.","car",{auto:{st:"strug",say:"You drop him at the yard at 4:55 and get back into bed at 5:30. Your alarm is at 5:45."}}),
  A("B","Stay in bed","Listening to him leave.","home",{auto:{st:"in",say:"He takes the bus. You sleep. You feel bad about it all day, which costs nothing on paper."}}),
  A("C","Get up and do your homework instead","Sleep, again.","book",{auto:{st:"strug",say:"You do the reading at 4:30 AM at the kitchen table and it is the only quiet hour you get."}})]},
 chase:{sit:"Your dad came back at eleven. Your grandmother is already up, deciding what to do about it.", choices:[
  A("A","Go help her","The night.","heart",{auto:{st:"strug",say:"You sit up with her until two. You are in school tomorrow on four hours of sleep."}}),
  A("B","Stay in your room","Letting her do it alone.","home",{auto:{st:"in",say:"She handles it, the way she has handled it for years. You get a full night and pretend you didn't hear."}}),
  A("C","Call your uncle in Rapid City","A conversation nobody wants.","clock",{auto:{st:"in",say:"He says he'll come Sunday. He has said that before. This time he does."}})]},
 isabella:{sit:"You wake at 2 AM and cannot get back to sleep, or upright. The final assignment is due tomorrow.", choices:[
  A("A","Work through it on the floor","Whatever's left.","book",{auto:{st:"strug",say:"You write eight hundred words lying on the bathroom tile. It is not your best work and it exists."}}),
  A("B","Sleep and turn in nothing","The assignment.","home",{auto:{st:"out",say:"You sleep until noon and wake to a zero and a voicemail about your attendance."}}),
  A("C","Message a friend","Someone knowing.","heart",{auto:{st:"strug",say:"She stays up with you until four and sends you her notes. You submit something. You are still sick."}})]},
 marcus:{sit:"11:40 PM. Three of them asleep. Your assignment is one paragraph long and due at 8.", choices:[
  A("A","Finish it","Sleep.","book",{auto:{st:"strug",say:"Done at 1:20 AM. You're up at 5:40. That's four hours and twenty minutes."}}),
  A("B","Sleep and take the zero","The grade.","home",{auto:{st:"strug",say:"You sleep six hours for the first time in two weeks and take the zero. You needed the sleep more."}}),
  A("C","Wake the 10-year-old to help you","Something you don't want to become.","warn",{auto:{st:"out",say:"You stand in her doorway for a full minute and then let her sleep. Nothing gets finished."}})]},
 jayson:{sit:"The crisis line gave you a number for a clinic that takes walk-ins on Thursdays. It is Tuesday.", choices:[
  A("A","Write the appointment on your hand and get through two more days","Two more days.","heart",{auto:{st:"strug",say:"You make it to Thursday. That is the entire achievement and it is not a small one."}}),
  A("B","Skip it, you can't leave your siblings","Thursday.","home",{auto:{st:"out",say:"There's nobody to cover the 3:15 pickup. The appointment goes to somebody else."}}),
  A("C","Tell your sister where you're going","Saying it out loud.","clock",{auto:{st:"strug",say:"She says \u201cokay\u201d and asks nothing else, and covers Thursday. You go."}})]},
 sophia:{sit:"Someone from the school has left two voicemails. The second one used the word \u201cwelfare check.\u201d", choices:[
  A("A","Call back and hold the story together","Everything you have left.","clock",{auto:{st:"strug",say:"You do a passable impression of a fine household. It buys you a week, maybe."}}),
  A("B","Don't call back","The knock, whenever it comes.","home",{auto:{st:"out",say:"They come Thursday morning. You and your brother are in separate cars by two."}}),
  A("C","Call back and tell the truth","Control over what happens next.","heart",{auto:{st:"strug",say:"You say the actual words out loud to an adult. What happens next is not up to you anymore, and you are so tired that this is almost a relief."}})]}
}};


/* ==========================================================
   5. LOOKUPS
   ========================================================== */
const ORDER = CAST.map(c => c.id);
const ST_LABEL = { in: "IN SCHOOL", strug: "STRUGGLING", out: "OUT OF SCHOOL" };
const ST_CLASS = { in: "b-in", strug: "b-strug", out: "b-out" };
const ST_VAR = { in: "--st-in", strug: "--st-strug", out: "--st-out" };
const ROUND_NAME = {
  1: "MORNING IN THE VILLAGE — GET TO SCHOOL",
  2: "AFTERNOON & EVENING — GET HOME",
  3: "THE NIGHT — MAKE IT TO TOMORROW"
};
const ROUND_KAIA = {
  1: "It's 7 AM. First bell is at 8:30. Everybody in this room has to get to the same building. Nobody starts from the same place.",
  2: "Last bell. Everyone goes home now — to whatever home is. Four hours until sleep, and the homework is due either way.",
  3: "Lights out in the village. Some of you get eight hours. Some of you get the kind of night you don't tell anyone about."
};
const PRIV = {
  david: "Principal's kid — granted an extension before he asked for one.",
  priya: "Parents on the foundation board — given a buffer, quietly.",
  alejandra: "Family donates the gym scoreboard — nobody was going to mark her late."
};
const TARDY_WHY = {
  isabella: "She was in pain before the music started and nobody adjusted anything.",
  marcus: "He was carrying three other people the whole game and it finally showed.",
  carlos: "He came straight from a shift and had nothing left in his legs.",
  chase: "He'd been travelling for 70 minutes before this even started.",
  jayson: "He was running on no sleep and a crisis nobody at school knew about.",
  sophia: "She was watching the door the entire time, waiting for someone to come asking.",
  priya: "Even the buffer ran out this time.",
  alejandra: "She stopped, for once, and it cost her.",
  david: "For the first time all game, something didn't go his way."
};
const INDEX = [
  ["01", "Title / intro", "title"], ["02", "Setup — class size", "setup"],
  ["03", "Character assignment", "cast"], ["04", "Round intro", "intro"],
  ["05", "Dilemma — David (easy)", "dilemma", "david"],
  ["06", "Dilemma — Marcus (impossible)", "dilemma", "marcus"],
  ["07", "Challenge — timed", "challenge", "marcus"],
  ["08", "Outcome — Lucia", "outcome", "lucia"],
  ["09", "Round results", "results"], ["10", "Voting", "vote"], ["11", "Vote result", "voteres"],
  ["12", "Final — homework", "homework"], ["13", "Final — musical chairs", "music"],
  ["14", "Final — tardy", "tardy"], ["15", "Debrief", "debrief"]
];
const CROWD_ODDS = { upper: [0.88, 0.12, 0.0], work: [0.34, 0.45, 0.21], pov: [0.1, 0.38, 0.52] };

/* ==========================================================
   6. PURE GAME LOGIC  (operates on a plain state object)
   ========================================================== */
function newGame(classSize) {
  const g = {
    phase: "title", classSize, round: 1, qi: 0,
    roster: {}, crowd: [], pending: null, chal: null,
    voteSel: null, tally: null, eliminated: null,
    drew: false, tardy: null, musicT: 0
  };
  CAST.forEach(c => { g.roster[c.id] = { st: "in", hist: [], outRound: null, why: "" }; });
  const mix = ["upper", "upper", "upper", "work", "work", "work", "pov", "pov", "pov", "pov"];
  const n = Math.max(0, classSize - CAST.length);
  g.crowd = Array.from({ length: n }, (_, i) => ({ tier: mix[i % mix.length], st: "in" }));
  return g;
}
const alive = g => CAST.filter(c => g.roster[c.id].st !== "out");
const dead = g => CAST.filter(c => g.roster[c.id].st === "out");
const dilemmaFor = (g, id) => (DILEMMAS[g.round] || {})[id];
function counts(g) {
  const c = { in: 0, strug: 0, out: 0 };
  CAST.forEach(x => c[g.roster[x.id].st]++);
  g.crowd.forEach(x => c[x.st]++);
  return c;
}
function stepCrowd(g) {
  g.crowd.forEach(p => {
    if (p.st === "out") return;
    const o = CROWD_ODDS[p.tier], r = Math.random();
    p.st = r < o[0] ? "in" : r < o[0] + o[1] ? "strug" : "out";
  });
}
function tierStats(g) {
  const t = { upper: { in: 0, strug: 0, out: 0, n: 0 }, work: { in: 0, strug: 0, out: 0, n: 0 },
              pov: { in: 0, strug: 0, out: 0, n: 0 } };
  CAST.forEach(c => { t[c.tier][g.roster[c.id].st]++; t[c.tier].n++; });
  g.crowd.forEach(p => { t[p.tier][p.st]++; t[p.tier].n++; });
  return t;
}
function applyOutcome(g, ch, choice, out, chalNote) {
  const r = g.roster[ch.id];
  r.st = out.st;
  r.hist.push({ round: g.round, k: choice.k, st: out.st, say: out.say });
  if (out.st === "out" && r.outRound === null) {
    r.outRound = g.round;
    r.why = "Round " + g.round + " — chose: " + choice.t;
  }
  g.pending = { id: ch.id, k: choice.k, title: choice.t, say: out.say, st: out.st, chalNote };
  g.phase = "outcome";
}
function scoreChallenge(g, listText) {
  const t = g.chal, def = t.def;
  if (def.kind === "quiz") {
    let ok = 0;
    def.qs.forEach((q, i) => { if (t.answers[i] === q.a) ok++; });
    return ok >= def.need;
  }
  if (def.kind === "list") {
    const raw = (listText || "").toLowerCase();
    const toks = raw.split(/[,\n;]+/).map(s => s.trim()).filter(s => s.length >= 3);
    const hits = def.keys.filter(k => raw.indexOf(k) >= 0).length;
    return Math.max(toks.length, hits) >= def.need;
  }
  return t.step >= def.need;
}
function challengeNote(def, t, passed) {
  if (def.kind === "list")
    return passed ? "You named enough of them in time."
                  : "You ran out of time before you had " + def.need + ".";
  if (def.kind === "rapid")
    return passed ? "You handled " + t.step + " of " + def.qs.length + " before the clock ran out."
                  : "You got through " + t.step + " of " + def.qs.length + ". The rest happened without you.";
  return passed ? "Challenge passed."
                : "Challenge failed — and notice what that does and doesn't cost you.";
}
function runVote(g) {
  const living = alive(g);
  const weight = ch => {
    const r = g.roster[ch.id];
    let w = 1;
    if (r.st === "strug") w += 2.6;
    if (ch.tier === "pov") w += 2.2;
    if (ch.tier === "work") w += 0.9;
    if (ch.tier === "upper") w -= 0.55;
    return Math.max(0.15, w);
  };
  const tally = living.map(ch => ({ id: ch.id, n: 0 }));
  const idx = Object.fromEntries(tally.map((t, i) => [t.id, i]));
  tally[idx[g.voteSel]].n = 1;
  const pool = living.map(ch => ({ id: ch.id, w: weight(ch) }));
  const total = pool.reduce((a, b) => a + b.w, 0);
  for (let v = 0; v < living.length - 1; v++) {
    let r = Math.random() * total, pick = pool[0].id;
    for (const p of pool) { r -= p.w; if (r <= 0) { pick = p.id; break; } }
    tally[idx[pick]].n++;
  }
  tally.sort((a, b) => b.n - a.n || weight(BY_ID[b.id]) - weight(BY_ID[a.id]));
  g.tally = tally;
  g.eliminated = tally[0].id;
  const r = g.roster[g.eliminated];
  r.st = "out"; r.outRound = g.round; r.why = "Voted out in Round " + g.round;
  r.hist.push({ round: g.round, k: "—", st: "out", say: "Voted out by the surviving families." });
  g.phase = "voteres";
}
function pickTardy(g) {
  const pool0 = alive(g).filter(c => !PRIV[c.id]);
  const pool = pool0.length ? pool0 : alive(g);
  const score = c => c.load + (g.roster[c.id].st === "strug" ? 1.5 : 0);
  const last = pool.slice().sort((a, b) => score(b) - score(a))[0];
  g.tardy = last.id;
  const r = g.roster[last.id];
  r.st = "out"; r.outRound = 4; r.why = "Final round — tardy";
  r.hist.push({ round: 4, k: "—", st: "out", say: "Last one in when the music stopped." });
}
function seedMid(classSize, round) {
  const g = newGame(classSize);
  g.round = round || 2;
  const pick = (id, want) => {
    const cs = DILEMMAS[1][id].choices;
    for (const c of cs) if (c.auto && c.auto.st === want) return { k: c.k, say: c.auto.say };
    for (const c of cs) if (c.pass && c.pass.st === want) return { k: c.k, say: c.pass.say };
    for (const c of cs) if (c.fail && c.fail.st === want) return { k: c.k, say: c.fail.say };
    return { k: "A", say: "Made it in, at a cost nobody recorded." };
  };
  ["lucia", "jayson"].forEach(id => {
    g.roster[id].st = "out"; g.roster[id].outRound = 1;
    g.roster[id].why = "Round 1 — every option led out";
    g.roster[id].hist.push({ round: 1, k: "B", st: "out", say: DILEMMAS[1][id].choices[1].auto.say });
  });
  ["marcus", "isabella", "carlos", "sophia"].forEach(id => {
    g.roster[id].st = "strug";
    const o = pick(id, "strug");
    g.roster[id].hist.push({ round: 1, k: o.k, st: "strug", say: o.say });
  });
  ["david", "alejandra", "priya", "chase"].forEach(id => {
    const o = pick(id, "in");
    g.roster[id].hist.push({ round: 1, k: o.k, st: "in", say: o.say });
  });
  stepCrowd(g);
  return g;
}

/* ==========================================================
   7. PRIMITIVES
   ========================================================== */
const RM = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const v = n => (typeof getComputedStyle === "undefined" ? "" :
  getComputedStyle(document.documentElement).getPropertyValue(n).trim());

/** Bumps a counter whenever the viewer's theme changes, so canvases repaint. */
function useThemeTick() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick(t => t + 1);
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener && mq.addEventListener("change", bump);
    const mo = new MutationObserver(bump);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { mq.removeEventListener && mq.removeEventListener("change", bump); mo.disconnect(); };
  }, []);
  return tick;
}
const ThemeCtx = React.createContext(0);

function Sprite({ id, px = 3, ghost = false, style }) {
  const ref = useRef(null);
  const tick = React.useContext(ThemeCtx);
  useEffect(() => {
    const ch = BY_ID[id];
    if (ref.current && ch) drawSprite(ref.current, ch, { px, ghost });
  }, [id, px, ghost, tick]);
  return <canvas ref={ref} role="img" style={style}
    aria-label={(ghost ? "Pixel ghost of " : "Pixel portrait of ") + (BY_ID[id] ? BY_ID[id].name : id)} />;
}
function Icon({ name, px = 2, color, style, className }) {
  const ref = useRef(null);
  const tick = React.useContext(ThemeCtx);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.innerHTML = "";
    const col = color ? (color.startsWith("--") ? v(color) : color) : getComputedStyle(host).color;
    host.appendChild(icon(name, px, col, v("--panel")));
  }, [name, px, color, tick]);
  return <span ref={ref} aria-hidden="true" className={className} style={style} />;
}
const Badge = ({ st, label }) => (
  <span className={"badge " + ST_CLASS[st]}><Icon name={iconFor(st)} />{label || ST_LABEL[st]}</span>
);
const Kaia = ({ children }) => (
  <div className="kaia"><span className="kaia-who">KAIA</span><p className="kaia-say">{children}</p></div>
);
const Screen = ({ title, right, children }) => (
  <div className="screen">
    <div className="chrome"><span className="chrome-dot" />{title}
      <span className="chrome-right">{right}</span></div>
    <div className="pad">{children}</div>
  </div>
);
const Actions = ({ children }) => <div className="actions">{children}</div>;

function Dash({ g, now }) {
  const c = counts(g), total = g.classSize;
  const pct = k => (total ? (c[k] / total) * 100 : 0);
  return (
    <aside className="dash">
      <div className="dash-head">CLASS STATUS &mdash; ROUND {g.round}</div>
      <div className="dash-body">
        <div className="tally">
          <div className="tally-cell b-in"><div className="tally-n">{c.in}</div><div className="tally-l">In</div></div>
          <div className="tally-cell b-strug"><div className="tally-n">{c.strug}</div><div className="tally-l">Strug</div></div>
          <div className="tally-cell b-out"><div className="tally-n">{c.out}</div><div className="tally-l">Out</div></div>
        </div>
        <div className="bar" role="img"
          aria-label={`${c.in} in school, ${c.strug} struggling, ${c.out} out, of ${total}`}>
          <span style={{ width: pct("in") + "%", background: v("--st-in") }} />
          <span style={{ width: pct("strug") + "%", background: v("--st-strug") }} />
          <span style={{ width: pct("out") + "%", background: v("--st-out") }} />
        </div>
        <ul className="roster">
          {CAST.map(ch => {
            const r = g.roster[ch.id], out = r.st === "out";
            return (
              <li key={ch.id} className={"rrow" + (out ? " is-out" : "") + (now === ch.id ? " is-now" : "")}>
                <Sprite id={ch.id} px={2} ghost={out} />
                <span className="rrow-name">{ch.name}</span>
                <Icon name={iconFor(r.st)} className="rrow-dot" color={ST_VAR[r.st]} />
                <span className="sr">{ST_LABEL[r.st]}</span>
              </li>
            );
          })}
        </ul>
        {g.crowd.length > 0 && (
          <div className="crowd">
            <div className="crowd-l">Other families ({g.crowd.length})</div>
            <div className="crowd-grid" role="img" aria-label={`Status of ${g.crowd.length} other students`}>
              {g.crowd.map((p, i) => <i key={i} style={{ background: v(ST_VAR[p.st]) }} title={ST_LABEL[p.st]} />)}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
const Layout = ({ g, now, children }) => (
  <div className="layout"><div>{children}</div><Dash g={g} now={now} /></div>
);

/* ambient pixel sky: drifting clouds by day, dusk stars in dark mode */
function Sky() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const SC = 6; let clouds = [], stars = [], raf = 0;
    const isDark = () => {
      const t = document.documentElement.getAttribute("data-theme");
      return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    };
    const setup = () => {
      cv.width = Math.max(1, Math.ceil(innerWidth / SC));
      cv.height = Math.max(1, Math.ceil(innerHeight / SC));
      clouds = Array.from({ length: 9 }, () => ({
        x: Math.random() * cv.width, y: 6 + Math.random() * (cv.height * 0.62),
        w: 12 + Math.floor(Math.random() * 20), h: 3 + Math.floor(Math.random() * 3),
        v: 0.05 + Math.random() * 0.12
      }));
      stars = Array.from({ length: 70 }, () => ({
        x: Math.floor(Math.random() * cv.width), y: Math.floor(Math.random() * cv.height),
        p: Math.random() * 100
      }));
    };
    const draw = () => {
      const g2 = cv.getContext("2d"), w = cv.width, h = cv.height;
      g2.imageSmoothingEnabled = false;
      g2.fillStyle = v("--sky-canvas"); g2.fillRect(0, 0, w, h);
      if (isDark()) {
        stars.forEach(s => {
          s.p += 0.7;
          g2.fillStyle = Math.sin(s.p / 22) > -0.4 ? v("--cloud") : v("--cloud-2");
          g2.fillRect(s.x, s.y, 1, 1);
        });
      } else {
        clouds.forEach(c => {
          if (!RM) c.x += c.v;
          if (c.x > w + c.w) c.x = -c.w;
          g2.fillStyle = v("--cloud-2");
          g2.fillRect(Math.round(c.x), Math.round(c.y) + c.h, c.w, 2);
          g2.fillStyle = v("--cloud");
          g2.fillRect(Math.round(c.x), Math.round(c.y), c.w, c.h);
          g2.fillRect(Math.round(c.x) + 3, Math.round(c.y) - 2, c.w - 7, 2);
        });
      }
      raf = requestAnimationFrame(draw);
    };
    setup(); draw();
    addEventListener("resize", setup);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", setup); };
  }, []);
  return <canvas id="sky" ref={ref} aria-hidden="true" />;
}

/* ==========================================================
   8. THE GAME
   ========================================================== */
export default function MrSystem({ initialClassSize = 40 }) {
  const themeTick = useThemeTick();
  const [g, setG] = useState(() => newGame(initialClassSize));
  const [showIndex, setShowIndex] = useState(false);
  const [listText, setListText] = useState("");
  const listRef = useRef("");
  listRef.current = listText;

  const update = useCallback(fn => setG(prev => {
    const n = structuredClone(prev);
    fn(n);
    return n;
  }), []);
  const go = useCallback(p => update(n => { n.phase = p; }), [update]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }); }, [g.phase, g.qi]);

  /* ---- round flow ---- */
  const nextQuestion = () => update(n => {
    let i = n.qi;
    while (i < CAST.length && n.roster[CAST[i].id].st === "out") i++;
    n.qi = i;
    if (i >= CAST.length) { stepCrowd(n); n.phase = "results"; } else n.phase = "dilemma";
  });
  const advance = () => update(n => {
    let i = n.qi + 1;
    while (i < CAST.length && n.roster[CAST[i].id].st === "out") i++;
    n.qi = i;
    if (i >= CAST.length) { stepCrowd(n); n.phase = "results"; } else n.phase = "dilemma";
  });
  const choose = i => {
    setListText("");
    update(n => {
      const ch = CAST[n.qi], c = dilemmaFor(n, ch.id).choices[i];
      if (c.auto) { applyOutcome(n, ch, c, c.auto, null); return; }
      n.chal = { def: CHALLENGES[c.chal], left: CHALLENGES[c.chal].secs,
                 answers: {}, step: 0, choice: c, chId: ch.id };
      n.phase = "challenge";
    });
  };
  const finishChallenge = (n, passed) => {
    const t = n.chal, def = t.def, out = passed ? t.choice.pass : t.choice.fail;
    const note = challengeNote(def, t, passed);
    const ch = BY_ID[t.chId];
    n.chal = null;
    applyOutcome(n, ch, t.choice, out, note);
  };
  const submitChallenge = () => update(n => finishChallenge(n, scoreChallenge(n, listRef.current)));

  /* ---- challenge countdown ---- */
  const chalKey = g.chal ? g.qi + ":" + g.chal.def.title : "";
  useEffect(() => {
    if (g.phase !== "challenge") return undefined;
    const id = setInterval(() => {
      setG(prev => {
        if (prev.phase !== "challenge" || !prev.chal) return prev;
        const n = structuredClone(prev);
        n.chal.left -= 1;
        if (n.chal.left <= 0) finishChallenge(n, scoreChallenge(n, listRef.current));
        return n;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [g.phase, chalKey]);

  /* ---- musical chairs countdown ---- */
  useEffect(() => {
    if (g.phase !== "music") return undefined;
    const id = setInterval(() => {
      setG(prev => {
        if (prev.phase !== "music") return prev;
        const n = structuredClone(prev);
        n.musicT -= 1;
        if (n.musicT < 0) { pickTardy(n); n.phase = "tardy"; }
        return n;
      });
    }, RM ? 400 : 700);
    return () => clearInterval(id);
  }, [g.phase]);

  const jumpTo = (p, id) => {
    setShowIndex(false);
    setListText("");
    setG((size => {
      if (p === "title" || p === "setup" || p === "cast") { const n = newGame(size); n.phase = p; return n; }
      if (p === "intro") { const n = seedMid(size, 2); n.phase = "intro"; return n; }
      if (p === "dilemma") {
        const n = seedMid(size, 1); n.round = 1; n.qi = ORDER.indexOf(id || "david");
        n.roster[id || "david"].st = "in"; n.phase = "dilemma"; return n;
      }
      if (p === "challenge") {
        const n = seedMid(size, 1); n.round = 1; n.qi = ORDER.indexOf("marcus");
        n.roster.marcus.st = "in";
        const c = DILEMMAS[1].marcus.choices[0];
        n.chal = { def: CHALLENGES[c.chal], left: CHALLENGES[c.chal].secs, answers: {}, step: 0, choice: c, chId: "marcus" };
        n.phase = "challenge"; return n;
      }
      if (p === "outcome") {
        const n = seedMid(size, 1); n.round = 1;
        const c = DILEMMAS[1].lucia.choices[1];
        n.pending = { id: "lucia", k: "B", title: c.t, say: c.auto.say, st: "out",
                      chalNote: "There was no challenge. There was nothing to win." };
        n.phase = "outcome"; return n;
      }
      if (p === "results") { const n = seedMid(size, 1); n.round = 1; n.phase = "results"; return n; }
      if (p === "vote") { const n = seedMid(size, 1); n.round = 1; n.voteSel = "marcus"; n.phase = "vote"; return n; }
      if (p === "voteres") { const n = seedMid(size, 1); n.round = 1; n.voteSel = "marcus"; runVote(n); return n; }
      const n = seedMid(size, 3);
      n.round = 4;
      ["marcus", "sophia"].forEach(x => {
        n.roster[x].st = "out"; n.roster[x].outRound = 2; n.roster[x].why = "Voted out in Round 2";
      });
      if (p === "debrief") {
        n.roster.carlos.st = "out"; n.roster.carlos.outRound = 3;
        n.roster.carlos.why = "Round 3 — chose the shift";
        pickTardy(n); n.phase = "debrief"; return n;
      }
      n.drew = p !== "homework";
      n.musicT = 12;
      if (p === "tardy") pickTardy(n);
      n.phase = p;
      return n;
    })(g.classSize));
  };

  /* ---------------- screens ---------------- */
  const c = counts(g);
  const living = alive(g), ghosts = dead(g);

  const Title = () => (
    <Screen title="BOOT" right="v1.0">
      <p className="eyebrow">A GAME FOR 30&ndash;60 STUDENTS</p>
      <h1 className="screen-title"
        style={{ fontSize: "clamp(20px,7vw,40px)", textShadow: "4px 4px 0 " + v("--clay") }}>MR. SYSTEM</h1>
      <p style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, lineHeight: 2,
                  color: v("--ink-2"), marginBottom: 20 }}>
        A GAME ABOUT SYSTEMIC INEQUALITY<br />IN EDUCATION</p>
      <p style={{ maxWidth: "56ch", fontSize: 16 }}>
        You are a student trying to get to school, get home, and make it to tomorrow. Your choices
        matter &mdash; but so do the systems built long before you got here.</p>
      <p style={{ maxWidth: "56ch", fontSize: 16, marginTop: 14, color: v("--ink-2") }}>
        Three rounds. A vote after each one. Then homework is due and the music starts. Roughly 20 minutes.</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "26px 0 6px" }}>
        {CAST.map(x => <Sprite key={x.id} id={x.id} px={3} />)}
      </div>
      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: v("--ink-3"), letterSpacing: ".04em" }}>
        TEN FAMILIES. THE SAME FIRST BELL.</p>
      <Actions>
        <button className="btn" onClick={() => go("setup")}>START GAME</button>
        <button className="btn btn-ghost" onClick={() => setShowIndex(true)}>SCREEN INDEX</button>
      </Actions>
    </Screen>
  );

  const Setup = () => (
    <Screen title="SETUP" right="class size">
      <p className="eyebrow">STEP 1 OF 2</p>
      <h2 className="screen-title">HOW MANY STUDENTS<br />ARE IN THE ROOM?</h2>
      <p style={{ maxWidth: "58ch", color: v("--ink-2") }}>
        Ten families are played by hand. Everyone else is grouped into families in the background and their
        outcomes are resolved by the same rules.</p>
      <div className="setup-row">
        <div className="stepper">
          <button aria-label="Fewer students"
            onClick={() => setG(newGame(Math.max(30, g.classSize - 5)))}>&minus;</button>
          <output>{g.classSize}</output>
          <button aria-label="More students"
            onClick={() => setG(newGame(Math.min(60, g.classSize + 5)))}>+</button>
        </div>
        <span className="pill">PLAYED BY HAND <b>{CAST.length}</b></span>
        <span className="pill">BACKGROUND <b>{g.classSize - CAST.length}</b></span>
        <span className="pill">FAMILY GROUPS <b>{Math.ceil(g.classSize / 5)}</b></span>
      </div>
      <p className="hint">Range 30&ndash;60. Groups of five.</p>
      <Actions>
        <button className="btn" onClick={() => go("cast")}>MEET THE FAMILIES</button>
        <span className="spacer" />
        <button className="btn btn-ghost" onClick={() => go("title")}>BACK</button>
      </Actions>
    </Screen>
  );

  const CastScreen = () => (
    <Screen title="CHARACTER ASSIGNMENT" right={`${g.classSize} students`}>
      <p className="eyebrow">STEP 2 OF 2</p>
      <h2 className="screen-title">WHO ARE YOU?</h2>
      <Kaia>Your character decides what your morning looks like before you make a single choice. Some of you
        have it easier. Some of you don't. That is the point.</Kaia>
      <div className="cast">
        {CAST.map(ch => (
          <div className="ccard" key={ch.id}>
            <div className="ccard-h">
              <Sprite id={ch.id} px={3} />
              <div>
                <div className="ccard-n">{ch.name}</div>
                <span className={"chip " + TIER_CLASS[ch.tier]} style={{ marginTop: 5 }}>{ch.cls}</span>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: v("--ink-2"), lineHeight: 1.45 }}>{ch.who}</p>
            <ul className="ccard-tags">{ch.tags.map(t => <li key={t}>{t}</li>)}</ul>
            <div className="meter" role="img" aria-label={`Morning difficulty ${ch.load} of 5`}>
              {[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= ch.load ? "on" : ""} />)}
              <span>Load {ch.load}/5</span>
            </div>
          </div>
        ))}
      </div>
      <Actions>
        <button className="btn" onClick={() => update(n => { n.round = 1; n.qi = 0; n.phase = "intro"; })}>
          I'M READY</button>
        <span className="spacer" />
        <button className="btn btn-ghost" onClick={() => go("setup")}>BACK</button>
      </Actions>
    </Screen>
  );

  const Intro = () => (
    <Layout g={g}>
      <Screen title={`ROUND ${g.round}`} right={ROUND_NAME[g.round]}>
        <p className="eyebrow">ROUND {g.round} OF 3</p>
        <h2 className="screen-title">{ROUND_NAME[g.round]}</h2>
        <Kaia>{ROUND_KAIA[g.round]}</Kaia>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "18px 0" }}>
          {CAST.map(x => <Sprite key={x.id} id={x.id} px={3} ghost={g.roster[x.id].st === "out"} />)}
        </div>
        <p style={{ maxWidth: "60ch", color: v("--ink-2") }}>
          {living.length} families are still in this.{" "}
          {ghosts.length ? `${ghosts.length} are watching as ghosts — they can mime, they cannot act.` : ""}</p>
        <Actions><button className="btn" onClick={nextQuestion}>BEGIN ROUND {g.round}</button></Actions>
      </Screen>
    </Layout>
  );

  const Dilemma = () => {
    const ch = CAST[g.qi], d = dilemmaFor(g, ch.id);
    return (
      <Layout g={g} now={ch.id}>
        <Screen title={`ROUND ${g.round} — DILEMMA`} right={`${ch.name} · ${ch.cls}`}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ flex: "none" }}><Sprite id={ch.id} px={5} /></span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h2 className="screen-title" style={{ marginTop: 0 }}>{ch.name}'S DILEMMA</h2>
              <span className={"chip " + TIER_CLASS[ch.tier]}>{ch.cls}</span>
              <p style={{ fontSize: 14, color: v("--ink-2"), marginTop: 9, maxWidth: "52ch" }}>{ch.who}</p>
            </div>
          </div>
          <hr className="hr" />
          <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: "60ch" }}>{d.sit}</p>
          {d.note && <p className="hint" style={{ color: v("--alarm"), fontWeight: 600, marginTop: 12 }}>{d.note}</p>}
          <div className="choices">
            {d.choices.map((cc, i) => (
              <button className="choice" key={cc.k} onClick={() => choose(i)}>
                <span className="choice-k">{cc.k}</span>
                <span className="choice-t">{cc.t}<span className="choice-cost">COST: {cc.cost}</span></span>
                <Icon name={cc.icon} className="choice-ic" color="--ink-3" />
              </button>
            ))}
          </div>
          <p className="hint">Family {g.qi + 1} of {CAST.length} this round.</p>
        </Screen>
      </Layout>
    );
  };

  const Challenge = () => {
    const t = g.chal, def = t.def, ch = BY_ID[t.chId];
    const frac = t.left / def.secs;
    const cls = frac > 0.5 ? "" : frac > 0.25 ? "warn" : "crit";
    const setAnswer = (qi, oi) => update(n => { n.chal.answers[qi] = oi; });
    return (
      <Layout g={g} now={ch.id}>
        <Screen title="CHALLENGE" right={`${ch.name} · ${def.diffLabel}`}>
          <div className="chal-top">
            <div className={"clock " + cls} role="timer">{t.left}</div>
            <div className="chal-meta">
              <div className="eyebrow">{def.title}</div>
              <div className="chal-diff" role="img" aria-label={`Difficulty ${def.diff} of 5`}>
                {[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= def.diff ? "on" : ""} />)}
                <span>{def.diffLabel}</span>
              </div>
              <div className={"tbar " + cls}><i style={{ width: frac * 100 + "%" }} /></div>
            </div>
            <span style={{ flex: "none" }}><Sprite id={ch.id} px={3} /></span>
          </div>
          {def.kind !== "list" && <p style={{ maxWidth: "58ch", marginBottom: 16 }}>{def.brief}</p>}

          {def.kind === "quiz" && (<>
            {def.qs.map((q, qi) => (
              <div className="q" key={qi}>
                <div className="q-n">QUESTION {qi + 1}</div>
                <div className="q-t">{q.q}</div>
                <div className="opts">
                  {q.opts.map((o, oi) => (
                    <button className="opt" key={oi} aria-pressed={t.answers[qi] === oi}
                      onClick={() => setAnswer(qi, oi)}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
            <Actions><button className="btn" onClick={submitChallenge}>SUBMIT</button></Actions>
          </>)}

          {def.kind === "list" && (<>
            <label className="q-t" htmlFor="listIn" style={{ display: "block", marginBottom: 9 }}>{def.brief}</label>
            <textarea className="field" id="listIn" rows={3} placeholder={def.placeholder} value={listText}
              onChange={e => setListText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitChallenge(); } }} />
            <p className="hint">You need {def.need}. Partial credit is not a thing here.</p>
            <Actions><button className="btn" onClick={submitChallenge}>SUBMIT</button></Actions>
          </>)}

          {def.kind === "rapid" && (def.qs[t.step] ? (
            <>
              <div className="q">
                <div className="q-n">{t.step + 1} OF {def.qs.length}</div>
                <div className="q-t">{def.qs[t.step].q}</div>
                <div className="opts">
                  {def.qs[t.step].opts.map((o, oi) => (
                    <button className="opt" key={oi} onClick={() => update(n => { n.chal.step++; })}>{o}</button>
                  ))}
                </div>
              </div>
              <p className="hint">Answered {t.step} of {def.qs.length}. You need {def.need} before the clock runs out.</p>
            </>
          ) : (
            <>
              <p className="q-t">All of it, handled. Somehow.</p>
              <Actions><button className="btn" onClick={submitChallenge}>FINISH</button></Actions>
            </>
          ))}
        </Screen>
      </Layout>
    );
  };

  const Outcome = () => {
    const p = g.pending, ch = BY_ID[p.id];
    return (
      <Layout g={g} now={ch.id}>
        <Screen title="OUTCOME" right={ch.name}>
          <p className="eyebrow">ROUND {g.round} &middot; {ch.name} CHOSE {p.k}</p>
          <h2 className="screen-title">{p.title}</h2>
          <div className={"res r-" + p.st} style={{ marginTop: 18 }}>
            <span style={{ flex: "none" }}><Sprite id={ch.id} px={4} ghost={p.st === "out"} /></span>
            <div className="res-b">
              <div className="res-n">{ch.name}</div>
              <p className="res-say">{p.say}</p>
              <Badge st={p.st} />
              {p.chalNote && <p className="hint" style={{ marginTop: 11 }}>{p.chalNote}</p>}
            </div>
          </div>
          <Actions><button className="btn" onClick={advance}>NEXT FAMILY</button></Actions>
        </Screen>
      </Layout>
    );
  };

  const Results = () => (
    <Layout g={g}>
      <Screen title={`ROUND ${g.round} RESULTS`} right={ROUND_NAME[g.round]}>
        <p className="eyebrow">ALL FAMILIES, AT ONCE</p>
        <h2 className="screen-title">ROUND {g.round} RESULTS</h2>
        <Kaia>Nobody chose wrong. Look at what each of them was choosing between.</Kaia>
        {CAST.map((ch, i) => {
          const r = g.roster[ch.id], last = r.hist[r.hist.length - 1] || { say: "—" };
          return (
            <div className={"res reveal r-" + r.st} key={ch.id} style={{ animationDelay: i * 70 + "ms" }}>
              <span style={{ flex: "none" }}><Sprite id={ch.id} px={4} ghost={r.st === "out"} /></span>
              <div className="res-b">
                <div className="res-n">{ch.name}</div>
                <p className="res-say">{last.say}</p>
                <Badge st={r.st} />
              </div>
            </div>
          );
        })}
        <hr className="hr" />
        <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 600, letterSpacing: ".03em" }}>
          WHOLE CLASS &mdash; IN {c.in} / STRUGGLING {c.strug} / OUT {c.out} of {g.classSize}</p>
        <Actions><button className="btn" onClick={() => go("vote")}>CONTINUE TO THE VOTE</button></Actions>
      </Screen>
    </Layout>
  );

  const Vote = () => (
    <Layout g={g}>
      <Screen title="VOTING" right={`${living.length} families voting`}>
        <p className="eyebrow">END OF ROUND {g.round}</p>
        <h2 className="screen-title">VOTE TO ELIMINATE</h2>
        <Kaia>Each surviving family sends one spokesperson. One vote each. The families who are already out
          may stand up and mime &mdash; they may not vote. Majority rules.</Kaia>
        <p style={{ maxWidth: "60ch", marginBottom: 16 }}>
          Pick one student to eliminate. Every other family votes at the same time.</p>
        <div className="votes">
          {living.map(ch => (
            <button className="vcard" key={ch.id} aria-pressed={g.voteSel === ch.id}
              onClick={() => update(n => { n.voteSel = ch.id; })}>
              <Sprite id={ch.id} px={3} />
              <span>
                <span className="vcard-n">{ch.name}</span>
                <span className="vcard-s">{ch.cls} &middot; {ST_LABEL[g.roster[ch.id].st]}</span>
              </span>
            </button>
          ))}
        </div>
        {ghosts.length > 0 && (
          <div className="mimes">
            <div className="mimes-h">ELIMINATED &mdash; MIMING, NOT VOTING</div>
            <div className="mime-row">
              {ghosts.map(ch => (
                <span className="mime" key={ch.id}>
                  <Sprite id={ch.id} px={2} ghost />{ch.name} &mdash; mimes a vote nobody counts
                </span>
              ))}
            </div>
          </div>
        )}
        <Actions>
          <button className="btn" disabled={!g.voteSel} onClick={() => update(n => runVote(n))}>SUBMIT VOTE</button>
          <span className="spacer" />
          <span className="pill">YOUR VOTE <b>{g.voteSel ? BY_ID[g.voteSel].name : "—"}</b></span>
        </Actions>
        <div className="note"><b>Facilitator note.</b> Run this vote, then ask who the room voted out and why.
          In every playtest the group eliminates whoever is already struggling &mdash; which is the finding,
          not a bug. Name that out loud before Round {g.round + 1}.</div>
      </Screen>
    </Layout>
  );

  const VoteRes = () => {
    const el = BY_ID[g.eliminated], max = Math.max(...g.tally.map(t => t.n));
    return (
      <Layout g={g}>
        <Screen title="VOTE RESULT" right={`round ${g.round}`}>
          <p className="eyebrow">THE ROOM HAS DECIDED</p>
          <h2 className="screen-title">{el.name} IS ELIMINATED</h2>
          <div style={{ margin: "20px 0 4px" }}>
            {g.tally.map(t => (
              <div className="tallybar" key={t.id}>
                <span className="tallybar-n">{BY_ID[t.id].name}</span>
                <span className="tallybar-t"><i style={{ width: (max ? (t.n / max) * 100 : 0) + "%" }} /></span>
                <span className="tallybar-c">{t.n}</span>
              </div>
            ))}
          </div>
          <hr className="hr" />
          <div className="res r-out">
            <span style={{ flex: "none" }}><Sprite id={el.id} px={4} ghost /></span>
            <div className="res-b">
              <div className="res-n">{el.name}</div>
              <p className="res-say">Voted out in Round {g.round}. {el.name} is now a ghost: present in the room,
                visible to everyone, able to mime and unable to change anything.</p>
              <Badge st="out" label="ELIMINATED BY VOTE" />
            </div>
          </div>
          <Kaia>{g.voteSel === g.eliminated
            ? "You voted with the room. Hold on to how easy that was."
            : "You voted for someone else. The room went the other way. That is also how this works."}</Kaia>
          <Actions>
            <button className="btn" onClick={() => update(n => {
              if (n.round < 3) { n.round++; n.qi = 0; n.phase = "intro"; }
              else { n.round = 4; n.drew = false; n.phase = "homework"; }
            })}>{g.round < 3 ? "ROUND " + (g.round + 1) : "FINAL ROUND"}</button>
          </Actions>
        </Screen>
      </Layout>
    );
  };

  const Homework = () => (
    <Layout g={g}>
      <Screen title="FINAL ROUND — PHASE 1" right="homework due">
        <p className="eyebrow">FINAL ROUND &middot; PHASE 1 OF 3</p>
        <h2 className="screen-title">HOMEWORK DUE</h2>
        <Kaia>Everybody still standing: draw something. Anything. Put it in the bin. You have as long as it
          takes, which for some of you is not very long.</Kaia>
        <div className="cols" style={{ gap: 22 }}>
          <div>
            <Sketch onDraw={() => update(n => { n.drew = true; })} drew={g.drew} />
            <p className="hint">Draw with a mouse or a finger.</p>
            <Actions>
              <button className="btn" onClick={() => update(n => { n.musicT = 12; n.phase = "music"; })}>
                SUBMIT HOMEWORK</button>
            </Actions>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 11 }}>THE BIN</div>
            <div className="bin" style={{ gridTemplateColumns: "1fr" }}>
              {living.map((ch, i) => {
                const done = g.drew || i % 3 === 0;
                return (
                  <div className="binrow" key={ch.id} style={{ color: done ? v("--st-in") : v("--ink-3") }}>
                    <Icon name={done ? "check" : "clock"} />
                    <span style={{ color: v("--ink") }}>{ch.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11 }}>{done ? "SUBMITTED" : "drawing…"}</span>
                  </div>
                );
              })}
            </div>
            <div className="note" style={{ marginTop: 16 }}><b>Everyone can do this one.</b> That is deliberate.
              The homework was never the filter.</div>
          </div>
        </div>
      </Screen>
    </Layout>
  );

  const Music = () => (
    <Layout g={g}>
      <Screen title="FINAL ROUND — PHASE 2" right="musical chairs">
        <p className="eyebrow">FINAL ROUND &middot; PHASE 2 OF 3</p>
        <h2 className="screen-title">THE MUSIC IS PLAYING</h2>
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", margin: "16px 0" }}>
          <div className="eq" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) =>
              <i key={i} style={{ animationDelay: i * 60 + "ms", height: 30 + ((i * 37) % 70) + "%" }} />)}
          </div>
          <div className="clock" style={{ color: v("--violet") }}>{Math.max(0, g.musicT)}</div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <p style={{ fontSize: 15 }}>Run around the red lines until the music stops. When it stops, get
              inside. The last one in is tardy.</p>
          </div>
        </div>
        <div className="track" role="img" aria-label={`${living.length} students running between red lines`}>
          <span className="track-line" style={{ left: "8%" }} />
          <span className="track-line" style={{ left: "50%" }} />
          <span className="track-line" style={{ left: "92%" }} />
          {living.map((ch, i) => {
            const base = 6 + i * (80 / Math.max(1, living.length));
            const speed = PRIV[ch.id] ? 4 : 9 + ch.load;
            const jitter = RM ? 0 : Math.sin((g.musicT + i * 3) * 1.7) * speed;
            return (
              <span className="runner" key={ch.id}
                style={{ left: Math.max(3, Math.min(90, base + jitter)) + "%" }}>
                <Sprite id={ch.id} px={3} /><b>{ch.name}</b>
              </span>
            );
          })}
        </div>
        <div className="bin" style={{ marginTop: 16 }}>
          {living.map(ch => (
            <div className="binrow" key={ch.id} style={{ color: PRIV[ch.id] ? v("--st-star") : v("--ink-2") }}>
              <Icon name={PRIV[ch.id] ? "star" : "walk"} />
              <span style={{ color: v("--ink") }}>{ch.name}</span>
              <span style={{ marginLeft: "auto", fontSize: 11 }}>{PRIV[ch.id] ? "NOT RUSHING" : "running hard"}</span>
            </div>
          ))}
        </div>
      </Screen>
    </Layout>
  );

  const Tardy = () => {
    const t = BY_ID[g.tardy];
    const privLeft = Object.keys(PRIV).filter(id => g.roster[id].st !== "out");
    return (
      <Layout g={g}>
        <Screen title="FINAL ROUND — PHASE 3" right="tardy elimination">
          <p className="eyebrow">FINAL ROUND &middot; PHASE 3 OF 3</p>
          <h2 className="screen-title">THE TIMER GOES OFF</h2>
          <Kaia>Music stops. Everybody in. Last one through the door is tardy, and tardy is out &mdash; you
            know the rule, it's on the wall.</Kaia>
          <div className="res r-out" style={{ marginTop: 18 }}>
            <span style={{ flex: "none" }}><Sprite id={t.id} px={4} ghost /></span>
            <div className="res-b">
              <div className="res-n">{t.name} — TARDY</div>
              <p className="res-say">{t.name} got in last and is eliminated.{" "}
                {TARDY_WHY[t.id] || "The distance was never the same for everyone."}</p>
              <Badge st="out" label="TARDY — ELIMINATED" />
            </div>
          </div>
          <hr className="hr" />
          <div className="eyebrow">STILL IN</div>
          <div className="bin" style={{ marginTop: 11 }}>
            {living.filter(x => x.id !== t.id).map(ch => (
              <div className="binrow" key={ch.id} style={{ color: v("--st-in") }}>
                <Icon name="check" /><span style={{ color: v("--ink") }}>{ch.name}</span>
                <span style={{ marginLeft: "auto", fontSize: 11 }}>HOMEWORK IN, ON TIME</span>
              </div>
            ))}
          </div>
          {privLeft.length > 0 && (<>
            <div className="eyebrow" style={{ marginTop: 24, color: v("--st-star") }}>SPECIAL TREATMENT</div>
            <div style={{ marginTop: 11, display: "flex", flexDirection: "column", gap: 9 }}>
              {privLeft.map(id => (
                <div className="res" key={id} style={{ borderLeftColor: v("--st-star"), margin: 0 }}>
                  <span style={{ flex: "none" }}><Sprite id={id} px={3} /></span>
                  <div className="res-b">
                    <div className="res-n" style={{ color: v("--st-star") }}>{BY_ID[id].name}</div>
                    <p className="res-say" style={{ marginBottom: 0 }}>{PRIV[id]}</p>
                  </div>
                </div>
              ))}
            </div>
          </>)}
          <Actions><button className="btn" onClick={() => go("debrief")}>SEE THE PATTERN</button></Actions>
        </Screen>
      </Layout>
    );
  };

  const Debrief = () => {
    const t = tierStats(g);
    const pct = (o, k) => (o.n ? Math.round((o[k] / o.n) * 100) : 0);
    const survPct = o => (o.n ? Math.round(((o.in + o.strug) / o.n) * 100) : 0);
    const davidAllIn = g.roster.david.hist.every(h => h.st === "in");
    const privLeft = Object.keys(PRIV).filter(id => g.roster[id].st !== "out").length;
    const povLeft = living.filter(x => x.tier === "pov").length;
    const votedOut = ghosts.filter(x => (g.roster[x.id].why || "").indexOf("Voted") === 0);
    const votedUpper = votedOut.filter(x => x.tier === "upper").length;
    const insights = [
      davidAllIn
        ? "David made a choice in all three rounds and every single option available to him ended with him in school. His dilemmas were about which good thing to pick."
        : "Even when David's plan fell apart, the front office didn't write it down.",
      "Marcus never got to choose between good and bad. He chose which sibling absorbed the cost — and the game charged him for it either way.",
      "Lucia's Round 1 had three options and all three ended out of school. She was eliminated before she made a decision. That is what a barrier is.",
      votedOut.length
        ? `The room voted out ${votedOut.map(x => x.name).join(", ")}${votedUpper ? "" : " — nobody upper-class"}. The vote didn't rescue anyone who was already struggling; it removed them faster.`
        : "The vote removed people who were already struggling. It never rescued anyone.",
      privLeft
        ? `At the end, ${privLeft} of the survivors had an extension nobody made them ask for. The rule was the same for everyone; the enforcement was not.`
        : "The last filter wasn't homework. It was who could afford to run.",
      povLeft === 0
        ? "Every poverty and crisis family is gone. Not one of them made a bad decision."
        : `${povLeft} poverty/crisis famil${povLeft === 1 ? "y is" : "ies are"} still standing, on no sleep and no margin.`
    ];
    return (
      <Screen title="DEBRIEF" right={`${living.length} of ${CAST.length} named families left`}>
        <p className="eyebrow">GAME OVER</p>
        <h2 className="screen-title">WHO WAS STILL IN THE ROOM</h2>
        <Kaia>Nobody in here lost because they made a bad decision. Look at what each of them was choosing
          between, and then tell me what the game was actually testing.</Kaia>
        <div className="cols" style={{ marginTop: 22 }}>
          <div>
            <div className="eyebrow" style={{ color: v("--st-in") }}>SURVIVED ({living.length})</div>
            <ul className="list">
              {living.length ? living.map(x => (
                <li key={x.id}><Icon name="check" color="--st-in" />
                  <span><span className="who">{x.name}</span> <span className="why">— {x.cls}</span></span></li>
              )) : <li className="why">Nobody.</li>}
            </ul>
          </div>
          <div>
            <div className="eyebrow" style={{ color: v("--st-out") }}>ELIMINATED ({ghosts.length})</div>
            <ul className="list">
              {ghosts.length ? ghosts.map(x => (
                <li key={x.id}><Icon name="x" color="--st-out" />
                  <span><span className="who">{x.name}</span>
                    <span className="why"> — {x.cls} · {g.roster[x.id].why || "Round " + g.roster[x.id].outRound}</span>
                  </span></li>
              )) : <li className="why">Nobody.</li>}
            </ul>
          </div>
        </div>
        <hr className="hr" />
        <h3 className="screen-title" style={{ fontSize: 13 }}>THE PATTERN — WHOLE CLASS ({g.classSize} STUDENTS)</h3>
        <div className="pattern">
          {["upper", "work", "pov"].map(k => (
            <div className="prow" key={k}>
              <span className="prow-l">{TIER_LABEL[k]}</span>
              <span className="prow-t" role="img"
                aria-label={`${TIER_LABEL[k]}: ${pct(t[k], "in")}% in school, ${pct(t[k], "strug")}% struggling, ${pct(t[k], "out")}% out`}>
                <i style={{ width: pct(t[k], "in") + "%", background: v("--st-in") }} />
                <i style={{ width: pct(t[k], "strug") + "%", background: v("--st-strug") }} />
                <i style={{ width: pct(t[k], "out") + "%", background: v("--st-out") }} />
              </span>
              <span className="prow-v" style={{
                color: v(survPct(t[k]) > 60 ? "--st-in" : survPct(t[k]) > 30 ? "--st-strug" : "--st-out")
              }}>{survPct(t[k])}%</span>
            </div>
          ))}
        </div>
        <div className="legend">
          <span><i style={{ background: v("--st-in") }} />In school</span>
          <span><i style={{ background: v("--st-strug") }} />Struggling</span>
          <span><i style={{ background: v("--st-out") }} />Out</span>
          <span style={{ color: v("--ink-3") }}>% = still in the building at all</span>
        </div>
        <hr className="hr" />
        <h3 className="screen-title" style={{ fontSize: 13 }}>WHAT JUST HAPPENED</h3>
        <ul className="list" style={{ marginTop: 14 }}>
          {insights.map((s, i) => <li key={i}><Icon name="warn" color="--clay" /><span>{s}</span></li>)}
        </ul>
        <hr className="hr" />
        <h3 className="screen-title" style={{ fontSize: 13 }}>TALK ABOUT IT</h3>
        <ol className="qs">
          <li>Who survived, and what did they actually have that the others didn't?</li>
          <li>Did the vote change anything, or did it just speed something up?</li>
          <li>Go back through your own family. How many of your options were real?</li>
          <li>Where have you seen the tardy rule applied unevenly in a real school?</li>
          <li>What would have to change for this game to be winnable by everyone in it?</li>
        </ol>
        <div className="note"><b>Before you run this with students.</b> Several families here carry crisis
          storylines — psychiatric crisis, detention of a parent, dysphoria, chronic pain dismissed by doctors.
          Say up front that players can pass on any character, and have your counselor's name and the 988
          Suicide &amp; Crisis Lifeline written on the board before the first round, not after. Debrief the
          elimination vote in the room; do not let students leave on it.</div>
        <Actions>
          <button className="btn" onClick={() => setG(newGame(g.classSize))}>PLAY AGAIN</button>
          <button className="btn btn-ghost" onClick={() => setShowIndex(true)}>SCREEN INDEX</button>
        </Actions>
      </Screen>
    );
  };

  const SCREENS = { title: Title, setup: Setup, cast: CastScreen, intro: Intro, dilemma: Dilemma,
    challenge: Challenge, outcome: Outcome, results: Results, vote: Vote, voteres: VoteRes,
    homework: Homework, music: Music, tardy: Tardy, debrief: Debrief };
  const Current = SCREENS[g.phase] || Title;
  const inGame = ["intro", "dilemma", "challenge", "outcome", "results", "vote", "voteres",
                  "homework", "music", "tardy"].indexOf(g.phase) >= 0;

  return (
    <ThemeCtx.Provider value={themeTick}>
      <style>{CSS}</style>
      <Sky />
      <div className="app">
        <header className="topbar">
          <span className="logo">MR. SYSTEM</span>
          <div className="topbar-right">
            {inGame && <>
              <span className="pill">ROUND <b>{g.round > 3 ? "FINAL" : g.round}</b></span>
              <span className="pill">IN <b>{c.in}</b></span>
              <span className="pill">OUT <b>{c.out}</b></span>
            </>}
            <button className="mini" onClick={() => setShowIndex(true)}>SCREEN INDEX</button>
            <button className="mini" onClick={() => setG(newGame(g.classSize))}>RESTART</button>
          </div>
        </header>
        {Current()}
      </div>
      {showIndex && (
        <div className="idx" role="dialog" aria-modal="true" aria-label="Screen index"
          onKeyDown={e => { if (e.key === "Escape") setShowIndex(false); }}>
          <div className="idx-panel">
            <p className="eyebrow">FOR REVIEW</p>
            <h2 className="screen-title" style={{ fontSize: 14 }}>SCREEN INDEX</h2>
            <p style={{ fontSize: 14, color: v("--ink-2"), marginTop: 8 }}>
              Jump to any screen with a plausible game state behind it. Play resumes from wherever you land.</p>
            <div className="idx-grid">
              {INDEX.map(r => (
                <button className="idx-b" key={r[0]} onClick={() => jumpTo(r[2], r[3])}>
                  <em>{r[0]}</em><span>{r[1]}</span></button>
              ))}
            </div>
            <Actions><button className="btn btn-ghost" onClick={() => setShowIndex(false)}>CLOSE</button></Actions>
          </div>
        </div>
      )}
    </ThemeCtx.Provider>
  );
}

/* homework drawing pad */
function Sketch({ onDraw }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const r = cv.getBoundingClientRect();
    cv.width = Math.round(r.width); cv.height = Math.round(r.height);
    const ctx = cv.getContext("2d");
    ctx.fillStyle = v("--panel"); ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = v("--ink"); ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
  }, []);
  const at = e => {
    const r = ref.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return [p.clientX - r.left, p.clientY - r.top];
  };
  const down = e => {
    drawing.current = true;
    const ctx = ref.current.getContext("2d");
    const [x, y] = at(e); ctx.beginPath(); ctx.moveTo(x, y);
    onDraw && onDraw();
    e.preventDefault();
  };
  const move = e => {
    if (!drawing.current) return;
    const ctx = ref.current.getContext("2d");
    const [x, y] = at(e); ctx.lineTo(x, y); ctx.stroke();
    e.preventDefault();
  };
  const up = () => { drawing.current = false; };
  return <canvas className="sketch" ref={ref} aria-label="Drawing area for your homework"
    onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up}
    onTouchStart={down} onTouchMove={move} onTouchEnd={up} />;
}
