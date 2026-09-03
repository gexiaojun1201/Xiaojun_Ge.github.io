/*
 * WUR motion layer — the JavaScript half of motion.css.
 *
 * Two spring systems, both integrated by hand so that a fast in/out keeps
 * its current velocity instead of snapping back to the start of a keyframe:
 *
 *   pill button    spring(stiffness 300, damping 30, mass 1)  → scale, shadow
 *   photo outline  spring(tension 280, friction 60, mass 1)   → mask path
 *
 * Both figures come from the wur.nl teardown. React Spring's tension/friction
 * are the same two coefficients as Motion's stiffness/damping, so one
 * integrator serves both.
 *
 * The page is rendered by a React-based template runtime, so any node here
 * can be thrown away and rebuilt on a route change. Nothing is wired up at
 * load time only: `sweep()` re-runs from a MutationObserver and skips work
 * that is already done via a marker attribute the runtime does not manage.
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var STEP = 1 / 120;

  /* Semi-implicit Euler. Returns [value, velocity]. */
  function integrate(value, velocity, target, dt, k, c, mass) {
    var acceleration = (-k * (value - target) - c * velocity) / mass;
    velocity += acceleration * dt;
    value += velocity * dt;
    return [value, velocity];
  }

  /* ── 1. Pill button ─────────────────────────────────────────────────── */

  var PILL = { k: 300, c: 30, mass: 1 };

  function setupPill(el) {
    var scale = 1, scaleV = 0, scaleTarget = 1;
    var shadow = 0, shadowV = 0, shadowTarget = 0;
    var hovered = false, focused = false, pressed = false;
    var raf = 0, previous = 0;

    function render() {
      var p = Math.max(0, Math.min(1, shadow));
      el.style.transform = 'scale(' + scale + ')';
      el.style.boxShadow = '0 0 ' + (10 * p) + 'px 0 rgba(0, 0, 0, ' + (0.18 * p) + ')';
    }

    function frame(now) {
      var remaining = Math.min((now - previous) / 1000, 0.25);
      previous = now;
      while (remaining > 0) {
        var dt = Math.min(remaining, STEP);
        var s = integrate(scale, scaleV, scaleTarget, dt, PILL.k, PILL.c, PILL.mass);
        scale = s[0]; scaleV = s[1];
        var h = integrate(shadow, shadowV, shadowTarget, dt, PILL.k, PILL.c, PILL.mass);
        shadow = h[0]; shadowV = h[1];
        remaining -= dt;
      }
      render();
      var moving =
        Math.abs(scale - scaleTarget) > 0.0001 || Math.abs(scaleV) > 0.0001 ||
        Math.abs(shadow - shadowTarget) > 0.001 || Math.abs(shadowV) > 0.001;
      if (moving) { raf = requestAnimationFrame(frame); return; }
      scale = scaleTarget; shadow = shadowTarget;
      scaleV = 0; shadowV = 0;
      render();
      raf = 0;
    }

    function sync() {
      if (pressed) { scaleTarget = 0.95; shadowTarget = 0; }
      else if (hovered || focused) { scaleTarget = 1.02; shadowTarget = 1; }
      else { scaleTarget = 1; shadowTarget = 0; }

      if (reduced.matches) {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        scale = 1; shadow = 0; scaleV = 0; shadowV = 0;
        render();
        return;
      }
      if (!raf) { previous = performance.now(); raf = requestAnimationFrame(frame); }
    }

    el.addEventListener('pointerenter', function () { hovered = true; sync(); });
    el.addEventListener('pointerleave', function () { hovered = false; pressed = false; sync(); });
    el.addEventListener('focus', function () { focused = true; sync(); });
    el.addEventListener('blur', function () { focused = false; pressed = false; sync(); });
    el.addEventListener('pointerdown', function () { pressed = true; sync(); });

    /* These two outlive the element — the runtime throws the button away on
       every route change — so they retire themselves once it is detached
       rather than piling up one dead closure per navigation. */
    function onWindowUp() {
      if (!el.isConnected) { detach(); return; }
      if (!pressed) return;
      pressed = false;
      sync();
    }
    function onReducedChange() {
      if (!el.isConnected) { detach(); return; }
      sync();
    }
    function detach() {
      window.removeEventListener('pointerup', onWindowUp);
      reduced.removeEventListener('change', onReducedChange);
    }
    window.addEventListener('pointerup', onWindowUp);
    reduced.addEventListener('change', onReducedChange);
    render();
  }

  /* ── 2. Project photo tiles ─────────────────────────────────────────── */

  var MORPH = { k: 280, c: 60, mass: 1 };
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var XLINK_NS = 'http://www.w3.org/1999/xlink';

  /*
   * Six original blobs, all sharing one topology — M, six cubic segments,
   * Z, thirty-eight numbers apiece — which is what makes a number-by-number
   * interpolation between any two of them legal.
   *
   * Six anchors rather than four, with the handle lengths held close to the
   * circular ratio (4/3·tan(π/12)·r) and only a few degrees of angular
   * jitter: curvature then stays continuous across every joint, so the
   * outline reads as a pebble instead of a rounded polygon. The variety
   * comes from the radii, which swing about 4% either side of 242.
   *
   * Drawn for this site from its own parameters, not lifted from anyone
   * else's build, and each one checked to stay inside the 580x500 canvas
   * once the fixed scale(.9) in motion.css is applied.
   */
  var PATHS = [
    'M511.04 238.04C519.2 331.31 442.27 433.68 363.46 472.12C288.43 508.71 239.35 521.18 159.54 485.65C74.89 447.96 24.78 334.45 29.32 247.91C33.64 165.5 46.16 102.69 120.2 52.74C196.47 1.3 329.62 13.93 401.07 65.84C471.13 116.74 503.12 147.45 511.04 238.04Z',
    'M492.72 284.46C484.07 366.77 475.83 414.07 403.39 464.79C326.57 518.58 200.93 507.24 126.91 457.31C56.42 409.76 18.79 375.88 9.38 286.34C-0.41 193.22 83.07 85.42 161.53 48.83C237.73 13.3 292.86 -1.6 372.59 39.03C453.9 80.46 501.72 198.82 492.72 284.46Z',
    'M507.4 242.7C513.89 335.51 433.87 436.54 354.36 471.94C278.64 505.66 198.26 520.38 122.75 471.34C44.98 420.84 31.5 367.54 23.9 280.66C16.37 194.62 89.14 83.21 166.04 48.97C240.68 15.74 290.24 -4.51 370.03 34.4C453.85 75.29 500.97 150.78 507.4 242.7Z',
    'M496.1 280.66C488.72 365.01 480.08 410.35 407.53 463.06C332.08 517.88 235.67 507.37 157.86 469.42C83.79 433.29 3.16 321.56 12.36 233.97C22.13 141.08 43.47 100.14 122.75 48.66C199.77 -1.36 320.16 18.32 390.85 66.01C460.16 112.75 503.48 196.31 496.1 280.66Z',
    'M509.62 233.76C519.28 325.62 446.08 432.3 368.05 472.06C291.53 511.05 191.66 495.88 124.22 446.88C54.78 396.43 15.15 370.98 8.61 277.58C2.4 188.67 81.52 84.48 156.54 47.88C236.12 9.08 280.33 -1.95 363.96 37.05C443.62 74.19 500.25 144.58 509.62 233.76Z',
    'M491.43 276.18C485.54 360.52 472.74 414.44 398.12 464.77C322.77 515.6 191.96 517.55 116.61 464.79C44.17 414.07 18.63 317.85 27.28 235.54C36.46 148.24 36.29 112.28 112.47 56.94C185.01 4.23 318.31 14.09 389.62 60.4C463.79 108.56 497.45 190.19 491.43 276.18Z'
  ];

  var NUMBER = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
  var PARTS = PATHS[0].split(NUMBER);
  var TARGETS = PATHS.map(function (d) { return d.match(NUMBER).map(Number); });

  function composePath(numbers) {
    var out = '';
    for (var i = 0; i < PARTS.length; i++) {
      out += PARTS[i];
      if (i < numbers.length) out += numbers[i].toFixed(3);
    }
    return out;
  }

  /* The empty-slot look: the site's own light sand behind a hairline sand
     border, flat — no gradient, no theme accent. */
  var PLACEHOLDER_FILL = '#F3ECD3';
  var PLACEHOLDER_EDGE = '#E9E1C4';
  var PLACEHOLDER_INK = '#4B5E45';

  var shotSeq = 0;

  function svgEl(name, attrs) {
    var el = document.createElementNS(SVG_NS, name);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  /* One masked canvas: the photo if there is one, otherwise the flat sand
     placeholder. `edge` traces the same outline outside the mask so the
     shape carries the site's hairline border. Returns the two paths the
     caller has to keep in step while the outline springs. */
  function buildCanvas(uid, src) {
    var svg = svgEl('svg', { viewBox: '0 0 580 500', fill: 'none' });

    var defs = svgEl('defs');
    var mask = svgEl('mask', { id: uid + '-mask' });
    var path = svgEl('path', { fill: 'white' });
    mask.appendChild(path);
    defs.appendChild(mask);
    svg.appendChild(defs);

    var group = svgEl('g', { mask: 'url(#' + uid + '-mask)' });
    group.appendChild(svgEl('rect', {
      width: '100%', height: '100%', fill: PLACEHOLDER_FILL
    }));

    if (src) {
      var photo = svgEl('image', {
        width: '100%', height: '100%', preserveAspectRatio: 'xMidYMid slice'
      });
      photo.setAttributeNS(XLINK_NS, 'href', src);
      photo.setAttribute('href', src);
      group.appendChild(photo);
    } else {
      var text = svgEl('text', {
        x: '290', y: '262', 'text-anchor': 'middle',
        fill: PLACEHOLDER_INK,
        'font-family': "'Commissioner', system-ui, sans-serif",
        'font-size': '46', 'font-weight': '600'
      });
      text.textContent = '+';
      group.appendChild(text);
    }
    svg.appendChild(group);

    var edge = svgEl('path', {
      fill: 'none', stroke: PLACEHOLDER_EDGE, 'stroke-width': '2'
    });
    svg.appendChild(edge);

    return { svg: svg, path: path, edge: edge };
  }

  /* ── Full-size view ──────────────────────────────────────────────────
     The organic mask is a thumbnail treatment only — full size is a plain
     rounded rectangle, so a real photo opens uncropped. With no photo
     attached yet a rectangular stand-in opens instead, which keeps the
     interaction testable before the photography exists. */
  var openBox = null;

  /*
   * Two stacked backdrop-filters is the combination that renders as solid
   * black instead of frosted glass on a number of GPU compositing paths.
   * The project modal's scrim is already blurring the page, so it steps
   * aside for as long as this layer is up and takes over again on close —
   * one filter active at a time, same look, no black screen.
   */
  function pauseScrimBlur() {
    var host = document.querySelector('.wur-scrim');
    if (!host) return function () {};
    var blur = host.style.backdropFilter;
    var webkitBlur = host.style.webkitBackdropFilter;
    host.style.backdropFilter = 'none';
    host.style.webkitBackdropFilter = 'none';
    return function () {
      host.style.backdropFilter = blur;
      host.style.webkitBackdropFilter = webkitBlur;
    };
  }

  function openLightbox(src, caption) {
    /* Belt and braces against a double binding ever slipping through: two
       of these stacked would darken to near-black and need two dismissals. */
    if (openBox) return;

    var box = document.createElement('div');
    box.className = 'wur-lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', caption || 'Photo');

    var inner = document.createElement('div');
    inner.className = 'wur-lightbox__inner';

    if (src) {
      var img = new Image();
      img.src = src;
      img.alt = caption || '';
      inner.appendChild(img);
    } else {
      var ph = document.createElement('div');
      ph.className = 'wur-lightbox__ph';
      var plus = document.createElement('span');
      plus.textContent = '+';
      ph.appendChild(plus);
      inner.appendChild(ph);
    }

    if (caption) {
      var cap = document.createElement('div');
      cap.className = 'wur-lightbox__cap';
      cap.textContent = caption;
      inner.appendChild(cap);
    }
    box.appendChild(inner);

    var restoreScrim = pauseScrimBlur();

    function close() {
      if (openBox !== box) return;
      openBox = null;
      box.remove();
      restoreScrim();
      document.removeEventListener('keydown', onKey, true);
    }
    function onKey(e) {
      if (e.key !== 'Escape') return;
      /* The project modal closes on Escape too; swallow this one so the
         first press only dismisses the photo. */
      e.stopPropagation();
      close();
    }
    box.addEventListener('click', close);
    document.addEventListener('keydown', onKey, true);

    openBox = box;
    document.body.appendChild(box);
    box.focus && box.focus();
  }

  function setupShots(root) {
    var tiles = Array.prototype.slice.call(root.querySelectorAll('.wur-shot__btn'));
    if (!tiles.length) return;

    var gen = (root.__wurGen = (root.__wurGen || 0) + 1);
    function current() { return root.isConnected && root.__wurGen === gen; }

    /* A re-setup on the same tiles — the runtime reuses them whenever one
       modal replaces another — must not leave the previous generation's
       handlers attached, or one click would open one layer per generation. */
    if (root.__wurAbort) root.__wurAbort.abort();
    var signal = (root.__wurAbort = new AbortController()).signal;

    tiles.forEach(function (tile, index) {
      var src = tile.getAttribute('data-photo') || '';
      var caption = tile.getAttribute('data-caption') || '';
      var cursor = parseInt(tile.getAttribute('data-shape'), 10);
      if (!Number.isFinite(cursor)) cursor = index;
      cursor = cursor % TARGETS.length;

      if (src) { var pre = new Image(); pre.src = src; }

      /* The runtime renders the button with no children, so it never
         patches inside it — safe to own this subtree from here. */
      tile.textContent = '';
      var canvas = buildCanvas('wur-shot-' + (++shotSeq), src);
      tile.appendChild(canvas.svg);

      var values = TARGETS[cursor].slice();
      var velocities = values.map(function () { return 0; });
      var target = TARGETS[cursor].slice();
      var raf = 0, previous = 0, accumulator = 0;

      function render() {
        var d = composePath(values);
        canvas.path.setAttribute('d', d);
        canvas.edge.setAttribute('d', d);
      }

      function settled() {
        for (var i = 0; i < values.length; i++) {
          if (Math.abs(values[i] - target[i]) >= 0.005) return false;
          if (Math.abs(velocities[i]) >= 0.01) return false;
        }
        return true;
      }

      function frame(now) {
        if (!current()) { raf = 0; return; }
        if (!previous) previous = now;
        accumulator = Math.min(accumulator + (now - previous) / 1000, 0.25);
        previous = now;
        while (accumulator >= STEP) {
          for (var i = 0; i < values.length; i++) {
            var r = integrate(values[i], velocities[i], target[i], STEP,
                              MORPH.k, MORPH.c, MORPH.mass);
            values[i] = r[0]; velocities[i] = r[1];
          }
          accumulator -= STEP;
        }
        render();
        if (settled()) {
          values = target.slice();
          for (var j = 0; j < velocities.length; j++) velocities[j] = 0;
          raf = 0; previous = 0; accumulator = 0;
          render();
          return;
        }
        raf = requestAnimationFrame(frame);
      }

      function morphTo(shapeIndex) {
        target = TARGETS[shapeIndex].slice();
        if (reduced.matches) {
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          values = target.slice();
          for (var i = 0; i < velocities.length; i++) velocities[i] = 0;
          render();
          return;
        }
        if (!raf) { previous = 0; raf = requestAnimationFrame(frame); }
      }

      /* Step forward through the set on the way in AND on the way out, so
         a tile never returns to the outline it started from — hover it
         twice and it has been four shapes. */
      function advance() {
        cursor = (cursor + 1) % TARGETS.length;
        morphTo(cursor);
      }
      tile.addEventListener('pointerenter', advance, { signal: signal });
      tile.addEventListener('pointerleave', advance, { signal: signal });
      tile.addEventListener('focus', advance, { signal: signal });
      tile.addEventListener('blur', advance, { signal: signal });
      tile.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(src, caption);
      }, { signal: signal });

      render();
    });
  }

  /* ── 4. Collapsible sections, narrow screens only ───────────────────
     The wide layout shows every section at once; a phone that scrolls the
     same page pays five screens for it. Below 760px each `.wur-fold` keeps
     its heading and folds its body away until tapped.
     The wiring is unconditional — the marker and the listener go on once,
     whatever the width — and the width test lives in the handler, so a
     rotation or a resized window needs no re-sweep. Above 760px the
     stylesheet ignores the state attribute entirely, so the desktop page
     renders exactly as it did before this existed. */
  var narrow = window.matchMedia('(max-width: 760px)');
  var folds = [];

  function syncFoldA11y(entry) {
    var fold = entry.fold, head = entry.head;
    if (!fold.isConnected) return;
    if (narrow.matches) {
      head.setAttribute('role', 'button');
      head.setAttribute('tabindex', '0');
      head.setAttribute('aria-expanded', fold.hasAttribute('data-open') ? 'true' : 'false');
    } else {
      /* Off the phone the heading is a heading again, not a control. */
      head.removeAttribute('role');
      head.removeAttribute('tabindex');
      head.removeAttribute('aria-expanded');
    }
  }

  function setupFold(fold) {
    var head = fold.querySelector('.wur-fold__head');
    var body = fold.querySelector('.wur-fold__body');
    if (!head || !body) return;

    /* Drawn from borders rather than a glyph: it has to point the same way
       in the serif headings and the sans section rows. */
    var chevron = document.createElement('span');
    chevron.className = 'wur-fold__chevron';
    chevron.setAttribute('aria-hidden', 'true');
    head.appendChild(chevron);

    var entry = { fold: fold, head: head };
    folds.push(entry);

    function toggle() {
      if (fold.hasAttribute('data-open')) fold.removeAttribute('data-open');
      else fold.setAttribute('data-open', '');
      syncFoldA11y(entry);
    }

    head.addEventListener('click', function (event) {
      if (!narrow.matches) return;
      /* "All publications →" sits inside this row and still navigates. */
      if (event.target.closest && event.target.closest('a')) return;
      toggle();
    });

    head.addEventListener('keydown', function (event) {
      if (!narrow.matches) return;
      if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return;
      if (event.target !== head) return;
      event.preventDefault();
      toggle();
    });

    syncFoldA11y(entry);
  }

  narrow.addEventListener('change', function () {
    folds = folds.filter(function (entry) { return entry.fold.isConnected; });
    folds.forEach(syncFoldA11y);
  });

  function shotsSignature(root) {
    var tiles = root.querySelectorAll('.wur-shot__btn');
    var parts = [String(tiles.length)];
    for (var i = 0; i < tiles.length; i++) {
      parts.push(
        (tiles[i].getAttribute('data-photo') || '') + '\u0000' +
        (tiles[i].getAttribute('data-caption') || '')
      );
    }
    return parts.join('\u0001');
  }

  function sweep() {
    var pills = document.querySelectorAll('.wur-pill:not([data-wur-on])');
    for (var i = 0; i < pills.length; i++) {
      pills[i].setAttribute('data-wur-on', '');
      setupPill(pills[i]);
    }
    var newFolds = document.querySelectorAll('.wur-fold:not([data-wur-fold])');
    for (var f = 0; f < newFolds.length; f++) {
      newFolds[f].setAttribute('data-wur-fold', '');
      setupFold(newFolds[f]);
    }
    /* A marker attribute is not enough here: when one modal replaces
       another the runtime keeps the same element and only swaps the slot
       data, so the check has to be on content, not on "seen before". */
    var roots = document.querySelectorAll('.wur-shots');
    for (var j = 0; j < roots.length; j++) {
      var sig = shotsSignature(roots[j]);
      if (roots[j].__wurSig === sig) continue;
      roots[j].__wurSig = sig;
      setupShots(roots[j]);
    }
  }

  var pending = 0;
  function scheduleSweep() {
    if (pending) return;
    pending = requestAnimationFrame(function () { pending = 0; sweep(); });
  }

  function start() {
    sweep();
    new MutationObserver(scheduleSweep).observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
