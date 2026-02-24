import { useState, useRef, useEffect, useReducer, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════
//  GLOBAL STYLES
// ══════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Fraunces:ital,wght@0,400;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

/* ── DARK THEME (default) ── */
:root {
  --bg:#08080f; --bg2:#0f0f1a; --surface:#13131e; --surface2:#1a1a28;
  --surface3:#22223a; --border:#2a2a40; --border2:#363655;
  --gold:#f0c840; --gold2:#ffd84d; --golddim:rgba(240,200,64,.12);
  --red:#f04858; --reddim:rgba(240,72,88,.1);
  --blue:#4d9ef5; --bluedim:rgba(77,158,245,.1);
  --green:#3de89a; --greendim:rgba(61,232,154,.1);
  --purple:#b06af7; --purpledim:rgba(176,106,247,.1);
  --orange:#ff8c42; --cyan:#26d9f0; --cyandim:rgba(38,217,240,.1);
  --muted:#4a4a6a; --muted2:#7070a0; --muted3:#9898c0;
  --text:#f0f0fa; --text2:#c0c0e0; --text3:#9090b8;
  --font-h:'Bebas Neue',sans-serif;
  --font-b:'IBM Plex Mono',monospace;
  --font-serif:'Fraunces',serif;
  --r:8px; --r2:12px;
  --shadow:0 8px 32px rgba(0,0,0,.6);
  --shadow2:0 2px 12px rgba(0,0,0,.4);
}

/* ── LIGHT THEME ── */
.light {
  --bg:#faf7f2; --bg2:#f3ede4; --surface:#ffffff; --surface2:#f7f3ec;
  --surface3:#ede8df; --border:#e0d8cc; --border2:#cfc6b8;
  --gold:#c4860a; --gold2:#d4960e; --golddim:rgba(196,134,10,.08);
  --red:#c0293a; --reddim:rgba(192,41,58,.08);
  --blue:#1a6ec0; --bluedim:rgba(26,110,192,.08);
  --green:#1a8a5a; --greendim:rgba(26,138,90,.08);
  --purple:#6a2cc0; --purpledim:rgba(106,44,192,.08);
  --orange:#b85a10; --cyan:#0a7a9a; --cyandim:rgba(10,122,154,.08);
  --muted:#b0a898; --muted2:#806a58; --muted3:#504038;
  --text:#1a1410; --text2:#3a2e26; --text3:#6a5a4e;
  --shadow:0 4px 20px rgba(0,0,0,.1);
  --shadow2:0 2px 8px rgba(0,0,0,.08);
}

/* ── BASE ── */
html { scroll-behavior:smooth; }
body {
  background:var(--bg); color:var(--text); font-family:var(--font-b);
  min-height:100vh; transition:background .4s,color .4s;
}
.light body, body.light { background:var(--bg); }
.app { max-width:960px; margin:0 auto; padding:0 16px 120px; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}

/* ══ HEADER ══ */
.hdr {
  text-align:center; padding:36px 0 28px;
  border-bottom:1px solid var(--border); position:relative;
  background:linear-gradient(180deg,var(--golddim) 0%,transparent 100%);
}
.hdr::after {
  content:''; position:absolute; bottom:-1px; left:50%; transform:translateX(-50%);
  width:120px; height:2px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
}
.hdr-eye {
  font-size:9px; letter-spacing:6px; color:var(--gold); text-transform:uppercase; margin-bottom:10px;
  font-family:var(--font-b);
}
.hdr-title {
  font-family:var(--font-h); font-size:clamp(52px,11vw,96px);
  line-height:.85; letter-spacing:4px; color:var(--text);
}
.hdr-title em { color:var(--gold); font-style:normal; }
.hdr-sub { font-size:10px; color:var(--muted3); margin-top:12px; letter-spacing:2px; font-family:var(--font-b); }
.hdr-actions { position:absolute; right:0; top:36px; display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
.icon-btn {
  background:var(--surface); border:1px solid var(--border); color:var(--muted3);
  padding:7px 11px; cursor:pointer; font-size:13px; border-radius:var(--r);
  transition:all .2s; font-family:var(--font-b);
}
.icon-btn:hover { border-color:var(--gold); color:var(--gold); background:var(--golddim); }
.icon-btn.on { border-color:var(--gold); color:var(--gold); background:var(--golddim); }

/* ══ XP BAR ══ */
.xp-bar {
  display:flex; align-items:center; gap:12px;
  background:var(--surface); border-bottom:1px solid var(--border);
  padding:10px 20px;
}
.xp-lv { font-family:var(--font-h); font-size:20px; color:var(--gold); min-width:40px; }
.xp-track { flex:1; height:5px; background:var(--border); border-radius:3px; overflow:hidden; }
.xp-fill { height:100%; background:linear-gradient(90deg,var(--gold),var(--orange)); border-radius:3px; transition:width .6s ease; }
.xp-info { font-size:10px; color:var(--muted3); letter-spacing:1px; text-align:right; min-width:80px; }
.xp-title { font-size:9px; color:var(--gold); letter-spacing:2px; text-transform:uppercase; }

/* ══ NAV ══ */
.nav {
  display:flex; border-bottom:1px solid var(--border);
  position:sticky; top:0; z-index:300; background:var(--bg);
  overflow-x:auto; -webkit-overflow-scrolling:touch;
}
.nav::-webkit-scrollbar { display:none; }
.nav-tab {
  flex:1; min-width:90px; padding:13px 8px; text-align:center;
  font-family:var(--font-h); font-size:14px; letter-spacing:1px;
  cursor:pointer; border:none; background:none; color:var(--muted2);
  border-bottom:2px solid transparent; transition:all .2s; white-space:nowrap;
}
.nav-tab.on { color:var(--gold); border-bottom-color:var(--gold); }
.nav-tab:hover:not(.on) { color:var(--text2); }

/* ══ SECTION LABEL ══ */
.slbl {
  font-size:9px; letter-spacing:4px; color:var(--muted3); text-transform:uppercase;
  margin-bottom:12px; display:flex; align-items:center; gap:10px; font-family:var(--font-b);
}
.slbl::before { content:''; width:24px; height:1px; background:var(--gold); flex-shrink:0; }

/* ══ SETUP TAB ══ */
.setup { padding:28px 0 20px; }

.t-input {
  width:100%; background:var(--surface); border:1px solid var(--border);
  border-left:3px solid var(--gold); color:var(--text); font-family:var(--font-b);
  font-size:14px; padding:13px 16px; outline:none; resize:none; line-height:1.6;
  border-radius:0 var(--r) var(--r) 0; transition:border-color .2s, box-shadow .2s;
}
.t-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px var(--golddim); }
.t-input::placeholder { color:var(--muted); }

/* category row */
.cat-row { display:flex; gap:6px; flex-wrap:wrap; margin:10px 0; }
.cat-btn {
  padding:5px 14px; border:1px solid var(--border); background:var(--surface2);
  font-size:10px; color:var(--muted3); cursor:pointer; border-radius:20px;
  transition:all .15s; letter-spacing:.5px; font-family:var(--font-b);
}
.cat-btn:hover,.cat-btn.on { border-color:var(--gold); color:var(--gold); background:var(--golddim); }

/* topic chips */
.chips { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:4px; }
.chip {
  padding:5px 13px; border:1px solid var(--border); background:var(--surface);
  font-size:11px; color:var(--muted3); cursor:pointer; border-radius:var(--r);
  transition:all .15s; font-family:var(--font-b);
}
.chip:hover { border-color:var(--gold); color:var(--text); background:var(--surface2); }

/* stance */
.stance-row { display:flex; gap:10px; margin-top:4px; }
.stance {
  flex:1; padding:14px; border:1px solid var(--border); background:var(--surface);
  color:var(--muted3); font-family:var(--font-h); font-size:19px; letter-spacing:1px;
  cursor:pointer; border-radius:var(--r); transition:all .2s; text-align:center;
}
.stance:hover { border-color:var(--border2); color:var(--text2); }
.stance.sfor { border-color:var(--blue); color:var(--blue); background:var(--bluedim); }
.stance.sagainst { border-color:var(--red); color:var(--red); background:var(--reddim); }

/* option row */
.opt-row { display:flex; gap:8px; flex-wrap:wrap; }
.opt {
  flex:1; min-width:100px; padding:11px 12px; border:1px solid var(--border);
  background:var(--surface2); color:var(--muted3); font-family:var(--font-b);
  font-size:11px; cursor:pointer; border-radius:var(--r);
  transition:all .15s; text-align:center; letter-spacing:.5px;
}
.opt:hover { border-color:var(--border2); color:var(--text2); }
.opt.on { border-color:var(--gold); color:var(--gold); background:var(--golddim); }
.opt.on-p { border-color:var(--purple); color:var(--purple); background:var(--purpledim); }
.opt.on-b { border-color:var(--blue); color:var(--blue); background:var(--bluedim); }

.aux-input {
  width:100%; background:var(--surface2); border:1px solid var(--border);
  border-left:3px solid var(--green); color:var(--text); font-family:var(--font-b);
  font-size:13px; padding:10px 14px; outline:none; border-radius:0 var(--r) var(--r) 0;
  margin-top:8px; transition:border-color .2s;
}
.aux-input:focus { border-color:var(--green); }
.aux-input::placeholder { color:var(--muted); }

/* news ticker */
.news-ticker {
  background:var(--surface2); border:1px solid var(--border); border-left:3px solid var(--cyan);
  border-radius:0 var(--r) var(--r) 0; padding:10px 14px; margin-top:6px;
  font-size:12px; color:var(--cyan); cursor:pointer; transition:all .15s;
  display:flex; align-items:center; gap:8px;
}
.news-ticker:hover { background:var(--cyandim); }

.start-btn {
  margin-top:22px; width:100%; padding:18px; background:var(--gold); border:none;
  color:#000; font-family:var(--font-h); font-size:26px; letter-spacing:4px;
  cursor:pointer; border-radius:var(--r); transition:all .2s;
  box-shadow:0 4px 24px rgba(240,200,64,.3);
}
.start-btn:hover:not(:disabled) {
  background:var(--gold2); transform:translateY(-2px);
  box-shadow:0 8px 32px rgba(240,200,64,.4);
}
.start-btn:disabled { opacity:.3; cursor:not-allowed; transform:none; box-shadow:none; }

/* ══ SCOREBOARD ══ */
.scoreboard {
  display:flex; align-items:center; justify-content:space-between;
  background:var(--surface); border:1px solid var(--border);
  padding:14px 22px; margin:18px 0 0;
  position:sticky; top:49px; z-index:100;
  border-radius:var(--r2); box-shadow:var(--shadow);
}
.fighter { text-align:center; flex:1; }
.f-name { font-family:var(--font-h); font-size:17px; letter-spacing:1px; }
.f-score { font-size:40px; font-family:var(--font-h); margin-top:1px; transition:all .3s; }
.f-score.bump { animation:scoreBump .4s cubic-bezier(.36,.07,.19,.97); }
@keyframes scoreBump { 0%,100%{transform:scale(1)} 30%{transform:scale(1.35)} 60%{transform:scale(.95)} }
.f-you .f-name { color:var(--blue); } .f-you .f-score { color:var(--blue); }
.f-ai .f-name { color:var(--red); }   .f-ai .f-score { color:var(--red); }
.f-p2 .f-name { color:var(--green); } .f-p2 .f-score { color:var(--green); }
.vs-col { text-align:center; padding:0 14px; }
.vs-txt { font-family:var(--font-h); font-size:22px; color:var(--gold); }
.round-txt { font-size:9px; letter-spacing:2px; color:var(--muted3); text-transform:uppercase; margin-top:2px; }
.mode-txt { font-size:9px; color:var(--muted); margin-top:1px; letter-spacing:1px; }

/* ══ TIMER ══ */
.timer-wrap { margin:10px 0 6px; }
.timer-row { display:flex; align-items:center; gap:12px; margin-bottom:6px; }
.timer-num { font-family:var(--font-h); font-size:28px; letter-spacing:2px; min-width:48px; transition:color .3s; }
.timer-num.warn { color:var(--red); animation:blink .5s infinite; }
.timer-num.ok { color:var(--gold); }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.timer-track { flex:1; height:5px; background:var(--border); border-radius:3px; overflow:hidden; }
.timer-fill { height:100%; border-radius:3px; transition:width .4s linear, background .3s; }
.t-actions { display:flex; gap:6px; }
.t-btn {
  padding:5px 13px; border:1px solid var(--border); background:var(--surface2);
  color:var(--muted3); font-size:10px; cursor:pointer; border-radius:var(--r);
  letter-spacing:1px; transition:all .15s; font-family:var(--font-b);
}
.t-btn:hover { border-color:var(--gold); color:var(--gold); }

/* ══ SPEED MODE ══ */
.speed-banner {
  background:linear-gradient(90deg,var(--reddim),transparent);
  border:1px solid var(--red); border-radius:var(--r);
  padding:6px 14px; text-align:center; font-size:11px; color:var(--red);
  letter-spacing:2px; margin:6px 0; animation:speedPulse 2s infinite;
}
@keyframes speedPulse { 0%,100%{opacity:1} 50%{opacity:.6} }

/* ══ TURN BADGE ══ */
.turn-badge {
  text-align:center; font-size:10px; letter-spacing:3px; padding:8px 0;
  text-transform:uppercase; margin:6px 0; border-radius:var(--r); font-family:var(--font-b);
}
.turn-you { color:var(--blue); background:var(--bluedim); }
.turn-p2  { color:var(--green); background:var(--greendim); }

/* ══ STRENGTH METER ══ */
.strength-wrap { padding:6px 0 8px; }
.strength-lbl { font-size:9px; letter-spacing:2px; color:var(--muted3); text-transform:uppercase; margin-bottom:5px; font-family:var(--font-b); }
.strength-track { height:4px; background:var(--border); border-radius:2px; overflow:hidden; }
.strength-fill { height:100%; border-radius:2px; transition:width .5s ease, background .4s; }
.strength-txt { font-size:11px; margin-top:4px; font-family:var(--font-h); letter-spacing:1px; }

/* ══ ARENA ══ */
.arena {
  display:flex; flex-direction:column; gap:12px;
  margin:10px 0 10px; max-height:46vh; overflow-y:auto; padding:2px 4px 2px 2px;
}
.bubble { max-width:86%; padding:14px 18px; animation:popIn .22s ease; position:relative; border-radius:var(--r); }
@keyframes popIn { from{opacity:0;transform:translateY(8px) scale(.97)} to{opacity:1;transform:none} }
.b-you  { align-self:flex-end;   background:var(--bluedim);   border:1px solid rgba(77,158,245,.3);  border-right:3px solid var(--blue); }
.b-ai   { align-self:flex-start; background:var(--reddim);    border:1px solid rgba(240,72,88,.25);  border-left:3px solid var(--red); }
.b-p2   { align-self:flex-end;   background:var(--greendim);  border:1px solid rgba(61,232,154,.25); border-right:3px solid var(--green); }
.b-sys  { align-self:center; background:var(--golddim); border:1px solid rgba(240,200,64,.2); text-align:center; font-size:11px; color:var(--gold); letter-spacing:1px; max-width:100%; padding:10px 18px; }
.b-verd { align-self:stretch; background:var(--surface); border:1px solid var(--gold); max-width:100%; }
.b-fact { align-self:stretch; background:var(--purpledim); border:1px solid rgba(176,106,247,.28); border-left:3px solid var(--purple); max-width:100%; }
.b-sug  { align-self:stretch; background:var(--cyandim); border:1px solid rgba(38,217,240,.25); border-left:3px solid var(--cyan); max-width:100%; }
.b-coach{ align-self:stretch; background:var(--golddim); border:1px solid rgba(240,200,64,.3); border-left:3px solid var(--gold); max-width:100%; }
.b-news { align-self:stretch; background:var(--cyandim); border:1px solid rgba(38,217,240,.3); border-left:3px solid var(--cyan); max-width:100%; }

.b-lbl { font-size:9px; letter-spacing:3px; text-transform:uppercase; margin-bottom:7px; display:flex; justify-content:space-between; align-items:center; font-family:var(--font-b); }
.b-you .b-lbl, .b-p2 .b-lbl { flex-direction:row-reverse; }
.b-you .b-lbl { color:var(--blue); } .b-ai .b-lbl { color:var(--red); }
.b-p2 .b-lbl  { color:var(--green); } .b-verd .b-lbl { color:var(--gold); }
.b-fact .b-lbl { color:var(--purple); } .b-sug .b-lbl { color:var(--cyan); }
.b-coach .b-lbl { color:var(--gold); } .b-news .b-lbl { color:var(--cyan); }

.b-txt { font-size:13px; line-height:1.8; color:var(--text); }
.b-meta { font-size:9px; color:var(--muted); margin-top:5px; font-family:var(--font-b); }
.fallacy { display:inline-flex; align-items:center; gap:5px; margin-top:9px; padding:3px 10px; font-size:10px; background:var(--reddim); border:1px solid var(--red); color:var(--red); border-radius:3px; font-family:var(--font-b); }
.pt-flash { position:absolute; top:-13px; right:-8px; background:var(--gold); color:#000; font-family:var(--font-h); font-size:15px; padding:2px 9px; border-radius:3px; animation:ptFly 2s ease forwards; z-index:10; pointer-events:none; }
@keyframes ptFly { 0%{opacity:1;transform:translateY(0)} 70%{opacity:1} 100%{opacity:0;transform:translateY(-22px)} }

/* ══ TYPING ══ */
.typing {
  align-self:flex-start; padding:11px 18px;
  background:var(--reddim); border:1px solid rgba(240,72,88,.2);
  border-left:3px solid var(--red); font-size:10px; color:var(--red);
  letter-spacing:2px; display:flex; gap:5px; align-items:center;
  border-radius:var(--r); font-family:var(--font-b);
}
.td { width:5px; height:5px; background:var(--red); border-radius:50%; animation:td 1.2s infinite; }
.td:nth-child(2){animation-delay:.2s;} .td:nth-child(3){animation-delay:.4s;}
@keyframes td { 0%,80%,100%{transform:scale(0);opacity:.3} 40%{transform:scale(1);opacity:1} }

/* ══ INPUT AREA ══ */
.input-wrap {
  position:sticky; bottom:0; background:var(--bg);
  padding:12px 0 8px; border-top:1px solid var(--border);
}
.char-count { font-size:9px; text-align:right; margin-bottom:5px; letter-spacing:1px; font-family:var(--font-b); transition:color .2s; }
.input-row { display:flex; gap:8px; align-items:flex-end; }
.arg-input {
  flex:1; background:var(--surface); border:1px solid var(--border);
  border-left:3px solid var(--blue); color:var(--text); font-family:var(--font-b);
  font-size:13px; padding:11px 14px; outline:none; resize:none;
  min-height:48px; max-height:120px;
  border-radius:0 var(--r) var(--r) 0; transition:border-color .2s, box-shadow .2s;
}
.arg-input:focus { border-color:var(--blue); box-shadow:0 0 0 3px var(--bluedim); }
.arg-input::placeholder { color:var(--muted); }
.arg-input:disabled { opacity:.35; }
.btn { padding:11px 15px; border:none; font-family:var(--font-h); font-size:17px; letter-spacing:1px; cursor:pointer; transition:all .15s; border-radius:var(--r); white-space:nowrap; }
.btn:disabled { opacity:.3; cursor:not-allowed; }
.btn-blue   { background:var(--blue); color:#fff; }
.btn-blue:hover:not(:disabled)   { background:#5da8ff; transform:translateY(-1px); }
.btn-gold   { background:var(--gold); color:#000; }
.btn-gold:hover:not(:disabled)   { background:var(--gold2); transform:translateY(-1px); }
.btn-ghost  { background:var(--surface2); border:1px solid var(--border); color:var(--muted3); }
.btn-ghost:hover:not(:disabled)  { border-color:var(--border2); color:var(--text2); }
.btn-mic    { background:var(--surface2); border:1px solid var(--border); color:var(--muted3); font-size:15px; }
.btn-mic:hover:not(:disabled)    { border-color:var(--red); color:var(--red); }
.btn-mic.rec { background:var(--red); color:#fff; border-color:var(--red); animation:recPulse 1.2s infinite; }
@keyframes recPulse { 0%,100%{box-shadow:0 0 0 0 rgba(240,72,88,.4)} 50%{box-shadow:0 0 0 8px rgba(240,72,88,0)} }
.btn-cyan { background:var(--cyandim); border:1px solid rgba(38,217,240,.3); color:var(--cyan); font-size:13px; }
.btn-cyan:hover:not(:disabled) { background:rgba(38,217,240,.18); border-color:var(--cyan); }

/* shortcuts */
.sc-row { display:flex; gap:8px; flex-wrap:wrap; padding:4px 0 6px; }
.sc { font-size:9px; color:var(--muted); padding:3px 8px; border:1px solid var(--border); border-radius:3px; letter-spacing:.5px; font-family:var(--font-b); }
.sc kbd { color:var(--gold); font-family:var(--font-h); font-size:11px; }

/* judge hint */
.j-hint { text-align:center; font-size:10px; color:var(--muted); margin-top:5px; letter-spacing:1px; font-family:var(--font-b); }

/* ══ VERDICT ══ */
.verd-winner { font-family:var(--font-h); font-size:42px; letter-spacing:3px; text-align:center; margin-bottom:14px; }
.verd-body { font-size:13px; line-height:1.85; color:var(--text2); }
.verd-scores { display:flex; gap:10px; margin-top:16px; flex-wrap:wrap; }
.vscore { flex:1; background:var(--surface2); padding:12px 16px; border:1px solid var(--border); border-radius:var(--r); }
.vscore-lbl { font-size:9px; letter-spacing:2px; color:var(--muted3); text-transform:uppercase; font-family:var(--font-b); }
.vscore-val { font-family:var(--font-h); font-size:30px; margin-top:3px; }
.improve-list { margin-top:16px; }
.improve-item { padding:9px 13px; border-left:2px solid var(--green); margin-bottom:8px; font-size:12px; line-height:1.7; background:var(--greendim); border-radius:0 var(--r) var(--r) 0; color:var(--text2); }
.verd-actions { margin-top:16px; display:flex; gap:8px; flex-wrap:wrap; }
.va-btn { flex:1; padding:10px; background:var(--surface2); border:1px solid var(--border); color:var(--muted3); font-family:var(--font-b); font-size:11px; letter-spacing:1.5px; cursor:pointer; border-radius:var(--r); transition:all .15s; text-transform:uppercase; }
.va-btn:hover { border-color:var(--gold); color:var(--gold); }
.new-btn { margin-top:10px; width:100%; padding:12px; background:none; border:1px solid var(--border); color:var(--muted3); font-family:var(--font-b); font-size:11px; letter-spacing:2px; cursor:pointer; border-radius:var(--r); transition:all .15s; text-transform:uppercase; }
.new-btn:hover { border-color:var(--gold); color:var(--gold); }

/* weakness heatmap */
.heatmap { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:14px; }
.hm-item { background:var(--surface2); border:1px solid var(--border); border-radius:var(--r); padding:10px 12px; }
.hm-lbl { font-size:9px; letter-spacing:1px; color:var(--muted3); text-transform:uppercase; margin-bottom:6px; font-family:var(--font-b); }
.hm-bar { height:4px; background:var(--border); border-radius:2px; overflow:hidden; }
.hm-fill { height:100%; border-radius:2px; }
.hm-val { font-family:var(--font-h); font-size:16px; margin-top:4px; }

/* ══ REPLAY ══ */
.replay-wrap { padding:20px 0; }
.replay-controls { display:flex; gap:8px; align-items:center; margin-bottom:16px; flex-wrap:wrap; }
.replay-progress { flex:1; height:4px; background:var(--border); border-radius:2px; cursor:pointer; min-width:100px; }
.replay-fill { height:100%; background:var(--gold); border-radius:2px; transition:width .3s; }
.replay-bubble { padding:12px 16px; border-radius:var(--r); margin-bottom:10px; animation:popIn .3s ease; font-size:13px; line-height:1.75; }
.rb-you { background:var(--bluedim); border-left:3px solid var(--blue); }
.rb-ai  { background:var(--reddim);  border-left:3px solid var(--red); }
.rb-sys { background:var(--golddim); border-left:3px solid var(--gold); font-size:11px; color:var(--gold); }

/* ══ AI vs AI ══ */
.ava-wrap { padding:20px 0; }
.ava-fighters { display:flex; gap:12px; margin-bottom:16px; }
.ava-fighter { flex:1; background:var(--surface); border:1px solid var(--border); border-radius:var(--r); padding:14px; text-align:center; }
.ava-f-name { font-family:var(--font-h); font-size:18px; margin-bottom:4px; }
.ava-f-score { font-family:var(--font-h); font-size:32px; }
.ava-start { width:100%; padding:13px; background:var(--purpledim); border:1px solid var(--purple); color:var(--purple); font-family:var(--font-h); font-size:20px; letter-spacing:2px; cursor:pointer; border-radius:var(--r); transition:all .15s; }
.ava-start:hover:not(:disabled) { background:var(--purple); color:#fff; }
.ava-start:disabled { opacity:.3; cursor:not-allowed; }
.ava-arena { max-height:40vh; overflow-y:auto; display:flex; flex-direction:column; gap:10px; }

/* ══ DAILY CHALLENGE ══ */
.daily-wrap { padding:20px 0; }
.daily-card {
  background:linear-gradient(135deg,var(--surface),var(--surface2));
  border:1px solid var(--gold); border-radius:var(--r2); padding:24px;
  text-align:center; margin-bottom:20px;
}
.daily-label { font-size:9px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; margin-bottom:10px; font-family:var(--font-b); }
.daily-topic { font-family:var(--font-h); font-size:clamp(20px,4vw,32px); color:var(--text); margin-bottom:8px; line-height:1.1; }
.daily-countdown { font-family:var(--font-b); font-size:11px; color:var(--muted3); letter-spacing:2px; }
.daily-lb { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; }
.daily-lb-row { display:flex; align-items:center; gap:12px; padding:10px 16px; border-bottom:1px solid var(--border); }
.daily-lb-row:last-child { border-bottom:none; }
.daily-lb-row.you-row { background:var(--golddim); }
.dlr-rank { font-family:var(--font-h); font-size:20px; color:var(--muted); min-width:28px; }
.dlr-name { flex:1; font-size:12px; }
.dlr-score { font-family:var(--font-h); font-size:18px; color:var(--gold); }

/* ══ TOURNAMENT ══ */
.tourn-wrap { padding:20px 0; }
.bracket { display:flex; gap:16px; overflow-x:auto; padding-bottom:8px; }
.bracket-round { display:flex; flex-direction:column; gap:12px; min-width:160px; }
.bracket-lbl { font-size:9px; letter-spacing:3px; color:var(--muted3); text-transform:uppercase; margin-bottom:6px; text-align:center; font-family:var(--font-b); }
.bracket-match { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; }
.bm-player { display:flex; justify-content:space-between; align-items:center; padding:8px 12px; font-size:12px; border-bottom:1px solid var(--border); }
.bm-player:last-child { border-bottom:none; }
.bm-player.winner { background:var(--golddim); color:var(--gold); }
.bm-player.loser { opacity:.4; }
.bm-score { font-family:var(--font-h); font-size:16px; }
.tourn-status { text-align:center; padding:20px; color:var(--muted3); font-size:13px; font-family:var(--font-serif); font-style:italic; }

/* ══ DASHBOARD ══ */
.dash { padding:24px 0; }
.dash-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px; margin-bottom:24px; }
.dash-card { background:var(--surface); border:1px solid var(--border); padding:16px 18px; border-radius:var(--r); transition:all .2s; cursor:default; }
.dash-card:hover { border-color:var(--border2); transform:translateY(-1px); box-shadow:var(--shadow2); }
.dc-val { font-family:var(--font-h); font-size:40px; }
.dc-lbl { font-size:9px; color:var(--muted3); text-transform:uppercase; letter-spacing:2px; margin-top:3px; font-family:var(--font-b); }
.dc-sub { font-size:10px; color:var(--muted2); margin-top:2px; font-family:var(--font-b); }

/* weakness panel */
.weak-panel { background:var(--surface); border:1px solid var(--border); border-radius:var(--r2); padding:20px; margin-bottom:20px; }
.weak-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px; }
.weak-item { background:var(--surface2); border:1px solid var(--border); border-radius:var(--r); padding:12px 14px; }
.weak-lbl { font-size:9px; color:var(--muted3); text-transform:uppercase; letter-spacing:1.5px; font-family:var(--font-b); margin-bottom:7px; }
.weak-bar { height:5px; background:var(--border); border-radius:3px; overflow:hidden; margin-bottom:5px; }
.weak-fill { height:100%; border-radius:3px; transition:width .8s ease; }
.weak-val { font-family:var(--font-h); font-size:18px; }
.weak-hint { font-size:10px; color:var(--muted2); margin-top:3px; font-family:var(--font-b); }

/* history */
.h-list { display:flex; flex-direction:column; gap:8px; }
.h-item { background:var(--surface); border:1px solid var(--border); border-left:3px solid var(--border); padding:12px 16px; border-radius:0 var(--r) var(--r) 0; transition:all .15s; cursor:default; }
.h-item:hover { border-color:var(--border2); }
.h-item.won { border-left-color:var(--green); } .h-item.lost { border-left-color:var(--red); } .h-item.draw { border-left-color:var(--gold); }
.h-top { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
.h-topic { font-size:13px; font-weight:500; color:var(--text); line-height:1.4; }
.h-meta { font-size:10px; color:var(--muted2); margin-top:3px; letter-spacing:.5px; font-family:var(--font-b); }
.h-res { font-family:var(--font-h); font-size:16px; flex-shrink:0; }
.empty-dash { text-align:center; padding:52px 24px; color:var(--muted2); }
.empty-icon { font-size:38px; margin-bottom:12px; opacity:.25; }

/* ══ LEADERBOARD ══ */
.lb-wrap { padding:24px 0; }
.streak-grid { display:flex; gap:5px; flex-wrap:wrap; margin:10px 0 24px; }
.s-day { width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; border:1px solid var(--border); border-radius:5px; transition:transform .2s; cursor:default; font-family:var(--font-b); }
.s-day:hover { transform:scale(1.15); }
.sw { background:var(--greendim); border-color:var(--green); color:var(--green); }
.sl { background:var(--reddim);   border-color:var(--red);   color:var(--red); }
.sd { background:var(--golddim);  border-color:var(--gold);  color:var(--gold); }
.se { background:var(--surface2); color:var(--muted); }

.lb-list { display:flex; flex-direction:column; gap:8px; margin-bottom:24px; }
.lb-row { display:flex; align-items:center; gap:12px; padding:13px 18px; background:var(--surface); border:1px solid var(--border); border-radius:var(--r); transition:all .2s; }
.lb-row:hover { border-color:var(--border2); transform:translateX(2px); }
.lb-row.you { border-color:var(--gold); background:var(--golddim); }
.lb-rank { font-family:var(--font-h); font-size:28px; color:var(--muted); min-width:34px; }
.lb-rank.g{color:var(--gold);} .lb-rank.s{color:#a0a0b8;} .lb-rank.b{color:#b87333;}
.lb-info { flex:1; }
.lb-name { font-size:13px; font-weight:500; }
.lb-badge { font-size:10px; color:var(--muted3); margin-top:2px; font-family:var(--font-b); }
.lb-score { font-family:var(--font-h); font-size:24px; color:var(--gold); }
.lb-trend { font-size:12px; margin-left:4px; }

/* achievements */
.ach-grid { display:flex; gap:8px; flex-wrap:wrap; }
.ach { padding:8px 14px; background:var(--surface); border:1px solid var(--border); border-radius:20px; font-size:12px; transition:all .2s; cursor:default; font-family:var(--font-b); }
.ach.earned { border-color:var(--gold); background:var(--golddim); color:var(--gold); }
.ach.locked { opacity:.3; filter:grayscale(1); }
.ach:hover.earned { transform:scale(1.05); }

/* ══ SCHOOL TAB ══ */
.school-wrap { padding:24px 0; }
.lesson-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; margin-bottom:24px; }
.lesson-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r2); padding:18px; cursor:pointer; transition:all .2s; }
.lesson-card:hover { border-color:var(--gold); transform:translateY(-2px); box-shadow:var(--shadow2); }
.lesson-card.done { border-color:var(--green); }
.lesson-icon { font-size:28px; margin-bottom:8px; }
.lesson-title { font-family:var(--font-h); font-size:18px; margin-bottom:4px; }
.lesson-desc { font-size:11px; color:var(--muted3); line-height:1.6; font-family:var(--font-b); }
.lesson-badge { font-size:9px; color:var(--green); margin-top:6px; letter-spacing:1px; font-family:var(--font-b); }

.lesson-detail { background:var(--surface); border:1px solid var(--border); border-radius:var(--r2); padding:24px; }
.ld-title { font-family:var(--font-h); font-size:28px; color:var(--gold); margin-bottom:12px; }
.ld-body { font-size:13px; line-height:1.85; color:var(--text2); margin-bottom:16px; font-family:var(--font-b); }
.ld-example { background:var(--surface2); border-left:3px solid var(--gold); padding:12px 16px; border-radius:0 var(--r) var(--r) 0; font-size:12px; line-height:1.7; color:var(--text2); margin-bottom:14px; }
.ld-quiz { background:var(--surface2); border:1px solid var(--border); border-radius:var(--r); padding:16px; }
.ld-q { font-size:13px; font-weight:500; margin-bottom:12px; line-height:1.5; }
.ld-opts { display:flex; flex-direction:column; gap:8px; }
.ld-opt { padding:10px 14px; border:1px solid var(--border); background:var(--surface); border-radius:var(--r); cursor:pointer; font-size:12px; transition:all .15s; text-align:left; font-family:var(--font-b); }
.ld-opt:hover { border-color:var(--gold); background:var(--golddim); color:var(--gold); }
.ld-opt.correct { border-color:var(--green); background:var(--greendim); color:var(--green); }
.ld-opt.wrong { border-color:var(--red); background:var(--reddim); color:var(--red); }
.back-btn { padding:8px 18px; background:none; border:1px solid var(--border); color:var(--muted3); font-family:var(--font-b); font-size:11px; letter-spacing:1px; cursor:pointer; border-radius:var(--r); transition:all .15s; margin-bottom:16px; }
.back-btn:hover { border-color:var(--gold); color:var(--gold); }

/* ══ CONFETTI ══ */
.confetti-c { position:fixed; inset:0; pointer-events:none; z-index:9999; }
.conf { position:absolute; top:-12px; animation:confFall linear forwards; }
@keyframes confFall { to{transform:translateY(110vh) rotate(800deg);opacity:0} }

/* ══ TOAST ══ */
.toast {
  position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
  background:var(--surface); border:1px solid var(--gold); color:var(--gold);
  padding:10px 22px; border-radius:var(--r); font-size:12px; letter-spacing:1px;
  animation:toastIn .3s ease, toastOut .3s ease 2.6s forwards;
  z-index:10000; pointer-events:none; box-shadow:var(--shadow); font-family:var(--font-b);
}
@keyframes toastIn  { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
@keyframes toastOut { to{opacity:0;transform:translateX(-50%) translateY(10px)} }

/* ══ MISC ══ */
.divider { height:1px; background:var(--border); margin:20px 0; }
.pill { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:10px; font-family:var(--font-b); border:1px solid; }
.pill-gold { border-color:var(--gold); color:var(--gold); background:var(--golddim); }
.pill-green { border-color:var(--green); color:var(--green); background:var(--greendim); }
.pill-red { border-color:var(--red); color:var(--red); background:var(--reddim); }

/* ══ RESPONSIVE ══ */
@media(max-width:640px){
  .app{padding:0 10px 100px;}
  .hdr-actions{position:static;margin-top:10px;justify-content:center;}
  .hdr{padding-bottom:60px;}
  .stance-row,.opt-row{flex-wrap:wrap;}
  .input-row{flex-wrap:wrap;}
  .arg-input{min-width:100%;}
  .arena{max-height:42vh;}
  .sc-row{display:none;}
  .verd-actions,.weak-grid,.heatmap{flex-direction:column;}
  .ava-fighters{flex-direction:column;}
  .bracket{flex-direction:column;}
  .dash-grid{grid-template-columns:repeat(2,1fr);}
  .lesson-grid{grid-template-columns:1fr;}
}
`;

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS & DATA
// ══════════════════════════════════════════════════════════════════
const TOPIC_CATS = {
  "🤖 Tech":    ["AI will take most jobs in 10 years","Social media does more harm than good","Crypto is the future of money","Big Tech should be broken up","Electric cars will replace all vehicles by 2035"],
  "🧠 Society": ["College education is overrated","Democracy is the best system","Humans are naturally selfish","Cancel culture is harmful","Mental health days should be mandatory"],
  "🌍 World":   ["Climate change is humanity's #1 threat","Nuclear energy is safe & necessary","Space exploration is a waste of money","Globalization has failed the poor","Borders should be abolished"],
  "💰 Economy": ["Universal Basic Income would work","Capitalism is broken","Remote work is better than office","4-day work week should be law","Billionaires should not exist"],
};

const DEBATER_STYLES = [
  {id:"default",  icon:"🤖", label:"AI",          color:"var(--red)",    prompt:""},
  {id:"jordan",   icon:"🦁", label:"Peterson",    color:"var(--orange)", prompt:"Use Jungian archetypes, evolutionary psychology, mythological metaphors. Order and chaos. Deep structure."},
  {id:"hitchens", icon:"✒️", label:"Hitchens",    color:"var(--purple)", prompt:"Use razor wit, devastating one-liners, literary references. Atheistic, aggressive, brilliant."},
  {id:"socrates", icon:"🏛️",label:"Socrates",    color:"var(--blue)",   prompt:"Ask probing questions that expose contradictions. Use elenctic method. Never assert—only question."},
  {id:"elon",     icon:"🚀", label:"Elon",         color:"var(--cyan)",   prompt:"First-principles thinking. Break assumptions to physics level. Blunt, unconventional, numerical."},
  {id:"gandhi",   icon:"☮️", label:"Gandhi",      color:"var(--green)",  prompt:"Moral authority, non-violent logic, historical injustice, quiet devastation. Satyagraha in argument."},
];

const DIFF_CONFIG = {
  easy:   {label:"🟢 Easy",   prompt:"Be moderately challenging. Make clear points but occasionally leave openings.",          xp:60},
  medium: {label:"🟡 Medium", prompt:"Be sharp, cite studies, find logical weaknesses aggressively.",                          xp:80},
  hard:   {label:"🔴 Brutal", prompt:"Be a brutal Socratic cross-examiner. Find every fallacy. Expert-level. Zero mercy.",     xp:110},
};

const LESSONS = [
  {id:"fallacies", icon:"⚠️",  title:"Logical Fallacies", desc:"Learn the 8 most common debate traps and how to spot them.",
    body:`A logical fallacy is an error in reasoning that makes an argument invalid. Recognizing fallacies lets you dismantle weak arguments and strengthen your own.\n\nThe most common fallacies:\n\n• Ad Hominem — attacking the person, not the argument\n• Straw Man — misrepresenting an opponent's position\n• False Dichotomy — presenting only 2 options when more exist\n• Slippery Slope — assuming one event leads inevitably to extreme consequences\n• Appeal to Emotion — using feelings instead of logic\n• Hasty Generalization — drawing broad conclusions from few examples\n• Circular Reasoning — using the conclusion as a premise\n• Appeal to Authority — citing an expert as if it settles the debate`,
    example:`Example of Ad Hominem:\n"You can't trust her views on climate change — she drives a gas car!"\n\nWhy it's wrong: Her driving habits don't invalidate her argument's logic or evidence.`,
    quiz:{q:"Which fallacy is this? 'If we allow gay marriage, next people will want to marry animals.'",opts:["Ad Hominem","Slippery Slope","Straw Man","Appeal to Authority"],correct:1}},
  {id:"evidence",  icon:"📊",  title:"Using Evidence",    desc:"How to cite facts, studies, and data that actually win debates.",
    body:`Strong evidence transforms a weak opinion into a compelling argument. But not all evidence is equal.\n\nHierarchy of evidence (strongest to weakest):\n1. Peer-reviewed meta-analyses\n2. Individual scientific studies\n3. Government statistics\n4. Expert consensus\n5. Anecdotal evidence (weakest)\n\nKey rules:\n• Be specific — "Studies show" is weak. "A 2023 MIT study of 10,000 workers found..." is powerful.\n• Use numbers — percentages, ratios, and comparisons make abstract claims concrete.\n• Anticipate counter-evidence — acknowledge and rebut opposing data.\n• Source credibility matters — Nature > Random blog`,
    example:`Weak: "AI is taking jobs."\nStrong: "According to the World Economic Forum's 2023 report, 14 million jobs are expected to be displaced by AI by 2027, while only 9 million new roles will emerge — a net loss of 5 million."`,
    quiz:{q:"Which is the STRONGEST form of evidence in a debate?",opts:["Personal anecdote","Tweet from a celebrity","Peer-reviewed meta-analysis","News article"],correct:2}},
  {id:"steel",     icon:"🛡️", title:"Steel Manning",     desc:"How to argue against the STRONGEST version of your opponent's case.",
    body:`Steel Manning is the opposite of Straw Manning. Instead of misrepresenting your opponent's weakest argument, you engage with their STRONGEST possible version.\n\nWhy it's powerful:\n• It makes you look intellectually honest and confident\n• It forces you to develop genuinely strong rebuttals\n• It earns respect from the audience and judge\n• It prevents your opponent from saying "that's not what I meant"\n\nHow to do it:\n1. Restate their position in the strongest possible terms\n2. Acknowledge what's genuinely true or reasonable about it\n3. THEN explain why your position still prevails\n\nThis is the mark of elite debaters.`,
    example:`Instead of: "My opponent just wants to give lazy people free money."\n\nSay: "The strongest case for UBI is that automation will eliminate so many jobs that traditional employment can't sustain society. That's a serious concern. However, the evidence shows that targeted job training programs are 3x more effective per dollar at maintaining workforce participation."`,
    quiz:{q:"What is 'Steel Manning'?",opts:["Attacking opponent's weakest argument","Arguing with aggressive tone","Engaging the strongest version of opponent's argument","Using steel industry data"],correct:2}},
  {id:"structure", icon:"🏗️", title:"Argument Structure", desc:"The PEEL, Toulmin, and Rebuttal frameworks that win debates.",
    body:`Structure is what separates a rant from an argument. Use these frameworks:\n\n📌 PEEL Framework:\nPoint → Evidence → Explanation → Link back\n\n📌 Toulmin Model:\nClaim → Grounds → Warrant → Backing → Qualifier → Rebuttal\n\n📌 The 3-Part Rebuttal:\n1. Acknowledge ("My opponent correctly notes that...")\n2. Pivot ("However, this overlooks...")\n3. Counter-evidence ("In fact, [data] shows the opposite.")\n\nPro tips:\n• Lead with your strongest argument\n• One clear idea per argument — don't dilute\n• End with a memorable line\n• Use signposting: "First... Second... Therefore..."`,
    example:`PEEL Example on AI jobs:\nPoint: AI will take most jobs\nEvidence: WEF 2023: 14M jobs displaced by 2027\nExplanation: Unlike past automation, AI targets cognitive work, not just physical\nLink: Therefore, we face unprecedented displacement`,
    quiz:{q:"In a rebuttal, what should you do FIRST?",opts:["Immediately attack opponent","Acknowledge what opponent said","Cite your evidence","State your conclusion"],correct:1}},
];

const ACHIEVEMENTS_DEF = [
  {id:"first",    icon:"🥊", label:"First Blood",    check:s=>s.total>=1},
  {id:"winner",   icon:"🏆", label:"Champion",       check:s=>s.wins>=1},
  {id:"streak3",  icon:"🔥", label:"On Fire",        check:s=>s.streak>=3},
  {id:"streak5",  icon:"⚡", label:"Unstoppable",    check:s=>s.streak>=5},
  {id:"five",     icon:"🎓", label:"Seasoned",       check:s=>s.total>=5},
  {id:"ten",      icon:"💎", label:"Elite",          check:s=>s.total>=10},
  {id:"perfect",  icon:"💯", label:"Perfect Score",  check:s=>s.bestScore>=90},
  {id:"allstyle", icon:"🎭", label:"Method Actor",   check:s=>s.styles>=6},
  {id:"speed",    icon:"⚡", label:"Speed Demon",    check:s=>s.speedWins>=1},
  {id:"teacher",  icon:"📚", label:"Scholar",        check:s=>s.lessons>=4},
];

const DAILY_TOPICS = [
  "AI should be regulated like nuclear weapons",
  "Universal Basic Income will save humanity",
  "Social media is the new tobacco",
  "Mars colonization is humanity's moral duty",
  "Meat consumption should be banned by 2040",
];

const CONF_COLORS = ["#f0c840","#4d9ef5","#3de89a","#f04858","#b06af7","#ff8c42","#26d9f0","#ffffff"];

const XP_VALS = {win:100,draw:50,loss:20,arg:8,speed:150,lesson:60};
const LEVEL_XP = 250;

const RANKS = [
  {min:0,    title:"Rookie",      icon:"🥋"},
  {min:250,  title:"Challenger",  icon:"⚔️"},
  {min:750,  title:"Debater",     icon:"🎓"},
  {min:1500, title:"Sophist",     icon:"🏛️"},
  {min:3000, title:"Rhetorician", icon:"📜"},
  {min:6000, title:"Orator",      icon:"👑"},
];
const getRank = xp => [...RANKS].reverse().find(r=>xp>=r.min) || RANKS[0];

// ══════════════════════════════════════════════════════════════════
//  STORAGE
// ══════════════════════════════════════════════════════════════════
const SK = "debateme_v4";
const store = {
  async get(){
    try{ if(window.storage){const r=await window.storage.get(SK);return r?JSON.parse(r.value):null;} }catch{}
    try{ const r=sessionStorage.getItem(SK);return r?JSON.parse(r):null; }catch{}
    return null;
  },
  async set(d){
    try{ if(window.storage){await window.storage.set(SK,JSON.stringify(d));return;} }catch{}
    try{ sessionStorage.setItem(SK,JSON.stringify(d)); }catch{}
  }
};

// ══════════════════════════════════════════════════════════════════
//  STATE REDUCER
// ══════════════════════════════════════════════════════════════════
const initState = {
  xp:0, history:[], streak:[], stylesUsed:[], lessonsCompleted:[],
  wins:0, losses:0, draws:0, bestScore:0, speedWins:0,
  weaknesses:{evidence:0,logic:0,emotion:0,structure:0},
  totalArgs:0, fallaciesSpotted:0,
};
function reducer(state, action){
  switch(action.type){
    case "LOAD": return {...state,...action.d, stylesUsed:action.d.stylesUsed||[], lessonsCompleted:action.d.lessonsCompleted||[]};
    case "ADD_XP": return {...state, xp:state.xp+action.n};
    case "DEBATE_END":{
      const {result,score,entry,style,weaknesses} = action;
      const xpG = result==="won"?XP_VALS.win:result==="draw"?XP_VALS.draw:XP_VALS.loss;
      const newStyles=[...new Set([...state.stylesUsed,style])];
      const newWeak={
        evidence:state.weaknesses.evidence+(weaknesses?.evidence||0),
        logic:state.weaknesses.logic+(weaknesses?.logic||0),
        emotion:state.weaknesses.emotion+(weaknesses?.emotion||0),
        structure:state.weaknesses.structure+(weaknesses?.structure||0),
      };
      return{...state,
        xp:state.xp+xpG,
        history:[entry,...state.history].slice(0,30),
        streak:[{result,date:entry.date},...state.streak].slice(0,14),
        stylesUsed:newStyles,
        wins:state.wins+(result==="won"?1:0),
        losses:state.losses+(result==="lost"?1:0),
        draws:state.draws+(result==="draw"?1:0),
        bestScore:Math.max(state.bestScore,parseInt(score)||0),
        weaknesses:newWeak,
      };
    }
    case "SPEED_WIN": return{...state,speedWins:state.speedWins+1,xp:state.xp+XP_VALS.speed};
    case "LESSON_DONE": return{...state,lessonsCompleted:[...new Set([...state.lessonsCompleted,action.id])],xp:state.xp+XP_VALS.lesson};
    case "ADD_ARG": return{...state,xp:state.xp+XP_VALS.arg,totalArgs:state.totalArgs+1};
    case "FALLACY": return{...state,fallaciesSpotted:state.fallaciesSpotted+1};
    default: return state;
  }
}

// ══════════════════════════════════════════════════════════════════
//  SMALL COMPONENTS
// ══════════════════════════════════════════════════════════════════
const Confetti = ({on})=> !on ? null : (
  <div className="confetti-c">
    {Array.from({length:80},(_,i)=>(
      <div key={i} className="conf" style={{
        left:`${Math.random()*100}%`,
        background:CONF_COLORS[i%CONF_COLORS.length],
        borderRadius:Math.random()>.5?"50%":"2px",
        width:`${5+Math.random()*10}px`, height:`${5+Math.random()*10}px`,
        animationDuration:`${2+Math.random()*2.5}s`,
        animationDelay:`${Math.random()*1}s`,
      }}/>
    ))}
  </div>
);

const Toast = ({msg})=> msg ? <div className="toast">{msg}</div> : null;

const XPBar = ({xp})=>{
  const level = Math.floor(xp/LEVEL_XP)+1;
  const pct = ((xp%LEVEL_XP)/LEVEL_XP)*100;
  const rank = getRank(xp);
  return(
    <div className="xp-bar">
      <div className="xp-lv">LV{level}</div>
      <div style={{flex:1}}>
        <div className="xp-title">{rank.icon} {rank.title}</div>
        <div className="xp-track" style={{marginTop:4}}><div className="xp-fill" style={{width:`${pct}%`}}/></div>
      </div>
      <div className="xp-info">{xp%LEVEL_XP}/{LEVEL_XP} XP<br/><span style={{color:"var(--muted3)"}}>{xp} total</span></div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
//  API CALL HELPER
// ══════════════════════════════════════════════════════════════════
const callClaude = async (messages, system="", maxTokens=1000)=>{
  const body = {model:"claude-sonnet-4-20250514", max_tokens:maxTokens, messages};
  if(system) body.system = system;
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body),
  });
  const d = await r.json();
  return d.content?.find(c=>c.type==="text")?.text || "";
};

// ══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export default function App(){
  const [tab,setTab] = useState("debate");
  const [theme,setTheme] = useState("dark");

  // setup state
  const [topic,setTopic] = useState("");
  const [activeCat,setActiveCat] = useState("🤖 Tech");
  const [stance,setStance] = useState("");
  const [gameMode,setGameMode] = useState("ai");   // ai | 2player | speed | ava
  const [debStyle,setDebStyle] = useState("default");
  const [diff,setDiff] = useState("medium");
  const [p2Name,setP2Name] = useState("Player 2");
  const [coachMode,setCoachMode] = useState(false);

  // debate state
  const [phase,setPhase] = useState("setup");
  const [messages,setMessages] = useState([]);
  const [argInput,setArgInput] = useState("");
  const [loading,setLoading] = useState(false);
  const [scores,setScores] = useState({you:0,ai:0});
  const [bump,setBump] = useState({you:false,ai:false});
  const [round,setRound] = useState(1);
  const [turn,setTurn] = useState("you");
  const [aiHist,setAiHist] = useState([]);
  const [showPt,setShowPt] = useState(null);
  const [timerSec,setTimerSec] = useState(30);
  const [timerOn,setTimerOn] = useState(false);
  const [timerPaused,setTimerPaused] = useState(false);
  const TMAX = gameMode==="speed" ? 10 : 30;
  const [isRec,setIsRec] = useState(false);
  const [strength,setStrength] = useState(0);
  const [confOn,setConfOn] = useState(false);
  const [toast,setToast] = useState(null);
  const [debateWeaknesses,setDebateWeaknesses] = useState({evidence:0,logic:0,emotion:0,structure:0});

  // AI vs AI state
  const [ava,setAva] = useState({a:"jordan",b:"hitchens",running:false,msgs:[],scores:{a:0,b:0},round:0});

  // replay state
  const [replay,setReplay] = useState({active:false,msgs:[],idx:0,playing:false});

  // daily challenge
  const [dailyDone,setDailyDone] = useState(false);
  const [dailyTopic] = useState(()=>DAILY_TOPICS[new Date().getDate()%DAILY_TOPICS.length]);
  const [dailyScore,setDailyScore] = useState(null);

  // tournament
  const [tournament,setTournament] = useState({active:false,bracket:[],currentMatch:0,winner:null});

  // school
  const [schoolLesson,setSchoolLesson] = useState(null);
  const [quizAnswer,setQuizAnswer] = useState(null);

  const [state,dispatch] = useReducer(reducer,initState);

  const arenaRef = useRef(null);
  const timerRef = useRef(null);
  const recRef   = useRef(null);
  const argRef   = useRef(null);

  // ── Load ──
  useEffect(()=>{
    store.get().then(d=>{ if(d) dispatch({type:"LOAD",d}); });
  },[]);
  // ── Save ──
  useEffect(()=>{
    store.set({
      xp:state.xp, history:state.history, streak:state.streak,
      stylesUsed:state.stylesUsed, lessonsCompleted:state.lessonsCompleted,
      wins:state.wins, losses:state.losses, draws:state.draws,
      bestScore:state.bestScore, speedWins:state.speedWins,
      weaknesses:state.weaknesses, totalArgs:state.totalArgs,
      fallaciesSpotted:state.fallaciesSpotted,
    });
  },[state]);
  // ── Theme ──
  useEffect(()=>{ document.documentElement.className=theme==="light"?"light":""; },[theme]);
  // ── Scroll ──
  useEffect(()=>{ if(arenaRef.current) arenaRef.current.scrollTop=arenaRef.current.scrollHeight; },[messages,loading]);
  // ── Timer ──
  useEffect(()=>{
    if(!timerOn||timerPaused){clearInterval(timerRef.current);return;}
    timerRef.current=setInterval(()=>{
      setTimerSec(s=>{
        if(s<=1){clearInterval(timerRef.current);setTimerOn(false);showToast("⏱ Time's up!");return 0;}
        return s-1;
      });
    },1000);
    return()=>clearInterval(timerRef.current);
  },[timerOn,timerPaused]);
  // ── Strength ──
  useEffect(()=>{
    const w=argInput.trim().split(/\s+/).filter(Boolean).length;
    const fact=/\d|study|research|according|evidence|data|percent|%|report|survey/i.test(argInput);
    const logic=/therefore|because|since|however|although|despite|yet|thus|consequently/i.test(argInput);
    const specific=/specifically|in fact|for example|notably|crucially/i.test(argInput);
    setStrength(Math.min(Math.min(w*5,55)+(fact?22:0)+(logic?15:0)+(specific?8:0),100));
  },[argInput]);
  // ── Keyboard shortcuts ──
  useEffect(()=>{
    const h=e=>{
      if(phase!=="debate")return;
      if((e.ctrlKey||e.metaKey)&&e.key==="Enter"&&argInput.trim()){e.preventDefault();sendArg();}
      if((e.ctrlKey||e.metaKey)&&e.key==="j"&&showJudge&&!loading){e.preventDefault();getVerdict();}
      if((e.ctrlKey||e.metaKey)&&e.key==="p"){e.preventDefault();setTimerPaused(p=>!p);}
      if((e.ctrlKey||e.metaKey)&&e.key==="k"){e.preventDefault();getSuggestions();}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[phase,argInput,loading]);
  // ── Replay playback ──
  useEffect(()=>{
    if(!replay.playing)return;
    const t=setTimeout(()=>{
      setReplay(r=>{
        if(r.idx>=r.msgs.length-1){return{...r,playing:false};}
        return{...r,idx:r.idx+1};
      });
    },1800);
    return()=>clearTimeout(t);
  },[replay.playing,replay.idx]);

  const showToast=useCallback((msg)=>{setToast(msg);setTimeout(()=>setToast(null),3200);},[]);
  const startTimer=useCallback((max=30)=>{setTimerSec(max);setTimerOn(true);setTimerPaused(false);},[]);
  const stopTimer=useCallback(()=>{clearInterval(timerRef.current);setTimerOn(false);setTimerPaused(false);},[]);
  const bumpScore=useCallback((who)=>{setBump(b=>({...b,[who]:true}));setTimeout(()=>setBump(b=>({...b,[who]:false})),500);},[]);

  const buildSys=useCallback((aiStance)=>{
    const s=DEBATER_STYLES.find(d=>d.id===debStyle)||DEBATER_STYLES[0];
    const coach=coachMode?" After your response, add 'COACH:' followed by 1 short coaching tip for the human.":"";
    return `You are a fierce debate opponent. Topic:"${topic}". You argue ${aiStance}. User argues ${stance}.
${DIFF_CONFIG[diff].prompt} ${s.prompt}${coach}
Rules: Under 110 words. If user commits a logical fallacy, write FALLACY:[name] at end. Never concede easily.`;
  },[topic,stance,diff,debStyle,coachMode]);

  // ── Start debate ──
  const startDebate=async()=>{
    if(!topic.trim()||!stance)return;
    setPhase("debate");
    setScores({you:0,ai:0});
    setRound(1);
    setTurn("you");
    setDebateWeaknesses({evidence:0,logic:0,emotion:0,structure:0});
    const tmax=gameMode==="speed"?10:30;
    setMessages([{type:"sys",text:`🥊 "${topic}" | YOU: ${stance.toUpperCase()} | ${gameMode==="2player"?p2Name:"AI"}: ${stance==="for"?"AGAINST":"FOR"}${gameMode==="speed"?" | ⚡ SPEED MODE — 10s per argument!":""}`}]);

    if(gameMode==="2player"){startTimer(tmax);return;}

    setLoading(true);
    const aiStance=stance==="for"?"against":"for";
    const sys=buildSys(aiStance);
    const init=[{role:"user",content:"Give your opening argument. Be fierce and direct."}];
    try{
      const text=await callClaude(init,sys);
      const fallacy=text.match(/FALLACY:\s*([^\n]+)/i)?.[1];
      const coach=text.match(/COACH:\s*([^\n]+)/i)?.[1];
      const clean=text.replace(/FALLACY:[^\n]*/i,"").replace(/COACH:[^\n]*/i,"").trim();
      const aiPts=2+~~(Math.random()*4);
      setScores(s=>({...s,ai:s.ai+aiPts})); bumpScore("ai");
      init.push({role:"assistant",content:text});
      setAiHist([{role:"user",content:sys},...init]);
      setMessages(prev=>[...prev,
        {type:"ai",text:clean,fallacy,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},
        ...(coach?[{type:"coach",text:"💡 Coach: "+coach}]:[]),
      ]);
    }catch{setMessages(prev=>[...prev,{type:"sys",text:"Connection error. Try again."}]);}
    finally{setLoading(false);startTimer(tmax);}
  };

  // ── Send argument ──
  const sendArg=async()=>{
    if(!argInput.trim()||loading)return;
    const userArg=argInput.trim();
    setArgInput(""); setStrength(0);
    stopTimer();
    dispatch({type:"ADD_ARG"});
    const pts=2+~~(Math.random()*4);
    setShowPt({who:"you",pts:`+${pts}`});
    setTimeout(()=>setShowPt(null),2000);

    // 2-player mode
    if(gameMode==="2player"){
      const isYou=turn==="you";
      setScores(s=>({...s,you:isYou?s.you+pts:s.you,ai:!isYou?s.ai+pts:s.ai}));
      bumpScore(isYou?"you":"ai");
      setMessages(prev=>[...prev,{type:isYou?"you":"p2",text:userArg,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);
      setRound(r=>r+1);
      setTurn(isYou?"p2":"you");
      startTimer(gameMode==="speed"?10:30);
      return;
    }

    setScores(s=>({...s,you:s.you+pts})); bumpScore("you");
    setMessages(prev=>[...prev,{type:"you",text:userArg,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);
    setLoading(true);

    // Parallel: AI response + fact-check
    const sys=aiHist[0]?.content||buildSys(stance==="for"?"against":"for");
    const updated=[...aiHist,{role:"user",content:userArg}];

    const [aiText, factText] = await Promise.allSettled([
      callClaude(updated.slice(1),sys),
      callClaude([{role:"user",content:`Fact-check in 1-2 sentences. Label: ACCURATE ✓, PARTIALLY TRUE ⚠, or MISLEADING ✗. Be concise and cite if possible. Argument: "${userArg}"`}])
    ]).then(rs=>rs.map(r=>r.status==="fulfilled"?r.value:""));

    const fallacy=aiText.match(/FALLACY:\s*([^\n]+)/i)?.[1];
    const coach=aiText.match(/COACH:\s*([^\n]+)/i)?.[1];
    const clean=aiText.replace(/FALLACY:[^\n]*/i,"").replace(/COACH:[^\n]*/i,"").trim();
    const aiPts=2+~~(Math.random()*(diff==="hard"?5:4));
    setScores(s=>({...s,ai:s.ai+aiPts})); bumpScore("ai");
    if(fallacy) dispatch({type:"FALLACY"});

    // Track weaknesses
    if(fallacy){
      const fw={...debateWeaknesses};
      if(/emotion|appeal/i.test(fallacy)) fw.emotion++;
      else if(/structure|circular/i.test(fallacy)) fw.structure++;
      else if(/evidence|generalization/i.test(fallacy)) fw.evidence++;
      else fw.logic++;
      setDebateWeaknesses(fw);
    }

    updated.push({role:"assistant",content:aiText});
    setAiHist(updated);
    setMessages(prev=>[
      ...prev,
      {type:"ai",text:clean,fallacy,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},
      ...(factText?[{type:"fact",text:factText}]:[]),
      ...(coach?[{type:"coach",text:"💡 Coach: "+coach}]:[]),
    ]);
    setRound(r=>r+1);
    setLoading(false);
    startTimer(gameMode==="speed"?10:30);
  };

  // ── Get suggestions ──
  const getSuggestions=async()=>{
    if(loading)return;
    setLoading(true);
    try{
      const ctx=messages.filter(m=>["you","ai"].includes(m.type)).slice(-4).map(m=>`${m.type==="you"?"USER":"AI"}: ${m.text}`).join("\n");
      const text=await callClaude([{role:"user",content:`Debate:"${topic}". User argues ${stance}.\nRecent:\n${ctx}\n\nSuggest 3 strong counter-arguments the user could make. Each under 30 words, numbered 1. 2. 3. Make them specific and powerful.`}]);
      setMessages(prev=>[...prev,{type:"sug",text}]);
    }catch{}
    finally{setLoading(false);}
  };

  // ── Get verdict ──
  const getVerdict=async()=>{
    setLoading(true); stopTimer();
    const full=messages.filter(m=>["you","ai","p2"].includes(m.type)).map(m=>`${m.type==="you"?"P1":m.type==="p2"?"P2":"AI"}: ${m.text}`).join("\n\n");
    try{
      const raw=await callClaude([{role:"user",content:`Judge debate:"${topic}"\n\n${full}\n\nJudge on logic(40%),evidence(30%),persuasion(30%). Be harsh.\n\nExact format:\nWINNER:[P1 or ${gameMode==="2player"?"P2":"AI"} or DRAW]\nP1_SCORE:[0-100]\nOPP_SCORE:[0-100]\nREASONING:[2-3 sentences]\nP1_BEST:[10 words]\nP1_WORST:[10 words]\nWEAK_AREA:[evidence OR logic OR emotion OR structure]\nTIPS:[3 bullets starting with •]`}]);
      const get=(pat)=>raw.match(pat)?.[1]?.trim()||"";
      const winner=get(/WINNER:\s*(\w+)/i)||"DRAW";
      const p1s=get(/P1_SCORE:\s*(\d+)/i)||"50";
      const ops=get(/OPP_SCORE:\s*(\d+)/i)||"50";
      const reasoning=get(/REASONING:\s*([\s\S]*?)(?=P1_BEST:|$)/i)||"";
      const best=get(/P1_BEST:\s*(.*)/i)||"";
      const worst=get(/P1_WORST:\s*(.*)/i)||"";
      const weakArea=get(/WEAK_AREA:\s*(.*)/i)||"logic";
      const tips=(get(/TIPS:\s*([\s\S]*)/i)||"").split("\n").filter(t=>t.trim().startsWith("•")).map(t=>t.replace("•","").trim());

      const result=winner==="P1"?"won":winner==="DRAW"?"draw":"lost";
      const fw={...debateWeaknesses};
      if(weakArea in fw) fw[weakArea]++;

      setMessages(prev=>[...prev,{type:"verd",winner,p1s,ops,reasoning,best,worst,tips,weakArea}]);
      setPhase("done");

      const entry={id:Date.now(),topic,stance,result,score:p1s,
        date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short"}),
        rounds:round,style:debStyle,diff,mode:gameMode};
      dispatch({type:"DEBATE_END",result,score:p1s,entry,style:debStyle,weaknesses:fw});

      // Save replay
      setReplay({active:false,msgs:[...messages,{type:"verd",winner,p1s,ops,reasoning,best,worst,tips}],idx:0,playing:false});

      // Daily challenge check
      if(topic===dailyTopic&&!dailyDone){setDailyDone(true);setDailyScore(parseInt(p1s));showToast("🏅 Daily Challenge complete! +50 bonus XP");dispatch({type:"ADD_XP",n:50});}

      if(result==="won"){setConfOn(true);setTimeout(()=>setConfOn(false),4500);showToast(`🏆 You won! +${DIFF_CONFIG[diff].xp} XP`);}
      else if(result==="draw"){showToast(`🤝 Draw! +${XP_VALS.draw} XP`);}
      else{showToast(`💀 You lost. +${XP_VALS.loss} XP — keep going!`);}
    }catch{setMessages(prev=>[...prev,{type:"sys",text:"Verdict error. Try again."}]);}
    finally{setLoading(false);}
  };

  // ── AI vs AI ──
  const runAva=async()=>{
    if(ava.running||!topic.trim())return;
    setAva(a=>({...a,running:true,msgs:[],scores:{a:0,b:0},round:0}));
    const styA=DEBATER_STYLES.find(d=>d.id===ava.a)||DEBATER_STYLES[1];
    const styB=DEBATER_STYLES.find(d=>d.id===ava.b)||DEBATER_STYLES[2];
    const sysA=`You are debating AS ${styA.label}. Topic:"${topic}". Argue FOR. ${styA.prompt} Under 80 words. Be fierce.`;
    const sysB=`You are debating AS ${styB.label}. Topic:"${topic}". Argue AGAINST. ${styB.prompt} Under 80 words. Be fierce.`;
    let histA=[],histB=[];
    const addMsg=(type,text,score)=>{
      setAva(a=>({...a,msgs:[...a.msgs,{type,text}],scores:{...a.scores,[type]:a.scores[type]+score},round:a.round+1}));
    };
    try{
      for(let i=0;i<4;i++){
        const promptA=i===0?"Give your opening argument.":(histB.at(-1)?.content||"Respond to opponent.");
        histA.push({role:"user",content:promptA});
        const tA=await callClaude(histA,sysA);
        histA.push({role:"assistant",content:tA});
        const pA=3+~~(Math.random()*4);
        addMsg("a",tA.slice(0,200),pA);
        await new Promise(r=>setTimeout(r,500));

        histB.push({role:"user",content:tA});
        const tB=await callClaude(histB,sysB);
        histB.push({role:"assistant",content:tB});
        const pB=3+~~(Math.random()*4);
        addMsg("b",tB.slice(0,200),pB);
        await new Promise(r=>setTimeout(r,500));
      }
    }catch{}
    finally{setAva(a=>({...a,running:false}));}
  };

  // ── Tournament ──
  const startTournament=()=>{
    const opponents=DEBATER_STYLES.filter(d=>d.id!=="default").map(d=>d.label);
    const bracket=[
      [{p1:"YOU",p2:opponents[0],winner:null},{p1:opponents[1],p2:opponents[2],winner:opponents[1]}],
      [{p1:"YOU",p2:opponents[1],winner:null}],
      [{p1:"YOU",p2:opponents[3],winner:null}],
    ];
    setTournament({active:true,bracket,currentMatch:0,winner:null});
    showToast("🏆 Tournament started! Win 3 debates to become champion.");
  };

  // ── Share / Export ──
  const shareResult=()=>{
    const v=messages.findLast(m=>m.type==="verd");
    if(!v)return;
    const txt=`I ${v.winner==="P1"?"WON":"LOST"} a debate on "${topic}" with score ${v.p1s}/100! 🥊 #DebateMeAI`;
    navigator.clipboard?.writeText(txt).then(()=>showToast("📋 Copied!"));
  };
  const exportDebate=()=>{
    const lines=messages.filter(m=>["you","ai","sys"].includes(m.type)).map(m=>`[${m.type.toUpperCase()}] ${m.text}`).join("\n\n");
    const b=new Blob([`DEBATEME AI — DEBATE TRANSCRIPT\nTopic: ${topic}\nDate: ${new Date().toLocaleString()}\n\n${lines}`],{type:"text/plain"});
    const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`debate-${Date.now()}.txt`;a.click();
    showToast("📄 Exported!");
  };

  // ── Reset ──
  const reset=()=>{
    setPhase("setup");setTopic("");setStance("");setMessages([]);
    setArgInput("");setScores({you:0,ai:0});setRound(1);
    setTurn("you");setAiHist([]);stopTimer();setStrength(0);
    setDebateWeaknesses({evidence:0,logic:0,emotion:0,structure:0});
  };

  // ── Voice ──
  const toggleVoice=()=>{
    if(isRec){recRef.current?.stop();setIsRec(false);return;}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){showToast("Voice not supported in this browser");return;}
    const rec=new SR();
    rec.lang="hi-IN";rec.interimResults=false;rec.continuous=false;
    rec.onresult=e=>{const t=e.results[0][0].transcript;setArgInput(p=>p?p+" "+t:t);argRef.current?.focus();};
    rec.onerror=()=>setIsRec(false);
    rec.onend=()=>setIsRec(false);
    rec.start();recRef.current=rec;setIsRec(true);
  };

  // ── Computed ──
  const debateCount=messages.filter(m=>m.type==="you").length;
  const p2Count=messages.filter(m=>m.type==="p2").length;
  const showJudge=gameMode==="ai"?debateCount>=3:(debateCount+p2Count)>=6;
  const tPct=(timerSec/(gameMode==="speed"?10:30))*100;
  const tColor=timerSec<=5?"var(--red)":timerSec<=10?"var(--orange)":"var(--gold)";
  const totalDebates=state.wins+state.losses+state.draws;
  const winRate=totalDebates?Math.round((state.wins/totalDebates)*100):0;
  const curStreak=(()=>{let s=0;for(const d of state.streak){if(d.result==="won")s++;else break;}return s;})();
  const statsForAch={total:totalDebates,wins:state.wins,streak:curStreak,bestScore:state.bestScore,styles:state.stylesUsed.length,speedWins:state.speedWins,lessons:state.lessonsCompleted.length};
  const earnedAch=ACHIEVEMENTS_DEF.filter(a=>a.check(statsForAch)).map(a=>a.id);
  const maxWeak=Math.max(1,...Object.values(state.weaknesses));
  const simLb=[
    {name:"DebateMaster_IN",score:3200,badge:"🔥 Undefeated",t:"▲"},
    {name:"LogicLord99",score:2650,badge:"⚡ x9 streak",t:"▲"},
    {name:"SocraticSlayer",score:2180,badge:"🧠 Fact-King",t:"▼"},
    {name:"RhetoricalRaj",score:1590,badge:"🎓 Rising",t:"▲"},
    {name:"YOU",score:state.xp,badge:curStreak>0?`🔥 x${curStreak} streak`:"Keep going!",t:"—"},
    {name:"ArgumentAce",score:720,badge:"📚 Scholar",t:"▼"},
  ].sort((a,b)=>b.score-a.score);

  // Daily leaderboard (simulated)
  const dailyLb=[
    {name:"FlashDebater",score:92,isYou:false},
    {name:"LogicQueen",score:87,isYou:false},
    {name:"YOU",score:dailyScore||0,isYou:true},
    {name:"SpeechKing",score:71,isYou:false},
  ].filter(x=>x.score>0).sort((a,b)=>b.score-a.score);

  // ══════════════════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════════════════
  return(
    <>
      <style>{CSS}</style>
      <Confetti on={confOn}/>
      <Toast msg={toast}/>
      <div className="app">

        {/* ── HEADER ── */}
        <div className="hdr">
          <div className="hdr-eye">⚔ AI-Powered Debate Arena — v4.0</div>
          <div className="hdr-title">DEBATE<em>ME</em></div>
          <div className="hdr-sub">challenge your ideas · get destroyed · think better</div>
          <div className="hdr-actions">
            <button className="icon-btn" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>{theme==="dark"?"☀️":"🌙"}</button>
            <button className={`icon-btn${coachMode?" on":""}`} onClick={()=>{setCoachMode(c=>!c);showToast(coachMode?"Coach mode OFF":"🧠 Coach mode ON");}} title="Toggle AI Coach">🧠</button>
            {phase==="debate"&&<button className="icon-btn" onClick={exportDebate} title="Export">📄</button>}
          </div>
        </div>

        {/* ── XP BAR ── */}
        <XPBar xp={state.xp}/>

        {/* ── NAV ── */}
        <div className="nav">
          {[["debate","⚔ DEBATE"],["school","📚 SCHOOL"],["dashboard","📊 STATS"],["leaderboard","🏆 RANKS"],["daily","🎯 DAILY"],["tournament","🥊 TOURNEY"]].map(([t,l])=>(
            <button key={t} className={`nav-tab${tab===t?" on":""}`} onClick={()=>setTab(t)}>{l}</button>
          ))}
        </div>

        {/* ════════ DEBATE TAB ════════ */}
        {tab==="debate"&&(<>
          {phase==="setup"&&(
            <div className="setup">
              {/* Topic */}
              <div className="slbl" style={{marginBottom:10}}>Topic</div>
              <textarea className="t-input" rows={2} placeholder="Enter your debate topic..." value={topic} onChange={e=>setTopic(e.target.value)}/>

              {/* Categories */}
              <div className="cat-row">
                {Object.keys(TOPIC_CATS).map(c=>(
                  <button key={c} className={`cat-btn${activeCat===c?" on":""}`} onClick={()=>setActiveCat(c)}>{c}</button>
                ))}
              </div>
              <div className="chips">
                {(TOPIC_CATS[activeCat]||[]).map(t=>(
                  <button key={t} className="chip" onClick={()=>setTopic(t)}>{t}</button>
                ))}
              </div>

              {/* Daily topic shortcut */}
              <div className="news-ticker" onClick={()=>setTopic(dailyTopic)}>
                <span>🎯</span>
                <span><strong>Today's Challenge:</strong> {dailyTopic}</span>
                <span style={{color:"var(--muted3)",marginLeft:"auto",fontSize:10}}>click to use</span>
              </div>

              {/* Mode */}
              <div style={{marginTop:22}}><div className="slbl">Game Mode</div></div>
              <div className="opt-row">
                {[["ai","🤖 VS AI"],["2player","👥 2 Players"],["speed","⚡ Speed (10s)"],["ava","🎭 AI vs AI"]].map(([m,l])=>(
                  <button key={m} className={`opt${gameMode===m?" on":""}`} onClick={()=>setGameMode(m)}>{l}</button>
                ))}
              </div>
              {gameMode==="2player"&&<input className="aux-input" placeholder="Player 2 name..." value={p2Name} onChange={e=>setP2Name(e.target.value||"Player 2")}/>}
              {gameMode==="speed"&&<div style={{marginTop:8,fontSize:11,color:"var(--orange)",fontFamily:"var(--font-b)",letterSpacing:1}}>⚡ 10 seconds per argument — pure instinct mode!</div>}
              {gameMode==="ava"&&(
                <div style={{marginTop:12}}>
                  <div className="slbl">Choose Fighters</div>
                  <div className="opt-row" style={{marginBottom:8}}>
                    {DEBATER_STYLES.filter(d=>d.id!=="default").map(d=>(
                      <button key={d.id} className={`opt${ava.a===d.id?" on-p":""}`}
                        onClick={()=>setAva(a=>({...a,a:d.id}))} style={{fontSize:10}}>
                        {d.icon} {d.label}
                      </button>
                    ))}
                  </div>
                  <div style={{fontSize:10,color:"var(--muted3)",marginBottom:6,fontFamily:"var(--font-b)"}}>VS</div>
                  <div className="opt-row">
                    {DEBATER_STYLES.filter(d=>d.id!=="default").map(d=>(
                      <button key={d.id} className={`opt${ava.b===d.id?" on-b":""}`}
                        onClick={()=>setAva(a=>({...a,b:d.id}))} style={{fontSize:10}}>
                        {d.icon} {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stance */}
              <div style={{marginTop:22}}><div className="slbl">Your Stance</div></div>
              <div className="stance-row">
                <button className={`stance${stance==="for"?" sfor":""}`} onClick={()=>setStance("for")}>✓ FOR THIS</button>
                <button className={`stance${stance==="against"?" sagainst":""}`} onClick={()=>setStance("against")}>✗ AGAINST THIS</button>
              </div>

              {/* AI Options (not for 2player/ava) */}
              {!["2player","ava"].includes(gameMode)&&(<>
                <div style={{marginTop:22}}><div className="slbl">AI Debater Style</div></div>
                <div className="opt-row">
                  {DEBATER_STYLES.map(d=>(
                    <button key={d.id} className={`opt${debStyle===d.id?" on-p":""}`}
                      onClick={()=>setDebStyle(d.id)} title={d.prompt||"Default"} style={{fontSize:10}}>
                      {d.icon} {d.label}
                    </button>
                  ))}
                </div>
                <div style={{marginTop:14}}><div className="slbl">Difficulty</div></div>
                <div className="opt-row">
                  {Object.entries(DIFF_CONFIG).map(([k,v])=>(
                    <button key={k} className={`opt${diff===k?" on":""}`} onClick={()=>setDiff(k)}>{v.label}</button>
                  ))}
                </div>
              </>)}

              {/* AI vs AI mode */}
              {gameMode==="ava"?(
                <button className="start-btn" style={{background:"var(--purple)",boxShadow:"0 4px 24px rgba(176,106,247,.3)"}}
                  onClick={()=>{if(topic.trim()){runAva();setPhase("ava");}}} disabled={!topic.trim()||ava.a===ava.b}>
                  ⚔ START AI BATTLE
                </button>
              ):(
                <button className="start-btn" onClick={startDebate} disabled={!topic.trim()||!stance||loading}>
                  {loading?"PREPARING…":"ENTER THE RING →"}
                </button>
              )}
            </div>
          )}

          {/* ── AI vs AI phase ── */}
          {phase==="ava"&&(
            <div className="ava-wrap">
              <div className="ava-fighters">
                {[{key:"a",id:ava.a},{key:"b",id:ava.b}].map(({key,id})=>{
                  const sty=DEBATER_STYLES.find(d=>d.id===id)||DEBATER_STYLES[0];
                  return(
                    <div key={key} className="ava-fighter">
                      <div className="ava-f-name" style={{color:sty.color}}>{sty.icon} {sty.label}</div>
                      <div className="ava-f-score" style={{color:sty.color}}>{ava.scores[key]}</div>
                      <div style={{fontSize:9,color:"var(--muted3)",marginTop:4,fontFamily:"var(--font-b)",letterSpacing:1}}>
                        {key==="a"?"FOR":"AGAINST"}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{fontFamily:"var(--font-h)",fontSize:16,color:"var(--gold)",textAlign:"center",marginBottom:12,letterSpacing:2}}>
                TOPIC: {topic}
              </div>
              <div className="ava-arena">
                {ava.msgs.map((m,i)=>{
                  const sty=DEBATER_STYLES.find(d=>d.id===ava[m.type])||DEBATER_STYLES[0];
                  return(
                    <div key={i} className={`replay-bubble ${m.type==="a"?"rb-you":"rb-ai"}`} style={{borderColor:sty.color}}>
                      <div style={{fontSize:9,color:sty.color,letterSpacing:2,marginBottom:6,fontFamily:"var(--font-b)"}}>{sty.icon} {sty.label}</div>
                      {m.text}
                    </div>
                  );
                })}
                {ava.running&&<div className="typing"><div className="td"/><div className="td"/><div className="td"/><span style={{marginLeft:6,fontSize:9}}>AI BATTLING</span></div>}
              </div>
              {!ava.running&&(
                <div style={{textAlign:"center",marginTop:16}}>
                  <div style={{fontFamily:"var(--font-h)",fontSize:20,color:"var(--gold)",marginBottom:8}}>
                    {ava.scores.a>ava.scores.b?"🏆 "+DEBATER_STYLES.find(d=>d.id===ava.a)?.label+" WINS":ava.scores.b>ava.scores.a?"🏆 "+DEBATER_STYLES.find(d=>d.id===ava.b)?.label+" WINS":"🤝 DRAW"}
                  </div>
                </div>
              )}
              <button className="new-btn" onClick={()=>{setPhase("setup");setAva(a=>({...a,msgs:[],scores:{a:0,b:0},round:0}));}}>↺ BACK TO SETUP</button>
            </div>
          )}

          {/* ── Debate phase ── */}
          {(phase==="debate"||phase==="done")&&(<>
            {/* Scoreboard */}
            <div className="scoreboard">
              <div className="fighter f-you">
                <div className="f-name">YOU</div>
                <div className={`f-score${bump.you?" bump":""}`}>{scores.you}</div>
              </div>
              <div className="vs-col">
                <div className="vs-txt">VS</div>
                <div className="round-txt">ROUND {round}</div>
                <div className="mode-txt">{gameMode==="speed"?"⚡ SPEED":gameMode==="2player"?"👥 2P":"🤖 AI"}</div>
              </div>
              <div className={`fighter${gameMode==="2player"?" f-p2":" f-ai"}`}>
                <div className="f-name">{gameMode==="2player"?p2Name.slice(0,8).toUpperCase():"AI"}</div>
                <div className={`f-score${bump.ai?" bump":""}`}>{scores.ai}</div>
              </div>
            </div>

            {/* Speed banner */}
            {gameMode==="speed"&&phase==="debate"&&<div className="speed-banner">⚡ SPEED MODE — {timerSec}s per argument — NO THINKING TIME</div>}

            {/* Timer */}
            {phase==="debate"&&gameMode!=="speed"&&(
              <div className="timer-wrap">
                <div className="timer-row">
                  <div className={`timer-num${timerSec<=8?" warn":" ok"}`}>{String(timerSec).padStart(2,"0")}s</div>
                  <div className="timer-track"><div className="timer-fill" style={{width:`${tPct}%`,background:tColor}}/></div>
                  <div className="t-actions">
                    <button className="t-btn" onClick={()=>setTimerPaused(p=>!p)}>{timerPaused?"▶":"⏸"}</button>
                    <button className="t-btn" onClick={()=>startTimer(30)}>↺</button>
                  </div>
                </div>
              </div>
            )}

            {/* Turn badge */}
            {gameMode==="2player"&&phase==="debate"&&(
              <div className={`turn-badge${turn==="you"?" turn-you":" turn-p2"}`}>
                {turn==="you"?"⚔ YOUR TURN":`⚔ ${p2Name.toUpperCase()}'S TURN`}
              </div>
            )}

            {/* Arena */}
            <div className="arena" ref={arenaRef}>
              {messages.map((msg,i)=>{
                if(msg.type==="sys") return <div className="bubble b-sys" key={i}>{msg.text}</div>;
                if(msg.type==="fact") return(
                  <div className="bubble b-fact" style={{maxWidth:"100%"}} key={i}>
                    <div className="b-lbl">⚡ FACT CHECK</div>
                    <div className="b-txt" style={{fontSize:12}}>{msg.text}</div>
                  </div>
                );
                if(msg.type==="sug") return(
                  <div className="bubble b-sug" style={{maxWidth:"100%"}} key={i}>
                    <div className="b-lbl">💡 ARGUMENT SUGGESTIONS</div>
                    <div className="b-txt" style={{fontSize:12,whiteSpace:"pre-line"}}>{msg.text}</div>
                  </div>
                );
                if(msg.type==="coach") return(
                  <div className="bubble b-coach" style={{maxWidth:"100%"}} key={i}>
                    <div className="b-lbl">🧠 COACH</div>
                    <div className="b-txt" style={{fontSize:12}}>{msg.text}</div>
                  </div>
                );
                if(msg.type==="news") return(
                  <div className="bubble b-news" style={{maxWidth:"100%"}} key={i}>
                    <div className="b-lbl">📡 NEWS CONTEXT</div>
                    <div className="b-txt" style={{fontSize:12}}>{msg.text}</div>
                  </div>
                );
                if(msg.type==="verd") return(
                  <div className="bubble b-verd" key={i} style={{padding:22}}>
                    <div className="b-lbl">⚖ FINAL VERDICT</div>
                    <div className="verd-winner" style={{color:msg.winner==="P1"?"var(--green)":msg.winner==="DRAW"?"var(--gold)":"var(--red)"}}>
                      {msg.winner==="P1"?"🏆 YOU WIN":msg.winner==="DRAW"?"🤝 DRAW":"💀 YOU LOST"}
                    </div>
                    <div className="verd-body">{msg.reasoning}</div>
                    <div className="verd-scores">
                      <div className="vscore"><div className="vscore-lbl">Your Score</div><div className="vscore-val" style={{color:"var(--blue)"}}>{msg.p1s}</div></div>
                      <div className="vscore"><div className="vscore-lbl">{gameMode==="2player"?p2Name:"AI"} Score</div><div className="vscore-val" style={{color:"var(--red)"}}>{msg.ops}</div></div>
                    </div>
                    {(msg.best||msg.worst)&&(
                      <div style={{marginTop:12,fontSize:12,color:"var(--muted3)",lineHeight:1.7,fontFamily:"var(--font-b)"}}>
                        <span style={{color:"var(--green)"}}>✓ Best:</span> {msg.best}<br/>
                        <span style={{color:"var(--red)"}}>✗ Weak:</span> {msg.worst}
                        {msg.weakArea&&<><br/><span style={{color:"var(--orange)"}}>⚠ Weak area:</span> {msg.weakArea}</>}
                      </div>
                    )}
                    {msg.tips?.length>0&&(
                      <div className="improve-list" style={{marginTop:16}}>
                        <div style={{fontSize:9,letterSpacing:2,color:"var(--green)",textTransform:"uppercase",marginBottom:8,fontFamily:"var(--font-b)"}}>📝 How to Improve</div>
                        {msg.tips.map((t,ti)=><div className="improve-item" key={ti}>{t}</div>)}
                      </div>
                    )}
                    {/* Heatmap in verdict */}
                    <div style={{marginTop:16}}>
                      <div style={{fontSize:9,color:"var(--muted3)",letterSpacing:2,textTransform:"uppercase",marginBottom:8,fontFamily:"var(--font-b)"}}>📊 Your Weakness Heatmap</div>
                      <div className="heatmap">
                        {Object.entries(debateWeaknesses).map(([k,v])=>{
                          const pct=totalDebates?Math.min((state.weaknesses[k]||0)/Math.max(1,Object.values(state.weaknesses).reduce((a,b)=>a+b,0))*100,100):0;
                          const color=pct>60?"var(--red)":pct>30?"var(--orange)":"var(--green)";
                          return(
                            <div className="hm-item" key={k}>
                              <div className="hm-lbl">{k}</div>
                              <div className="hm-bar"><div className="hm-fill" style={{width:`${v*20}%`,background:color}}/></div>
                              <div className="hm-val" style={{color}}>{v} errors</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="verd-actions">
                      <button className="va-btn" onClick={shareResult}>📋 Share</button>
                      <button className="va-btn" onClick={exportDebate}>📄 Export</button>
                      <button className="va-btn" onClick={()=>{setReplay(r=>({...r,active:true,idx:0}));setTab("replay");}}>▶ Replay</button>
                    </div>
                    <button className="new-btn" onClick={reset}>↺ NEW DEBATE</button>
                  </div>
                );
                // Normal bubble
                const isYouMsg=msg.type==="you";
                const isLastYou=isYouMsg&&i===messages.map((m,j)=>m.type==="you"?j:-1).filter(j=>j>=0).at(-1);
                return(
                  <div className={`bubble b-${msg.type}`} key={i}>
                    {showPt?.who==="you"&&isLastYou&&<div className="pt-flash">{showPt.pts}</div>}
                    <div className="b-lbl">
                      <span>{msg.type==="you"?"YOUR ARGUMENT":msg.type==="p2"?`${p2Name.toUpperCase()}'S ARGUMENT`:`AI (${DEBATER_STYLES.find(d=>d.id===debStyle)?.label||"AI"})`}</span>
                      {msg.time&&<span style={{fontSize:9,color:"var(--muted)",fontWeight:300}}>{msg.time}</span>}
                    </div>
                    <div className="b-txt">{msg.text}</div>
                    {msg.fallacy&&<div className="fallacy">⚠ FALLACY: {msg.fallacy}</div>}
                  </div>
                );
              })}
              {loading&&<div className="typing"><div className="td"/><div className="td"/><div className="td"/><span style={{marginLeft:8,fontSize:9}}>AI THINKING</span></div>}
            </div>

            {/* Input area */}
            {phase==="debate"&&(
              <div className="input-wrap">
                <div className="sc-row">
                  <span className="sc"><kbd>Ctrl+Enter</kbd> Argue</span>
                  <span className="sc"><kbd>Ctrl+J</kbd> Judge</span>
                  <span className="sc"><kbd>Ctrl+P</kbd> Pause</span>
                  <span className="sc"><kbd>Ctrl+K</kbd> Suggest</span>
                </div>
                {argInput.trim()&&(
                  <div className="strength-wrap">
                    <div className="strength-lbl">Argument Strength</div>
                    <div className="strength-track">
                      <div className="strength-fill" style={{width:`${strength}%`,background:strength>=70?"var(--green)":strength>=40?"var(--gold)":"var(--red)"}}/>
                    </div>
                    <div className="strength-txt" style={{color:strength>=70?"var(--green)":strength>=40?"var(--gold)":"var(--red)"}}>
                      {strength>=70?"💪 Strong":strength>=40?"👍 Decent":"⚠ Weak"} ({strength}%)
                    </div>
                  </div>
                )}
                <div className="char-count" style={{color:argInput.length>450?"var(--orange)":"var(--muted3)"}}>
                  {argInput.length}/500
                </div>
                <div className="input-row">
                  <textarea className="arg-input" ref={argRef}
                    placeholder={gameMode==="2player"?`${turn==="you"?"Your":p2Name+"'s"} argument (Enter to send)`:"Your argument… (Ctrl+Enter)"}
                    value={argInput} onChange={e=>setArgInput(e.target.value.slice(0,500))}
                    disabled={loading} rows={2}
                    onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendArg();}}}
                  />
                  <button className={`btn btn-mic${isRec?" rec":""}`} onClick={toggleVoice} title="Voice (Hindi/English)">🎙</button>
                  {gameMode==="ai"&&<button className="btn btn-cyan" onClick={getSuggestions} disabled={loading||debateCount<1} title="Get suggestions">💡</button>}
                  <button className="btn btn-blue" onClick={sendArg} disabled={loading||!argInput.trim()}>ARGUE</button>
                  {showJudge&&<button className="btn btn-gold" onClick={getVerdict} disabled={loading}>JUDGE</button>}
                </div>
                {!showJudge&&<div className="j-hint">{gameMode==="ai"?`${Math.max(0,3-debateCount)} more argument${3-debateCount===1?"":"s"} until Judge`:`${Math.max(0,6-debateCount-p2Count)} more arguments until Judge`}</div>}
              </div>
            )}
          </>)}
        </>)}

        {/* ════════ SCHOOL TAB ════════ */}
        {tab==="school"&&(
          <div className="school-wrap">
            {schoolLesson===null?(
              <>
                <div className="slbl" style={{marginBottom:16}}>Debate School — Learn & Earn XP</div>
                <div className="lesson-grid">
                  {LESSONS.map(l=>{
                    const done=state.lessonsCompleted.includes(l.id);
                    return(
                      <div key={l.id} className={`lesson-card${done?" done":""}`} onClick={()=>{setSchoolLesson(l);setQuizAnswer(null);}}>
                        <div className="lesson-icon">{l.icon}</div>
                        <div className="lesson-title">{l.title}</div>
                        <div className="lesson-desc">{l.desc}</div>
                        {done&&<div className="lesson-badge">✓ COMPLETED · +{XP_VALS.lesson} XP earned</div>}
                        {!done&&<div style={{fontSize:9,color:"var(--gold)",marginTop:6,fontFamily:"var(--font-b)",letterSpacing:1}}>+{XP_VALS.lesson} XP on completion</div>}
                      </div>
                    );
                  })}
                </div>
                <div className="slbl">Progress</div>
                <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"16px 18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:12,color:"var(--text2)"}}>Lessons completed</span>
                    <span style={{fontFamily:"var(--font-h)",fontSize:18,color:"var(--gold)"}}>{state.lessonsCompleted.length}/{LESSONS.length}</span>
                  </div>
                  <div className="xp-track" style={{height:6}}><div className="xp-fill" style={{width:`${(state.lessonsCompleted.length/LESSONS.length)*100}%`}}/></div>
                </div>
              </>
            ):(
              <div className="lesson-detail">
                <button className="back-btn" onClick={()=>setSchoolLesson(null)}>← Back to lessons</button>
                <div className="ld-title">{schoolLesson.icon} {schoolLesson.title}</div>
                <div className="ld-body" style={{whiteSpace:"pre-line"}}>{schoolLesson.body}</div>
                <div className="ld-example" style={{whiteSpace:"pre-line"}}>{schoolLesson.example}</div>
                <div className="ld-quiz">
                  <div style={{fontSize:9,color:"var(--gold)",letterSpacing:2,marginBottom:10,fontFamily:"var(--font-b)"}}>✏️ QUICK QUIZ</div>
                  <div className="ld-q">{schoolLesson.quiz.q}</div>
                  <div className="ld-opts">
                    {schoolLesson.quiz.opts.map((o,i)=>{
                      let cls="";
                      if(quizAnswer!==null){
                        if(i===schoolLesson.quiz.correct) cls=" correct";
                        else if(i===quizAnswer&&i!==schoolLesson.quiz.correct) cls=" wrong";
                      }
                      return(
                        <button key={i} className={`ld-opt${cls}`}
                          disabled={quizAnswer!==null}
                          onClick={()=>{
                            setQuizAnswer(i);
                            if(i===schoolLesson.quiz.correct){
                              showToast("✅ Correct! +"+XP_VALS.lesson+" XP");
                              if(!state.lessonsCompleted.includes(schoolLesson.id)) dispatch({type:"LESSON_DONE",id:schoolLesson.id});
                            }else{
                              showToast("❌ Wrong — try again next time!");
                            }
                          }}>
                          {String.fromCharCode(65+i)}. {o}
                        </button>
                      );
                    })}
                  </div>
                  {quizAnswer!==null&&(
                    <div style={{marginTop:12,fontSize:12,color:quizAnswer===schoolLesson.quiz.correct?"var(--green)":"var(--red)",fontFamily:"var(--font-b)"}}>
                      {quizAnswer===schoolLesson.quiz.correct
                        ?"✅ Correct! Well done. Apply this in your next debate."
                        :`❌ The correct answer is: ${schoolLesson.quiz.opts[schoolLesson.quiz.correct]}`}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════ STATS TAB ════════ */}
        {tab==="dashboard"&&(
          <div className="dash">
            <div className="dash-grid">
              <div className="dash-card"><div className="dc-val" style={{color:"var(--gold)"}}>{totalDebates}</div><div className="dc-lbl">Debates</div></div>
              <div className="dash-card"><div className="dc-val" style={{color:"var(--green)"}}>{state.wins}</div><div className="dc-lbl">Wins</div><div className="dc-sub">{winRate}% win rate</div></div>
              <div className="dash-card"><div className="dc-val" style={{color:"var(--red)"}}>{state.losses}</div><div className="dc-lbl">Losses</div></div>
              <div className="dash-card"><div className="dc-val" style={{color:"var(--orange)"}}>{curStreak}</div><div className="dc-lbl">Streak</div></div>
              <div className="dash-card"><div className="dc-val" style={{color:"var(--purple)"}}>{state.bestScore}</div><div className="dc-lbl">Best Score</div></div>
              <div className="dash-card"><div className="dc-val" style={{color:"var(--cyan)"}}>{state.xp}</div><div className="dc-lbl">Total XP</div></div>
              <div className="dash-card"><div className="dc-val" style={{color:"var(--blue)"}}>{state.totalArgs}</div><div className="dc-lbl">Arguments</div></div>
              <div className="dash-card"><div className="dc-val" style={{color:"var(--red)"}}>{state.fallaciesSpotted}</div><div className="dc-lbl">Fallacies Caught</div></div>
            </div>

            {/* Weakness Heatmap */}
            <div className="weak-panel">
              <div className="slbl">📊 Your Weakness Heatmap</div>
              <div style={{fontSize:11,color:"var(--muted3)",fontFamily:"var(--font-b)",marginBottom:4}}>Based on all your debates — where you keep making errors</div>
              <div className="weak-grid">
                {Object.entries(state.weaknesses).map(([k,v])=>{
                  const pct=(v/maxWeak)*100;
                  const color=pct>60?"var(--red)":pct>30?"var(--orange)":"var(--green)";
                  const hints={evidence:"Cite more data & studies",logic:"Watch for fallacies",emotion:"Don't over-rely on pathos",structure:"Use PEEL framework"};
                  return(
                    <div className="weak-item" key={k}>
                      <div className="weak-lbl">{k}</div>
                      <div className="weak-bar"><div className="weak-fill" style={{width:`${pct}%`,background:color}}/></div>
                      <div className="weak-val" style={{color}}>{v} errors</div>
                      <div className="weak-hint">{hints[k]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="slbl" style={{marginBottom:12}}>Achievements — {earnedAch.length}/{ACHIEVEMENTS_DEF.length}</div>
            <div className="ach-grid" style={{marginBottom:24}}>
              {ACHIEVEMENTS_DEF.map(a=>(
                <div key={a.id} className={`ach${earnedAch.includes(a.id)?" earned":" locked"}`} title={a.id}>
                  {a.icon} {a.label}
                </div>
              ))}
            </div>

            {/* History */}
            <div className="slbl" style={{marginBottom:12}}>Recent Debates ({state.history.length})</div>
            {state.history.length===0?(
              <div className="empty-dash"><div className="empty-icon">📜</div>No debates yet.<br/>Start your first debate!</div>
            ):(
              <div className="h-list">
                {state.history.map(h=>(
                  <div key={h.id} className={`h-item ${h.result}`}>
                    <div className="h-top">
                      <div>
                        <div className="h-topic">{h.topic}</div>
                        <div className="h-meta">
                          {h.date} · R{h.rounds} · {h.stance?.toUpperCase()} · Score:{" "}
                          <span style={{color:h.result==="won"?"var(--green)":h.result==="lost"?"var(--red)":"var(--gold)"}}>{h.score}</span>
                          {h.style&&" · "+DEBATER_STYLES.find(s=>s.id===h.style)?.label}
                          {h.diff&&" · "+h.diff}
                          {h.mode==="speed"&&" · ⚡"}
                        </div>
                      </div>
                      <div className="h-res" style={{color:h.result==="won"?"var(--green)":h.result==="lost"?"var(--red)":"var(--gold)"}}>
                        {h.result==="won"?"🏆W":h.result==="lost"?"💀L":"🤝D"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════ LEADERBOARD TAB ════════ */}
        {tab==="leaderboard"&&(
          <div className="lb-wrap">
            <div className="slbl">Win Streak — Last {Math.min(state.streak.length,14)} Debates</div>
            <div className="streak-grid">
              {state.streak.length===0
                ?Array.from({length:7}).map((_,i)=><div key={i} className="s-day se">—</div>)
                :state.streak.map((d,i)=>(
                  <div key={i} title={d.date} className={`s-day${d.result==="won"?" sw":d.result==="lost"?" sl":" sd"}`}>
                    {d.result==="won"?"W":d.result==="lost"?"L":"D"}
                  </div>
                ))}
            </div>

            <div className="slbl" style={{marginBottom:12}}>Global Rankings</div>
            <div className="lb-list">
              {simLb.map((p,i)=>{
                const rc=i===0?"g":i===1?"s":i===2?"b":"";
                return(
                  <div key={p.name} className={`lb-row${p.name==="YOU"?" you":""}`}>
                    <div className={`lb-rank ${rc}`}>{i+1}</div>
                    <div className="lb-info">
                      <div className="lb-name">{p.name==="YOU"?"👤 YOU":p.name}</div>
                      <div className="lb-badge">{p.badge}</div>
                    </div>
                    <div style={{fontSize:11,color:p.t==="▲"?"var(--green)":p.t==="▼"?"var(--red)":"var(--muted)"}}>{p.t}</div>
                    <div className="lb-score">{p.score}</div>
                  </div>
                );
              })}
            </div>

            <div className="slbl" style={{marginBottom:12}}>Achievements — {earnedAch.length}/{ACHIEVEMENTS_DEF.length} Unlocked</div>
            <div className="ach-grid">
              {ACHIEVEMENTS_DEF.map(a=>(
                <div key={a.id} className={`ach${earnedAch.includes(a.id)?" earned":" locked"}`}>{a.icon} {a.label}</div>
              ))}
            </div>
          </div>
        )}

        {/* ════════ DAILY CHALLENGE TAB ════════ */}
        {tab==="daily"&&(
          <div className="daily-wrap">
            <div className="daily-card">
              <div className="daily-label">🎯 Today's Challenge</div>
              <div className="daily-topic">"{dailyTopic}"</div>
              <div className="daily-countdown" style={{marginTop:8}}>
                Resets in: {24-new Date().getHours()}h {60-new Date().getMinutes()}m
              </div>
              {dailyDone
                ?<div style={{marginTop:16,color:"var(--green)",fontFamily:"var(--font-h)",fontSize:20,letterSpacing:2}}>✅ COMPLETED — Score: {dailyScore}</div>
                :<button className="start-btn" style={{marginTop:16}}
                  onClick={()=>{setTopic(dailyTopic);setStance("");setTab("debate");setPhase("setup");showToast("Daily topic loaded! Choose your stance.");}}>
                  START DAILY CHALLENGE →
                </button>}
            </div>

            {dailyLb.length>0&&(
              <>
                <div className="slbl" style={{marginBottom:12}}>Today's Leaderboard</div>
                <div className="daily-lb">
                  {dailyLb.map((p,i)=>(
                    <div key={p.name} className={`daily-lb-row${p.isYou?" you-row":""}`}>
                      <div className="dlr-rank">{i+1}</div>
                      <div className="dlr-name" style={{color:p.isYou?"var(--gold)":undefined}}>{p.isYou?"👤 YOU":p.name}</div>
                      <div className="dlr-score">{p.score}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{marginTop:20}}>
              <div className="slbl">Daily Streak</div>
              <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"16px 18px",display:"flex",gap:20}}>
                <div><div style={{fontFamily:"var(--font-h)",fontSize:32,color:"var(--gold)"}}>{dailyDone?1:0}</div><div style={{fontSize:9,color:"var(--muted3)",letterSpacing:2,fontFamily:"var(--font-b)"}}>TODAY</div></div>
                <div><div style={{fontFamily:"var(--font-h)",fontSize:32,color:"var(--orange)"}}>{curStreak}</div><div style={{fontSize:9,color:"var(--muted3)",letterSpacing:2,fontFamily:"var(--font-b)"}}>STREAK</div></div>
                <div><div style={{fontFamily:"var(--font-h)",fontSize:32,color:"var(--green)"}}>{state.wins}</div><div style={{fontSize:9,color:"var(--muted3)",letterSpacing:2,fontFamily:"var(--font-b)"}}>ALL WINS</div></div>
              </div>
            </div>
          </div>
        )}

        {/* ════════ TOURNAMENT TAB ════════ */}
        {tab==="tournament"&&(
          <div className="tourn-wrap">
            {!tournament.active?(
              <>
                <div className="slbl" style={{marginBottom:16}}>Tournament Mode</div>
                <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:24,marginBottom:20}}>
                  <div style={{fontFamily:"var(--font-h)",fontSize:24,color:"var(--gold)",marginBottom:8}}>🏆 CHAMPIONSHIP BRACKET</div>
                  <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.8,fontFamily:"var(--font-b)"}}>
                    Win 3 debates against progressively harder AI opponents to become the Debate Champion.
                    Each victory unlocks the next round.<br/><br/>
                    <span style={{color:"var(--gold)"}}>Round 1:</span> Easy AI<br/>
                    <span style={{color:"var(--orange)"}}>Round 2:</span> Medium AI<br/>
                    <span style={{color:"var(--red)"}}>Final:</span> Brutal AI
                  </div>
                  <div style={{marginTop:16,display:"flex",gap:10,flexWrap:"wrap"}}>
                    <div className="pill pill-gold">+{XP_VALS.win*3} XP on win</div>
                    <div className="pill pill-green">Special Achievement</div>
                  </div>
                </div>
                <button className="start-btn" onClick={startTournament}>⚔ START TOURNAMENT →</button>
              </>
            ):(
              <>
                <div className="slbl" style={{marginBottom:16}}>Your Tournament Bracket</div>
                <div className="bracket">
                  {tournament.bracket.map((round,ri)=>(
                    <div key={ri} className="bracket-round">
                      <div className="bracket-lbl">{ri===0?"Quarter":ri===1?"Semi":"FINAL"}</div>
                      {round.map((match,mi)=>(
                        <div key={mi} className="bracket-match">
                          <div className={`bm-player${match.winner===match.p1?" winner":match.winner&&match.winner!==match.p1?" loser":""}`}>
                            <span>{match.p1}</span>
                            <span className="bm-score">{match.winner===match.p1?"W":match.winner?"L":"?"}</span>
                          </div>
                          <div className={`bm-player${match.winner===match.p2?" winner":match.winner&&match.winner!==match.p2?" loser":""}`}>
                            <span>{match.p2}</span>
                            <span className="bm-score">{match.winner===match.p2?"W":match.winner?"L":"?"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="tourn-status">
                  {tournament.winner
                    ?`🏆 Champion: ${tournament.winner}`
                    :`Currently in Round ${tournament.currentMatch+1} of 3`}
                </div>
                <button className="start-btn" style={{marginTop:16}} onClick={()=>{
                  const d=["easy","medium","hard"][tournament.currentMatch]||"hard";
                  setDiff(d);
                  setTopic(topic||TOPIC_CATS["🤖 Tech"][0]);
                  setStance("");
                  setGameMode("ai");
                  setTab("debate");
                  setPhase("setup");
                  showToast(`Round ${tournament.currentMatch+1} — ${d.toUpperCase()} difficulty!`);
                }}>
                  FIGHT ROUND {tournament.currentMatch+1} →
                </button>
                <button className="new-btn" onClick={()=>setTournament({active:false,bracket:[],currentMatch:0,winner:null})}>Reset Tournament</button>
              </>
            )}
          </div>
        )}

      </div>
    </>
  );
}
