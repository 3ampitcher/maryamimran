/* ============================================================
   FOUNDER STYLE FINDER
   ------------------------------------------------------------
   A short, free, indicative instrument. It places a person on
   three preference axes and names the resulting style.

   It is deliberately NOT the Founder Quotient. FQ requires
   evidence, an interview, and an expert assessor; nothing here
   produces a score, and the copy says so at every step.

   Each axis carries eight items, four loading on each pole, so a person
   who agrees with everything lands in the middle rather than at a pole.
   Twenty-four items in total.
   ============================================================ */

(function () {
  'use strict';

  var root = document.querySelector('[data-finder]');
  if (!root) return;

  /* --- Items -------------------------------------------------------
     axis: which axis the item loads onto
     pole: the pole that AGREEMENT moves the person toward        */
  var ITEMS = [
    { axis: 'horizon', pole: 'V', text: 'I am drawn to problems that do not have a market yet.' },
    { axis: 'arena',   pole: 'O', text: 'I make my fastest progress in conversation with other people.' },
    { axis: 'mode',    pole: 'M', text: 'I would rather ship something imperfect this week than something right next month.' },
    { axis: 'horizon', pole: 'G', text: 'I would rather fix something that is already breaking than design something that does not exist.' },
    { axis: 'arena',   pole: 'I', text: 'Given a hard problem, my first instinct is to go away and build or model it myself.' },
    { axis: 'mode',    pole: 'R', text: 'I want the evidence in front of me before I commit other people to a direction.' },
    { axis: 'horizon', pole: 'V', text: 'I describe what a business could become long before I can prove any of it.' },
    { axis: 'arena',   pole: 'O', text: 'I would rather spend a week with customers than a week with the product.' },
    { axis: 'mode',    pole: 'M', text: 'I make decisions quickly and correct them afterwards.' },
    { axis: 'horizon', pole: 'G', text: 'I trust this quarter’s numbers more than a three-year picture.' },
    { axis: 'arena',   pole: 'I', text: 'I get more satisfaction from a system that works than from a deal that closes.' },
    { axis: 'mode',    pole: 'R', text: 'I am uncomfortable acting on a number I have not checked myself.' },
    { axis: 'horizon', pole: 'V', text: 'I lose interest in something once it works and only needs running.' },
    { axis: 'arena',   pole: 'O', text: 'I am usually the person who opens the door to a new partner or client.' },
    { axis: 'mode',    pole: 'M', text: 'Hitting the date matters more to me than covering everything.' },
    { axis: 'horizon', pole: 'G', text: 'The most useful question in any meeting is “what is actually true today?”' },
    { axis: 'arena',   pole: 'I', text: 'I need long uninterrupted stretches of time to do my best work.' },
    { axis: 'mode',    pole: 'R', text: 'I would rather be slow and reversible than fast and wrong.' },
    { axis: 'horizon', pole: 'V', text: 'I find it easy to hold a clear picture of an end state that does not exist yet.' },
    { axis: 'arena',   pole: 'O', text: 'I read a room quickly and adjust to it.' },
    { axis: 'mode',    pole: 'M', text: 'When a plan stalls, my instinct is to do something rather than to study it.' },
    { axis: 'horizon', pole: 'G', text: 'I would rather improve next month’s numbers than redesign the business.' },
    { axis: 'arena',   pole: 'I', text: 'I would rather be judged on what I have built than on who I know.' },
    { axis: 'mode',    pole: 'R', text: 'I would rather delay a launch than ship something I cannot stand behind.' }
  ];

  var SCALE = [
    { value: -3, side: 'disagree', weight: 3, label: 'Strongly disagree' },
    { value: -2, side: 'disagree', weight: 2, label: 'Disagree' },
    { value: -1, side: 'disagree', weight: 1, label: 'Slightly disagree' },
    { value: 0,  side: 'neutral',  weight: 0, label: 'Neutral' },
    { value: 1,  side: 'agree',    weight: 1, label: 'Slightly agree' },
    { value: 2,  side: 'agree',    weight: 2, label: 'Agree' },
    { value: 3,  side: 'agree',    weight: 3, label: 'Strongly agree' }
  ];

  var AXIS_META = {
    horizon: { name: 'Horizon', a: 'V', b: 'G', aName: 'Vision', bName: 'Ground' },
    arena:   { name: 'Arena',   a: 'O', b: 'I', aName: 'Outward', bName: 'Inward' },
    mode:    { name: 'Mode',    a: 'M', b: 'R', aName: 'Momentum', bName: 'Rigour' }
  };

  var STORE_KEY = 'fc.style-finder.v1';

  /* Two seams for the single-file build (see build-single.mjs), which puts
     all eight pages in one document and routes on the hash. On the real
     site both are absent and these are no-ops. */
  var HASH_PREFIX = window.FC_HASH_PREFIX || '';
  function pageHref(page, frag) {
    return window.FC_LINK ? window.FC_LINK(page, frag) : page + '.html#' + frag;
  }

  var views = {
    intro:  root.querySelector('[data-view="intro"]'),
    quiz:   root.querySelector('[data-view="quiz"]'),
    result: root.querySelector('[data-view="result"]')
  };

  var els = {
    question:  root.querySelector('[data-q-text]'),
    index:     root.querySelector('[data-q-index]'),
    scale:     root.querySelector('[data-scale]'),
    progress:  root.querySelector('[data-progress]'),
    progressN: root.querySelector('[data-progress-n]'),
    back:      root.querySelector('[data-back]'),
    live:      root.querySelector('[data-live]')
  };

  var answers = new Array(ITEMS.length).fill(null);
  var current = 0;
  var shown = null;   // the style code currently rendered in the result view

  /* --- Persistence is a convenience, never a requirement ------------ */
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ answers: answers, current: current }));
    } catch (e) { /* private mode, blocked storage — carry on */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !Array.isArray(data.answers) || data.answers.length !== ITEMS.length) return null;
      return data;
    } catch (e) { return null; }
  }
  function clear() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
  }

  /* Keep the active view under the masthead rather than wherever the
     previous, taller view happened to leave the scroll position. */
  function scrollToFinder() {
    var top = root.getBoundingClientRect().top + window.pageYOffset - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
  }

  function show(name) {
    Object.keys(views).forEach(function (key) {
      if (views[key]) views[key].hidden = key !== name;
    });
  }

  /* --- Scoring ------------------------------------------------------ */
  function score() {
    var totals = { horizon: 0, arena: 0, mode: 0 };
    var maxima = { horizon: 0, arena: 0, mode: 0 };

    ITEMS.forEach(function (item, i) {
      var meta = AXIS_META[item.axis];
      var response = answers[i] || 0;
      // Agreement moves toward item.pole; flip the sign when the item's
      // pole is the axis's second pole, so the total always reads
      // "toward pole A".
      totals[item.axis] += item.pole === meta.a ? response : -response;
      maxima[item.axis] += 3;
    });

    var out = { code: '', axes: {} };
    ['horizon', 'arena', 'mode'].forEach(function (axis) {
      var meta = AXIS_META[axis];
      var pct = Math.round(((totals[axis] + maxima[axis]) / (maxima[axis] * 2)) * 100);
      pct = Math.min(100, Math.max(0, pct));
      var towardA = pct >= 50;
      var lean = Math.abs(pct - 50) * 2; // 0 = perfectly balanced, 100 = one pole
      out.axes[axis] = {
        pct: pct,                                   // percentage toward pole A
        shown: towardA ? pct : 100 - pct,           // percentage toward the chosen pole
        pole: towardA ? meta.a : meta.b,
        poleName: towardA ? meta.aName : meta.bName,
        otherName: towardA ? meta.bName : meta.aName,
        lean: lean,
        clarity: lean >= 34 ? 'Clear' : lean >= 14 ? 'Leaning' : 'Balanced'
      };
      out.code += out.axes[axis].pole;
    });
    return out;
  }

  /* The nearest alternative style: flip whichever axis is least settled. */
  function secondary(result) {
    var order = ['horizon', 'arena', 'mode'].sort(function (a, b) {
      return result.axes[a].lean - result.axes[b].lean;
    });
    var soft = order[0];
    var meta = AXIS_META[soft];
    var flipped = result.axes[soft].pole === meta.a ? meta.b : meta.a;
    var code = ['horizon', 'arena', 'mode']
      .map(function (axis) { return axis === soft ? flipped : result.axes[axis].pole; })
      .join('');
    return { code: code, axis: meta.name, lean: result.axes[soft].lean };
  }

  /* --- Question rendering ------------------------------------------- */
  function renderScale() {
    els.scale.innerHTML = '';
    var row = document.createElement('div');
    row.className = 'scale__row';
    row.setAttribute('role', 'radiogroup');
    row.setAttribute('aria-labelledby', 'q-text');

    SCALE.forEach(function (point) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dot';
      btn.dataset.side = point.side;
      btn.dataset.weight = String(point.weight);
      btn.dataset.value = String(point.value);
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('aria-label', point.label);
      btn.title = point.label;
      btn.addEventListener('click', function () { answer(point.value); });
      row.appendChild(btn);
    });

    els.scale.appendChild(row);

    // Arrow keys walk the scale; Enter or Space picks the focused point.
    row.addEventListener('keydown', function (e) {
      var dots = Array.prototype.slice.call(row.querySelectorAll('.dot'));
      var i = dots.indexOf(document.activeElement);
      if (i < 0) return;
      var step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
               : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      dots[(i + step + dots.length) % dots.length].focus();
    });
  }

  function renderQuestion() {
    var item = ITEMS[current];
    els.question.textContent = item.text;
    els.index.textContent = 'Statement ' + (current + 1) + ' of ' + ITEMS.length;

    var pct = Math.round((current / ITEMS.length) * 100);
    els.progress.style.setProperty('--p', pct + '%');
    els.progress.parentElement.setAttribute('aria-valuenow', String(current));
    els.progressN.textContent = current + ' answered';

    root.querySelectorAll('.dot').forEach(function (dot) {
      var on = answers[current] !== null && Number(dot.dataset.value) === answers[current];
      dot.setAttribute('aria-checked', String(on));
      dot.tabIndex = on || (answers[current] === null && dot.dataset.value === '0') ? 0 : -1;
    });

    els.back.disabled = current === 0;
  }

  function answer(value) {
    answers[current] = value;
    save();
    if (current < ITEMS.length - 1) {
      current += 1;
      renderQuestion();
      focusScale();
    } else {
      finish();
    }
  }

  function focusScale() {
    var target = root.querySelector('.dot[aria-checked="true"]') || root.querySelector('.dot[data-value="0"]');
    if (target) target.focus();
  }

  function finish() {
    var result = score();
    clear();
    writeHash(result);
    renderResult(result);
  }

  /* --- Results ------------------------------------------------------ */
  function writeHash(result) {
    var parts = ['style=' + result.code];
    ['horizon', 'arena', 'mode'].forEach(function (axis) {
      parts.push(axis[0] + '=' + result.axes[axis].pct);
    });
    history.replaceState(null, '', '#' + HASH_PREFIX + parts.join('&'));
  }

  function readHash() {
    var hash = window.location.hash.replace(/^#/, '');
    if (HASH_PREFIX && hash.indexOf(HASH_PREFIX) === 0) hash = hash.slice(HASH_PREFIX.length);
    if (!hash) return null;
    var params = {};
    hash.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      params[kv[0]] = kv[1];
    });
    var code = (params.style || '').toUpperCase();
    if (!window.FC_STYLES[code]) return null;

    var result = { code: code, axes: {} };
    ['horizon', 'arena', 'mode'].forEach(function (axis) {
      var meta = AXIS_META[axis];
      var pct = parseInt(params[axis[0]], 10);
      if (isNaN(pct)) pct = code[['horizon', 'arena', 'mode'].indexOf(axis)] === meta.a ? 65 : 35;
      pct = Math.min(100, Math.max(0, pct));
      var towardA = pct >= 50;
      var lean = Math.abs(pct - 50) * 2;
      result.axes[axis] = {
        pct: pct,
        shown: towardA ? pct : 100 - pct,
        pole: towardA ? meta.a : meta.b,
        poleName: towardA ? meta.aName : meta.bName,
        otherName: towardA ? meta.bName : meta.aName,
        lean: lean,
        clarity: lean >= 34 ? 'Clear' : lean >= 14 ? 'Leaning' : 'Balanced'
      };
    });
    return result;
  }

  function list(items) {
    return items.map(function (t) { return '<li>' + t + '</li>'; }).join('');
  }

  function pills(items, kind) {
    return items.map(function (t) {
      return '<li><span class="pill' + (kind ? ' pill--' + kind : '') + '">' + t + '</span></li>';
    }).join('');
  }

  function renderResult(result) {
    var style = window.FC_STYLES[result.code];
    if (!style) return;

    var second = secondary(result);
    var secondStyle = window.FC_STYLES[second.code];
    var target = root.querySelector('[data-result]');

    var axisRows = ['horizon', 'arena', 'mode'].map(function (axis) {
      var a = result.axes[axis];
      var meta = AXIS_META[axis];
      return '' +
        '<div class="axis">' +
          '<div class="axis__labels">' +
            '<span' + (a.pole === meta.a ? '><b>' : '>') + meta.aName + (a.pole === meta.a ? '</b>' : '') + '</span>' +
            '<span class="mono">' + meta.name + '</span>' +
            '<span' + (a.pole === meta.b ? '><b>' : '>') + meta.bName + (a.pole === meta.b ? '</b>' : '') + '</span>' +
          '</div>' +
          '<div class="axis__track" role="img" aria-label="' + meta.name + ': ' + a.shown + ' per cent toward ' + a.poleName + '">' +
            '<span class="axis__marker" style="--at:' + (100 - a.pct) + '%"></span>' +
          '</div>' +
          '<p class="axis__caption">' + a.clarity + ' — ' + a.shown + '% toward ' + a.poleName + '</p>' +
        '</div>';
    }).join('');

    target.innerHTML = '' +
      '<div class="stack stack--lg">' +
        '<div>' +
          '<p class="label label--bare label--accent">Your indicative founder style</p>' +
          '<p class="result__code">' + result.code + '</p>' +
          '<h2 class="result__name">The ' + style.name + '</h2>' +
          '<p class="lead" style="margin-top:1rem;max-width:56ch">' + style.line + '</p>' +
        '</div>' +

        '<div class="grid grid--2">' +
          '<div class="stack">' + axisRows + '</div>' +
          '<div class="card">' +
            '<p class="card__index">How to read this</p>' +
            '<p class="card__body">' + style.reading + '</p>' +
            '<p class="card__body"><strong>Closest alternative:</strong> your ' + second.axis +
              ' axis is the least settled of the three, so The ' + secondStyle.name +
              ' (' + second.code + ') is the style you are most likely to blend with. ' +
              'Founder style is usually a blend.</p>' +
          '</div>' +
        '</div>' +

        '<div class="grid grid--2">' +
          '<div class="card"><p class="card__index">Where this tends to create value</p><ul class="points">' + list(style.strengths) + '</ul></div>' +
          '<div class="card"><p class="card__index">What to watch</p><ul class="points">' + list(style.watch) + '</ul></div>' +
        '</div>' +

        '<div class="grid grid--3">' +
          '<div class="card card--flush"><p class="card__index">Likely founder edges</p><ul class="cluster" style="margin-top:.6rem">' + pills(style.edges) + '</ul></div>' +
          '<div class="card card--flush"><p class="card__index">Stages this style suits</p><ul class="cluster" style="margin-top:.6rem">' + pills(style.stages, 'accent') + '</ul></div>' +
          '<div class="card card--flush"><p class="card__index">Role hypotheses to test</p><ul class="cluster" style="margin-top:.6rem">' + pills(style.roles) + '</ul></div>' +
        '</div>' +

        '<div class="card">' +
          '<p class="card__index">Who complements you</p>' +
          '<p class="card__body">' + style.complementNote + '</p>' +
          '<ul class="cluster" style="margin-top:.4rem">' +
            style.complements.map(function (code) {
              var s = window.FC_STYLES[code];
              return '<li><a class="pill pill--accent" href="' + pageHref('founder-styles', 'style-' + s.name.toLowerCase()) + '">' + code + ' · The ' + s.name + '</a></li>';
            }).join('') +
          '</ul>' +
        '</div>' +
      '</div>';

    shown = result.code;
    show('result');
    scrollToFinder();
    if (els.live) els.live.textContent = 'Result ready: the ' + style.name + ', ' + result.code + '.';
    var heading = target.querySelector('.result__name');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  /* --- Wiring -------------------------------------------------------- */
  renderScale();

  root.querySelectorAll('[data-start]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.dataset.start === 'resume') {
        var saved = load();
        if (saved) { answers = saved.answers; current = saved.current; }
      } else {
        answers = new Array(ITEMS.length).fill(null);
        current = 0;
        clear();
      }
      show('quiz');
      renderQuestion();
      scrollToFinder();
      focusScale();
    });
  });

  root.querySelectorAll('[data-restart]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      answers = new Array(ITEMS.length).fill(null);
      current = 0;
      clear();
      history.replaceState(null, '', window.location.pathname);
      show('intro');
      root.querySelector('[data-start="new"]').focus();
    });
  });

  els.back.addEventListener('click', function () {
    if (current === 0) return;
    current -= 1;
    renderQuestion();
    focusScale();
  });

  // Offer to resume only when there is something to resume.
  var saved = load();
  var resume = root.querySelector('[data-start="resume"]');
  if (resume) {
    var answered = saved ? saved.answers.filter(function (a) { return a !== null; }).length : 0;
    if (answered > 0 && answered < ITEMS.length) {
      resume.hidden = false;
      resume.querySelector('[data-resume-n]').textContent = String(answered);
    }
  }

  // A shared result link renders straight into the result view.
  var fromHash = readHash();
  if (fromHash) renderResult(fromHash);

  // Back, forward, or a result link pasted into an already-open page.
  window.addEventListener('hashchange', function () {
    var next = readHash();
    if (next && next.code !== shown) renderResult(next);
  });
})();
