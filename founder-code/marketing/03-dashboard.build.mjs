/* ============================================================
   BUILDS marketing/03-dashboard.html
   ------------------------------------------------------------
     node marketing/03-dashboard.build.mjs marketing/03-dashboard.html

   Layout and content are fixed by the supplied design; only the
   palette and typefaces are Founder Code's. This script exists
   because the rings, the 270-degree gauges and the eight-axis
   radar are geometry — dash arrays and polygon coordinates that
   would be unmaintainable magic numbers if typed into the HTML.
   Edit copy here, then re-run and re-render.
   ============================================================ */

import { writeFileSync } from 'node:fs';

/* --- helpers --------------------------------------------------------- */
const C = (r) => 2 * Math.PI * r;

function ring({ v, max = 100, size, sw, color = 'var(--brand)', num, den = '/100' }) {
  const r = size / 2 - sw / 2 - 1;
  const c = C(r);
  const off = c * (1 - v / max);
  return `<span class="ring" style="width:${size}px;height:${size}px">` +
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${r.toFixed(1)}" fill="none" stroke="var(--rule)" stroke-width="${sw}"/>` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${r.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>` +
    `</svg>` +
    `<span class="ring__c"><span class="ring__n" style="font-size:${num}px;color:${color}">${v}</span>` +
    (den ? `<span class="ring__d">${den}</span>` : '') + `</span></span>`;
}

/* Five dots: whole points filled, the remainder shown as one part-opacity
   dot, so 3.8 reads nearly full and 4.3 reads barely over four. */
function dots(v, cls = '') {
  const full = Math.floor(v);
  const frac = +(v - full).toFixed(2);
  let out = `<span class="dots ${cls}">`;
  for (let i = 0; i < 5; i++) {
    if (i < full) out += `<i></i>`;
    else if (i === full && frac > 0.02) out += `<i style="opacity:${frac}"></i>`;
    else out += `<i class="is-off"></i>`;
  }
  return out + `</span>`;
}

function drow(name, v, amber = false) {
  return `<div class="drow${amber ? ' drow--amber' : ''}"><span class="drow__n">${name}</span>` +
    dots(v, amber ? 'dots--amber' : '') +
    `<span class="drow__v">${v}/5</span></div>`;
}

function badge(abbr, name, v, tone = '') {
  return `<div class="badge${tone ? ' badge--' + tone : ''}"><span class="badge__b">${abbr}</span>` +
    `<span><span class="badge__n">${name}</span><br><span class="badge__v">${v}/5</span></span></div>`;
}

/* 270-degree gauge: the track shows three quarters of the circle and the
   whole svg is rotated so the gap sits at the bottom. */
function gauge3(pct, label, key) {
  const size = 54, sw = 5, r = size / 2 - sw / 2 - 1, c = C(r), span = c * 0.75;
  return `<div class="gauge3"><p class="gauge3__k">${key}</p><div class="gauge3__w">` +
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(135deg)">` +
      `<circle class="gauge3__t" cx="${size / 2}" cy="${size / 2}" r="${r.toFixed(1)}" stroke-width="${sw}" stroke-dasharray="${span.toFixed(1)} ${c.toFixed(1)}"/>` +
      `<circle class="gauge3__a" cx="${size / 2}" cy="${size / 2}" r="${r.toFixed(1)}" stroke-width="${sw}" stroke-dasharray="${(span * pct / 100).toFixed(1)} ${c.toFixed(1)}"/>` +
    `</svg><span class="gauge3__p">${pct}%</span></div><p class="gauge3__l">${label}</p></div>`;
}

function bip(key, left, right, pct) {
  return `<div class="bip"><p class="bip__t">${key}</p><div class="bip__r">` +
    `<span class="bip__a">${left}</span>` +
    `<span class="bip__track"><i class="bip__m" style="--at:${pct}%"></i><b class="bip__p" style="--at:${pct}%">${pct}%</b></span>` +
    `<span class="bip__a bip__a--r">${right}</span></div></div>`;
}

/* --- radar ------------------------------------------------------------ */
const MECH = [
  ['Calibrated Agency', 4.3],
  ['Opportunity Insight', 3.8],
  ['Venture Learning|Velocity', 4.1],
  ['Decision Quality', 4.0],
  ['Disciplined Execution', 4.2],
  ['Resource|Orchestration', 3.7],
  ['Adaptive|Resilience', 3.8],
  ['Reality Contact', 3.2]
];

function radar() {
  /* Sized to the widest column. LR is capped at 140: beyond it the
     right-hand label runs past W. */
  const W = 440, H = 386, cx = 220, cy = 196, R = 132, LR = 140;
  const n = MECH.length;
  const pt = (i, rad) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  };

  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  // grid rings at 1/5 .. 5/5
  for (let g = 1; g <= 5; g++) {
    const pts = [...Array(n)].map((_, i) => pt(i, (R * g) / 5).map((v) => v.toFixed(1)).join(',')).join(' ');
    s += `<polygon class="radar__grid" points="${pts}"/>`;
  }
  for (let i = 0; i < n; i++) {
    const [x, y] = pt(i, R);
    s += `<line class="radar__axis" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
  }
  const area = MECH.map(([, v], i) => pt(i, (R * v) / 5).map((n2) => n2.toFixed(1)).join(',')).join(' ');
  s += `<polygon class="radar__area" points="${area}"/>`;

  MECH.forEach(([name, v], i) => {
    const watch = name === 'Reality Contact';
    const [px, py] = pt(i, (R * v) / 5);
    s += `<circle class="radar__pt${watch ? ' radar__pt--watch' : ''}" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2.6"/>`;

    const [lx, ly] = pt(i, LR);
    const a = (360 * i) / n;
    const anchor = a === 0 || a === 180 ? 'middle' : a < 180 ? 'start' : 'end';
    const lines = name.split('|');
    // Push the top label up and the bottom label down so neither sits on the ring.
    const dy = a === 0 ? -6 : a === 180 ? 10 : 0;
    let ty = ly + dy;
    let text = `<text class="radar__lbl" x="${lx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}">`;
    lines.forEach((ln, k) => {
      text += `<tspan x="${lx.toFixed(1)}" dy="${k === 0 ? 0 : 10}">${ln}</tspan>`;
    });
    text += `</text>`;
    const vy = ty + (lines.length - 1) * 10 + 11;
    text += `<text class="radar__val${watch ? ' radar__val--watch' : ''}" x="${lx.toFixed(1)}" y="${vy.toFixed(1)}" text-anchor="${anchor}">${v.toFixed(1)}</text>`;
    s += text;
  });

  return s + `</svg>`;
}

/* --- page -------------------------------------------------------------- */
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Founder Code — Executive Intelligence Dashboard</title>
<link rel="stylesheet" href="../assets/css/founder-code.css">
<link rel="stylesheet" href="dashboard.css">
</head>
<body>

<!-- Layout and content are fixed by the supplied design; this file only
     carries the Founder Code palette and typefaces. Ring, gauge and radar
     geometry is generated (see marketing/README.md) — the dash arrays and
     radar coordinates are computed, not hand-tuned. -->

<div class="dash-poster" id="poster">

  <header class="dhead">
    <div class="dhead__id">
      <span class="fqmark">FQ</span>
      <span class="dhead__bar"></span>
      <span>
        <p class="k">Founder Quotient</p>
        <h1 class="dhead__title">Executive Intelligence Dashboard</h1>
      </span>
    </div>
    <div class="dhead__meta">
      <p class="k k--amber">Illustrative sample</p>
      <p class="dhead__scope">Potential &middot; evidence &middot; personality &middot; leadership &middot; team design</p>
    </div>
  </header>
  <div class="accentrule"></div>

  <section class="idband">
    <div>
      <h2 class="idband__name">Maryam Imran</h2>
      <p class="k k--muted idband__ctx">Pre-venture &nbsp;·&nbsp; Fintech &nbsp;·&nbsp; Pre-idea / exploring</p>
    </div>
    <div class="scoredot"><b>81</b><span>/100</span></div>
    <div class="rec">
      <p class="k">Advance with targeted diligence</p>
      <p>Strong founder signal. Verify commercial evidence, customer access and response to challenge.</p>
    </div>
    <div class="chips">
      <div class="chip"><p class="chip__k">Evidence</p><p class="chip__v chip__v--amber">Moderate</p></div>
      <div class="chip"><p class="chip__k">Character</p><p class="chip__v chip__v--brand">Clear</p></div>
      <div class="chip"><p class="chip__k">Capacity</p><p class="chip__v chip__v--coral">Constrained</p></div>
      <div class="chip"><p class="chip__k">Track</p><p class="chip__v chip__v--ink">First-time</p></div>
      <div class="chip"><p class="chip__k">Ego / power</p><p class="chip__v chip__v--amber">Moderate</p></div>
    </div>
  </section>

  <div class="dcols">

    <!-- 1 -->
    <div class="dcol">
      <div class="colhead"><span class="colhead__n">1</span><span class="colhead__t">What creates FQ</span></div>
      <p class="colsub">Only three components create the score.</p>

      <div class="ringrow">
        <div class="ringcell">${ring({ v: 82, size: 70, sw: 4.5, color: 'var(--brand)', num: 22 })}
          <span class="ringcell__l">Founder Potential</span><span class="ringcell__w">60% weight</span></div>
        <div class="ringcell">${ring({ v: 72, size: 70, sw: 4.5, color: 'var(--amber)', num: 22 })}
          <span class="ringcell__l">Founder Experience</span><span class="ringcell__w">20% weight</span></div>
        <div class="ringcell">${ring({ v: 85, size: 70, sw: 4.5, color: 'var(--ink)', num: 22 })}
          <span class="ringcell__l">Founder&ndash;Venture Fit</span><span class="ringcell__w">20% weight</span></div>
      </div>

      <p class="formula">60% &times; 82 &nbsp;+&nbsp; 20% &times; 72 &nbsp;+&nbsp; 20% &times; 85 &nbsp;=&nbsp; <b>81</b></p>

      <div class="sec sec--grow">
        <p class="k">Founder Potential &nbsp;·&nbsp; 8 mechanisms</p>
        <div class="radar">${radar()}</div>
      </div>

      <div class="callout">
        <p class="k">Strongest signal</p>
        <p class="strong">Agency &middot; learning velocity &middot; disciplined execution</p>
        <div class="callout__split">
          <p class="k k--coral">Primary watch</p>
          <p>Reality Contact requires external verification.</p>
        </div>
      </div>
    </div>

    <!-- 2 -->
    <div class="dcol">
      <div class="colhead"><span class="colhead__n">2</span><span class="colhead__t">What the evidence proves</span></div>
      <p class="colsub">Building history and venture-specific advantage.</p>

      <div class="ringside ringside--grow">
        <div class="ringside__l">${ring({ v: 72, size: 70, sw: 4.5, color: 'var(--amber)', num: 22 })}
          <span class="ringcell__l">Founder Experience</span></div>
        <div class="ringside__b spread">
          ${drow('Creation &amp; ownership', 4.3, true)}
          ${drow('External value &amp; outcomes', 3.0, true)}
          ${drow('Stage &amp; complexity', 3.3, true)}
          ${drow('Resources &amp; organisation', 3.8, true)}
          ${drow('Personal attribution', 3.8, true)}
          ${drow('Durability &amp; repetition', 3.1, true)}
        </div>
      </div>
      <p class="note-i">Meaningful zero-to-one exposure; commercial proof remains early.</p>

      <div class="rule" style="margin:14px 0"></div>

      <div class="ringside ringside--grow">
        <div class="ringside__l">${ring({ v: 85, size: 70, sw: 4.5, color: 'var(--brand)', num: 22 })}
          <span class="ringcell__l">Founder&ndash;Venture Fit</span></div>
        <div class="ringside__b spread">
          ${drow('Problem &amp; customer proximity', 4.5)}
          ${drow('Relevant knowledge', 4.2)}
          ${drow('Distinctive insight', 4.1)}
          ${drow('Access advantage', 3.8)}
          ${drow('Capability relevance', 4.5)}
        </div>
      </div>

      <div class="callout">
        <p class="k">Unfair advantage</p>
        <p class="strong">Strong problem proximity and product relevance.</p>
        <div class="callout__split">
          <p class="k k--coral">Proof needed</p>
          <p>Verify customer access, revenue claims and transferability.</p>
        </div>
      </div>
    </div>

    <!-- 3 -->
    <div class="dcol">
      <div class="colhead"><span class="colhead__n">3</span><span class="colhead__t">Who this founder is</span></div>
      <p class="colsub">Personality explains behaviour; it does not add FQ points.</p>

      <p class="k">Personality signature</p>
      <p style="font-size:15px;font-weight:500;letter-spacing:-0.02em;margin:6px 0 0">Exploratory &middot; independent &middot; emotionally steady</p>

      <div class="bips">
        ${bip('Openness', 'Conventional', 'Exploratory', 78)}
        ${bip('Conscientiousness', 'Flexible', 'Structured', 68)}
        ${bip('Extraversion', 'Reserved', 'Assertive', 54)}
        ${bip('Agreeableness', 'Challenging', 'Accommodating', 42)}
        ${bip('Emotional stability', 'Stress-sensitive', 'Steady', 74)}
      </div>

      <div class="rule" style="margin:16px 0 13px"></div>

      <p class="k">Founder style &amp; archetype</p>
      <div class="arch">
        <span class="arch__n">The Inventor</span>
        <span><span class="tag tag--brand">VIM</span> <span class="tag tag--ink">Independent</span></span>
      </div>
      <div class="gauges">
        ${gauge3(63, 'Vision', 'Horizon')}
        ${gauge3(54, 'Inward', 'Arena')}
        ${gauge3(63, 'Momentum', 'Mode')}
      </div>

      <div class="rule" style="margin:14px 0 12px"></div>

      <div class="sechead">
        <p class="k">Team conduct</p>
        <span class="num" style="font-size:15px;font-weight:500;color:var(--amber)">75/100</span>
      </div>
      <div class="badges">
        ${badge('REL', 'Reliability', 4.3, 'amber')}
        ${badge('CAN', 'Candour', 4.0, 'amber')}
        ${badge('C&amp;R', 'Conflict &amp; repair', 3.4, 'amber')}
        ${badge('OWN', 'Shared ownership', 4.1, 'amber')}
        ${badge('D&amp;T', 'Delegation &amp; trust', 3.5, 'amber')}
        ${badge('RTC', 'Response to challenge', 3.2, 'coral')}
      </div>
    </div>

    <!-- 4 -->
    <div class="dcol">
      <div class="colhead"><span class="colhead__n">4</span><span class="colhead__t">How to deploy them</span></div>
      <p class="colsub">Readiness, role and complementary coverage.</p>

      <div class="ringside">
        <div class="ringside__l">${ring({ v: 79, size: 62, sw: 4.5, color: 'var(--brand)', num: 20 })}
          <span class="ringcell__l">Leadership readiness</span></div>
        <div class="ringside__b">
          <div class="badges">
            ${badge('DIR', 'Direction setting', 4.3)}
            ${badge('DEC', 'Decision ownership', 4.2)}
            ${badge('TAL', 'Talent judgment', 3.8)}
            ${badge('DEL', 'Delegation', 3.4)}
            ${badge('ACC', 'Accountability', 4.0)}
            ${badge('CON', 'Difficult conversations', 3.5)}
            ${badge('REG', 'Emotional regulation', 4.1)}
            ${badge('STK', 'Stakeholder leadership', 3.8)}
          </div>
        </div>
      </div>

      <div class="rule" style="margin:14px 0 12px"></div>

      <p class="k">Role hypotheses</p>
      <div class="ringrow" style="margin-top:9px">
        <div class="ringcell">${ring({ v: 86, size: 54, sw: 4, color: 'var(--brand)', num: 17, den: '' })}
          <span class="ringcell__l">CPO / Venture Builder</span></div>
        <div class="ringcell">${ring({ v: 82, size: 54, sw: 4, color: 'var(--brand)', num: 17, den: '' })}
          <span class="ringcell__l">CEO</span></div>
        <div class="ringcell">${ring({ v: 75, size: 54, sw: 4, color: 'var(--amber)', num: 17, den: '' })}
          <span class="ringcell__l">COO</span></div>
        <div class="ringcell">${ring({ v: 68, size: 54, sw: 4, color: 'var(--text-3)', num: 17, den: '' })}
          <span class="ringcell__l">CCO</span></div>
      </div>

      <div class="sechead" style="margin-top:13px">
        <p class="k k--muted">Founder edge</p>
        <span style="font-size:15px;font-weight:500;letter-spacing:-0.02em">Product + Strategic</span>
      </div>

      <div class="sec">
        <p class="k">Founder stage fit</p>
        <div class="stages" style="margin-top:8px">
          <div class="stage stage--med"><p class="stage__n">Discover</p><p class="stage__l">Medium</p></div>
          <div class="stage stage--high"><p class="stage__n">Validate</p><p class="stage__l">High</p></div>
          <div class="stage stage--med"><p class="stage__n">Build</p><p class="stage__l">Medium</p></div>
          <div class="stage stage--med"><p class="stage__n">Sell</p><p class="stage__l">Medium</p></div>
          <div class="stage stage--low"><p class="stage__n">Scale</p><p class="stage__l">Low</p></div>
          <div class="stage stage--low"><p class="stage__n">Steward</p><p class="stage__l">Low</p></div>
        </div>
        <p style="margin:8px 0 0;font-size:11.5px;color:var(--text-3)">Best fit: Validate &middot; strong through Build with operating support</p>
      </div>

      <div class="sec">
        <p class="k">Complementary team blueprint</p>
        <div class="bp" style="margin-top:6px">
          <div class="bp__r"><span class="bp__n">Commercial / GTM</span><span class="bp__v">Collaborator</span></div>
          <div class="bp__r"><span class="bp__n">Operating discipline</span><span class="bp__v">Strong</span></div>
          <div class="bp__r"><span class="bp__n">Reality Contact</span><span class="bp__v">High</span></div>
          <div class="bp__r"><span class="bp__n">Risk / regulatory</span><span class="bp__v">Specialist coverage</span></div>
        </div>
      </div>

      <div class="riskbar">
        <span class="k k--coral" style="flex:none">Team risk</span>
        <p>Speed may outrun challenge and evidence.</p>
      </div>
    </div>
  </div>

  <div class="decision">
    <p class="k k--paper">Decision</p>
    <p class="lead">Advance with targeted diligence</p>
    <p class="k k--paper">Verify</p>
    <p>Commercial claims &middot; customer evidence &middot; response to challenge</p>
    <p class="k k--paper">Team design</p>
    <p>Add GTM strength and independent reality testing</p>
  </div>

  <p class="signoff">Founder Quotient</p>
</div>

</body>
</html>
`;

writeFileSync(process.argv[2], html);
console.log('written', html.length, 'bytes');
