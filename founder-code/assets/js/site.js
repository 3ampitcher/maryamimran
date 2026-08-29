/* ============================================================
   FOUNDER CODE — shared behaviour
   ------------------------------------------------------------
   No framework, no bundler. Every block below is defensive: if
   the markup it looks for isn't on the page, it does nothing.
   Every interaction it enhances already works, or is already
   visible, without JavaScript.
   ============================================================ */

(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --- Current year in the footer ------------------------------------ */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* --- Mobile navigation --------------------------------------------- */
  (function nav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.getElementById('site-nav');
    if (!toggle || !panel) return;

    var desktop = window.matchMedia('(min-width: 62.0625rem)');

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    }

    function sync() {
      if (desktop.matches) {
        panel.hidden = false;
        toggle.setAttribute('aria-expanded', 'false');
      } else if (toggle.getAttribute('aria-expanded') !== 'true') {
        panel.hidden = true;
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    panel.addEventListener('click', function (e) {
      if (!desktop.matches && e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    desktop.addEventListener('change', sync);
    sync();
  })();

  /* --- Masthead hairline once the page has moved ---------------------- */
  (function scrolled() {
    var head = document.querySelector('.masthead');
    if (!head) return;
    var ticking = false;
    function update() {
      head.dataset.scrolled = String(window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  /* --- Scroll reveal --------------------------------------------------
     Elements start hidden only when we know we can un-hide them, so a
     failed observer can never leave content invisible.               */
  (function reveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion.matches || !('IntersectionObserver' in window)) return;

    // Hide first, observe second — never the other way round.
    document.documentElement.classList.add('reveal-ready');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  })();

  /* --- Meters, ladders and gauges fill when they come into view -------
     The markup carries the final value; this only defers the paint.  */
  (function charts() {
    var nodes = document.querySelectorAll('[data-fill]');
    if (!nodes.length) return;

    function paint(el) {
      var pct = parseFloat(el.dataset.fill);
      if (isNaN(pct)) return;
      if (el.classList.contains('meter__fill')) {
        el.style.setProperty('--fill', String(pct / 100));
      } else if (el.classList.contains('gauge__arc')) {
        var len = parseFloat(el.dataset.length || '0');
        el.style.strokeDashoffset = String(len * (1 - pct / 100));
      } else {
        el.style.setProperty('--w', pct + '%');
      }
    }

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      nodes.forEach(paint);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        paint(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    nodes.forEach(function (el) { io.observe(el); });
  })();

  /* --- Accordions ------------------------------------------------------ */
  (function disclosures() {
    document.querySelectorAll('[data-disclosure]').forEach(function (root) {
      var single = root.dataset.disclosure === 'single';
      var triggers = root.querySelectorAll('.disclosure__trigger');

      triggers.forEach(function (trigger) {
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));
        if (!panel) return;

        trigger.addEventListener('click', function () {
          var open = trigger.getAttribute('aria-expanded') === 'true';
          if (single && !open) {
            triggers.forEach(function (other) {
              if (other === trigger) return;
              var p = document.getElementById(other.getAttribute('aria-controls'));
              other.setAttribute('aria-expanded', 'false');
              if (p) p.hidden = true;
            });
          }
          trigger.setAttribute('aria-expanded', String(!open));
          panel.hidden = open;
        });
      });
    });
  })();

  /* --- Tabs (roving focus, arrow keys) --------------------------------- */
  (function tabs() {
    document.querySelectorAll('[role="tablist"]').forEach(function (list) {
      var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
      if (!tabs.length) return;

      function select(tab) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !on;
        });
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { select(tab); });
        tab.addEventListener('keydown', function (e) {
          var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (e.key === 'Home') { e.preventDefault(); tabs[0].focus(); select(tabs[0]); return; }
          if (e.key === 'End') { e.preventDefault(); tabs[tabs.length - 1].focus(); select(tabs[tabs.length - 1]); return; }
          if (!step) return;
          e.preventDefault();
          var next = tabs[(i + step + tabs.length) % tabs.length];
          next.focus();
          select(next);
        });
      });

      select(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]);
    });
  })();

  /* --- FQ score calculator ---------------------------------------------
     Three weighted components, nothing else. The point of the widget is
     to make the weighting legible, not to produce a real score.      */
  (function calculator() {
    var root = document.querySelector('[data-calc]');
    if (!root) return;

    var inputs = Array.prototype.slice.call(root.querySelectorAll('input[type="range"][data-weight]'));
    var totals = root.querySelectorAll('[data-calc-total]');
    var workings = root.querySelector('[data-calc-workings]');
    var arc = root.querySelector('.gauge__arc');
    if (!inputs.length || !totals.length) return;

    function update() {
      var sum = 0;
      var parts = [];

      inputs.forEach(function (input) {
        var weight = parseFloat(input.dataset.weight);
        var value = parseFloat(input.value);
        sum += (weight / 100) * value;
        parts.push(weight + '% × ' + value);
        var out = root.querySelector('[data-out="' + input.id + '"]');
        if (out) out.textContent = value + '/100';
      });

      var score = Math.round(sum);
      totals.forEach(function (node) { node.textContent = String(score); });
      if (workings) workings.textContent = parts.join('  +  ') + '  =  ' + score;
      if (arc) {
        var len = parseFloat(arc.dataset.length || '0');
        arc.style.strokeDashoffset = String(len * (1 - score / 100));
      }
    }

    inputs.forEach(function (input) { input.addEventListener('input', update); });
    update();
  })();

  /* --- Axis picker on the styles page ----------------------------------
     Three either/or switches resolve to one of the eight styles.    */
  (function picker() {
    var root = document.querySelector('[data-picker]');
    if (!root) return;

    var choice = { horizon: 'V', arena: 'I', mode: 'M' };

    var out = {
      code: root.querySelector('[data-picker-code]'),
      name: root.querySelector('[data-picker-name]'),
      line: root.querySelector('[data-picker-line]'),
      read: root.querySelector('[data-picker-read]'),
      link: root.querySelector('[data-picker-link]')
    };

    function resolve() {
      var code = choice.horizon + choice.arena + choice.mode;
      var style = window.FC_STYLES && window.FC_STYLES[code];
      if (!style) return;

      if (out.code) out.code.textContent = code;
      if (out.name) out.name.textContent = 'The ' + style.name;
      if (out.line) out.line.textContent = style.line;
      if (out.read) out.read.textContent = style.reading;
      if (out.link) out.link.href = '#style-' + style.name.toLowerCase();

      root.querySelectorAll('[data-style-code]').forEach(function (tile) {
        tile.dataset.active = String(tile.dataset.styleCode === code);
      });
    }

    root.querySelectorAll('.switch__opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var axis = btn.dataset.axis;
        choice[axis] = btn.dataset.pole;
        root.querySelectorAll('[data-axis="' + axis + '"]').forEach(function (sibling) {
          sibling.setAttribute('aria-pressed', String(sibling === btn));
        });
        resolve();
      });
    });

    resolve();
  })();

  /* --- Print (the sample dashboard is the page people print) ---------- */
  (function print_() {
    document.querySelectorAll('[data-print]').forEach(function (btn) {
      btn.addEventListener('click', function () { window.print(); });
    });
  })();

  /* --- Enquiry form ---------------------------------------------------
     There is no backend and no third party. The form composes a mailto:
     so the message leaves from the sender's own client, and the address
     stays visible on the page for anyone who would rather write it. */
  (function enquiry() {
    var form = document.querySelector('[data-enquiry]');
    if (!form) return;

    var status = form.querySelector('[data-enquiry-status]');
    var ADDRESS = 'hello@foundercode.co';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var get = function (name) {
        var el = form.elements[name];
        return el && el.value ? el.value.trim() : '';
      };

      var subject = 'Founder Code enquiry — ' + (get('need') || 'general');
      var body = [
        'Name: ' + get('name'),
        'Organisation: ' + (get('organisation') || '—'),
        'Type: ' + get('role'),
        'Need: ' + get('need'),
        '',
        'The decision:',
        get('message') || '—'
      ].join('\n');

      window.location.href = 'mailto:' + ADDRESS +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      if (status) {
        status.textContent = 'Opening your email client. If nothing happens, write to ' + ADDRESS + ' directly.';
      }
    });
  })();
})();
