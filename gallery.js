/* ─────────────────────────────────────────────────────────────────────────
   Gallery.

   A plain-JS port of the prototype in gallery-prototype/ (React there, no
   build step here). The behaviour and every timing follow the prototype:

     CinemaApp.tsx   → openAt / requestClose / alignShelf / flyStageTo
     DetailStage.tsx → go / nudge / bright / swipe / the delayed text
     Shelf.tsx       → rows, drag to scroll, arrow buttons, keyboard cursor
     Art.tsx         → picture with a loading shimmer

   The page is drawn by the template runtime, which rebuilds a view on every
   route change. So this file does not run once: it watches for the
   empty `[data-xgal]` element in the Gallery view and fills it whenever a new
   one shows up — the same way motion.js picks up its pills and folds.

   The words come from the project cards (index.html publishes them as
   window.XG_PROJECTS), so a project is described in one place. What this
   file adds is the photos, below.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── The photos ───────────────────────────────────────────────────────
     One shelf row per project, in the order of the projects on the page.
     To use a real photo, put the file in images/gallery/ and change `src`.
     `caption` is the line under the picture; `focus` is which part of the
     photo stays in view when it is cropped to a card ("center 30%" keeps
     the upper third of a portrait photo, say). Add or remove entries
     freely — a row takes any number of photos. */
  var GALLERY = {
    'proj-carbon-sink': {
      label: 'Plantation carbon sink',
      photos: [
        { src: 'images/gallery/carbon-sink-1.svg', caption: 'Field site or sampling', focus: 'center' },
        { src: 'images/gallery/carbon-sink-2.svg', caption: 'Laboratory or instrument', focus: 'center' },
        { src: 'images/gallery/carbon-sink-3.svg', caption: 'Data, plot or team', focus: 'center' },
        { src: 'images/gallery/carbon-sink-4.svg', caption: 'Study site', focus: 'center' }
      ]
    },
    'proj-wetland': {
      label: 'Constructed wetlands',
      photos: [
        { src: 'images/gallery/wetland-1.svg', caption: 'Field site or sampling', focus: 'center' },
        { src: 'images/gallery/wetland-2.svg', caption: 'Laboratory or instrument', focus: 'center' },
        { src: 'images/gallery/wetland-3.svg', caption: 'Data, plot or team', focus: 'center 30%' },
        { src: 'images/gallery/wetland-4.svg', caption: 'Study site', focus: 'center' }
      ]
    },
    'proj-nanling': {
      label: 'Nanling forest soils',
      photos: [
        { src: 'images/gallery/nanling-1.svg', caption: 'Field site or sampling', focus: 'center' },
        { src: 'images/gallery/nanling-2.svg', caption: 'Laboratory or instrument', focus: 'center' },
        { src: 'images/gallery/nanling-3.svg', caption: 'Data, plot or team', focus: 'center' },
        { src: 'images/gallery/nanling-4.svg', caption: 'Study site', focus: 'center' }
      ]
    },
    'proj-dvrt': {
      label: 'Deep tillage & erosion',
      photos: [
        { src: 'images/gallery/dvrt-1.svg', caption: 'Field site or sampling', focus: 'center' },
        { src: 'images/gallery/dvrt-2.svg', caption: 'Laboratory or instrument', focus: 'center' },
        { src: 'images/gallery/dvrt-3.svg', caption: 'Data, plot or team', focus: 'center' },
        { src: 'images/gallery/dvrt-4.svg', caption: 'Study site', focus: 'center' }
      ]
    }
  };

  /* ── Timings from the prototype ───────────────────────────────────────
     TRAVEL has to equal --xgal-travel in gallery.css. */
  var TRAVEL = 800;            /* left / right slide                         */
  var EXIT_MS = 620;           /* viewer flying back to its card             */
  var EXIT_LITE_MS = 260;      /* phone: plain fade                          */
  var CHROME_DELAY = 640;      /* text appears after the viewer has settled  */
  var CHROME_DELAY_LITE = 200;
  var CHROME_AFTER_SLIDE = 380;

  var LITE = window.matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)');

  /* ── Small helpers ──────────────────────────────────────────────────── */

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var ICONS = {
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'
  };

  function icon(name) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = ICONS[name];
    return svg;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function button(className, label) {
    var b = el('button', className);
    b.type = 'button';
    if (label) b.setAttribute('aria-label', label);
    return b;
  }

  /* The page is drawn under `body{zoom:var(--page-zoom)}`. Rects from
     getBoundingClientRect are screen pixels, while scrollLeft and CSS
     lengths are in the zoomed element's own pixels; this is the ratio. */
  function scaleOf(node) {
    return node.offsetWidth > 0 ? node.getBoundingClientRect().width / node.offsetWidth || 1 : 1;
  }

  function pageZoom() {
    var z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--page-zoom'));
    return z > 0 ? z : 1;
  }

  /* Picture that fades in once loaded and shows a shimmer until then.
     With `contain`, a portrait photo is shown whole over a blurred copy of
     itself instead of being cropped. */
  function makeArt(item, contain) {
    var wrap = el('div', 'xgal-art is-loading');
    var img = new Image();
    img.alt = '';
    img.draggable = false;
    img.decoding = 'async';
    img.style.objectPosition = item.focus || 'center';
    if (!contain) img.loading = 'lazy';

    var done = false;
    function ready() {
      if (done) return;
      done = true;
      wrap.classList.remove('is-loading');
      wrap.classList.add('is-ready');
      if (contain && img.naturalHeight > img.naturalWidth * 1.05) {
        var back = new Image();
        back.className = 'xgal-art__back';
        back.alt = '';
        back.setAttribute('aria-hidden', 'true');
        back.src = item.src;
        wrap.insertBefore(back, img);
        wrap.classList.add('is-portrait');
      }
    }

    img.onload = ready;
    img.onerror = function () {
      wrap.classList.remove('is-loading');
      wrap.classList.add('is-error');
    };
    img.src = item.src;
    if (img.complete && img.naturalWidth > 0) ready();
    wrap.appendChild(img);
    return wrap;
  }

  /* Reads the lower left of the picture, where the text sits, and says
     whether it is light enough to need dark ink. The prototype switched at
     78 (of 255); a mid-dark green photo came out "light" and got dark text
     on dark. Light text with its own dark wash holds on anything but a
     clearly light picture, so the switch sits at 140. */
  function measureTone(src, focus, aspect) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        /* Sampled at the shape of the window the picture is cropped to — a
           wide stage on a desktop, a tall one on a phone. */
        var h = 27, w = Math.max(12, Math.round(h * aspect));
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx || !img.naturalWidth) { resolve('paper'); return; }
        var scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        var dw = img.naturalWidth * scale;
        var dh = img.naturalHeight * scale;
        var fy = focus && focus.indexOf('%') >= 0 ? parseFloat(focus.split(' ').pop()) / 100 : 0.5;
        ctx.drawImage(img, (w - dw) / 2, (h - dh) * (isFinite(fy) ? fy : 0.5), dw, dh);
        var y0 = Math.floor(h * 0.52);
        var data;
        try { data = ctx.getImageData(2, y0, Math.floor(w * 0.6), h - y0 - 1).data; }
        catch (err) { resolve('paper'); return; }
        var sum = 0;
        for (var i = 0; i < data.length; i += 4) {
          sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        }
        resolve(sum / (data.length / 4) >= 140 ? 'ink' : 'paper');
      };
      img.onerror = function () { resolve('paper'); };
      img.src = src;
    });
  }

  /* "Sep 2020 – Jun 2022" -> "2020\u20132022"; "Nov 2022 – present" -> "2022\u2013present". */
  function yearSpan(period) {
    var years = (period || '').match(/\d{4}/g) || [];
    if (!years.length) return '';
    var last = /present/i.test(period) ? 'present' : years[years.length - 1];
    return years[0] === last ? years[0] : years[0] + '\u2013' + last;
  }

  function buildRows(projects) {
    var rows = [];
    projects.forEach(function (p) {
      var cfg = GALLERY[p.id];
      if (!cfg || !cfg.photos.length) return;
      rows.push({
        id: p.id,
        label: cfg.label,
        years: yearSpan(p.period),
        project: p,
        items: cfg.photos.map(function (ph, i) {
          return { id: p.id + ':' + i, src: ph.src, caption: ph.caption || '', focus: ph.focus || 'center' };
        })
      });
    });
    return rows;
  }

  /* ── One gallery ────────────────────────────────────────────────────── */

  function createGallery(host, projects) {
    var rows = buildRows(projects);
    if (!rows.length) return null;

    var cursor = { row: 0, col: 0 };
    var keyboard = false;
    var anchored = false;
    var cards = rows.map(function () { return []; });
    var layer = null;
    var scrim = null;
    var D = null;                 /* the open viewer, or null */
    var observer = null;

    host.classList.add('xgal');
    host.tabIndex = -1;

    /* Shelf ------------------------------------------------------------ */

    var shelf = el('div', 'xgal-shelf');

    rows.forEach(function (row, rowIndex) {
      var section = el('section', 'xgal-row');
      section.setAttribute('aria-label', row.label);

      var label = el('h3', 'xgal-label');
      if (row.years) label.appendChild(el('span', 'xgal-label__years', row.years));
      label.appendChild(el('span', 'xgal-label__name', row.label));

      var prev = button('xgal-rowbtn prev', 'Scroll left');
      prev.appendChild(icon('left'));
      var next = button('xgal-rowbtn next', 'Scroll right');
      next.appendChild(icon('right'));

      var scroller = el('div', 'xgal-scroller');
      var drag = { down: false, x: 0, left: 0, moved: false };

      prev.addEventListener('click', function () { scrollRow(scroller, -1); });
      next.addEventListener('click', function () { scrollRow(scroller, 1); });

      scroller.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        drag.down = true;
        drag.x = e.clientX;
        drag.left = scroller.scrollLeft;
        drag.moved = false;
      });
      scroller.addEventListener('pointermove', function (e) {
        if (!drag.down) return;
        var dx = e.clientX - drag.x;
        if (Math.abs(dx) < 8) return;
        if (!drag.moved) {
          drag.moved = true;
          scroller.setPointerCapture(e.pointerId);
        }
        scroller.scrollLeft = drag.left - dx / scaleOf(scroller);
        scroller.classList.add('is-drag');
      });
      scroller.addEventListener('pointerup', function () {
        drag.down = false;
        scroller.classList.remove('is-drag');
      });
      scroller.addEventListener('pointercancel', function () { drag.down = false; });

      row.items.forEach(function (item, col) {
        var card = button('xgal-card', row.label + ': ' + item.caption);
        card.appendChild(makeArt(item, false));
        card.addEventListener('focus', function () { cursor = { row: rowIndex, col: col }; });
        card.addEventListener('click', function () {
          /* A drag ends in a click; it must not open anything. */
          if (drag.moved) { drag.moved = false; return; }
          openAt(rowIndex, col);
        });
        cards[rowIndex].push(card);
        scroller.appendChild(card);
      });

      section.appendChild(label);
      section.appendChild(prev);
      section.appendChild(scroller);
      section.appendChild(next);
      shelf.appendChild(section);
    });

    host.appendChild(shelf);

    function scrollRow(scroller, dir) {
      scroller.scrollBy({ left: dir * scroller.clientWidth * 0.72, behavior: 'smooth' });
    }

    /* The card the cursor is on keeps a ring, and is the one the viewer
       flies back to. */
    function renderMarks() {
      cards.forEach(function (list, r) {
        list.forEach(function (card, c) {
          var marked = (keyboard || anchored) && cursor.row === r && cursor.col === c;
          card.classList.toggle('is-focus', marked);
          card.classList.toggle('is-return', marked);
        });
      });
    }

    function moveCursor(row, col) {
      cursor = { row: row, col: col };
      keyboard = true;
      renderMarks();
      var card = cards[row][col];
      card.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      card.focus({ preventScroll: true });
    }

    host.addEventListener('keydown', function (e) {
      if (D) return;
      /* The row's scroll buttons keep their own Enter. */
      if (e.target !== host && !e.target.classList.contains('xgal-card')) return;
      var row = rows[cursor.row];
      var nextRow;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveCursor(cursor.row, Math.min(row.items.length - 1, cursor.col + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveCursor(cursor.row, Math.max(0, cursor.col - 1));
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        nextRow = Math.max(0, Math.min(rows.length - 1, cursor.row + (e.key === 'ArrowDown' ? 1 : -1)));
        /* At the first or last row the key goes on scrolling the page. */
        if (nextRow === cursor.row) return;
        e.preventDefault();
        moveCursor(nextRow, Math.min(cursor.col, rows[nextRow].items.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        openAt(cursor.row, cursor.col);
      }
    });

    /* Rows arrive when the section scrolls into view. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      host.classList.add('is-live');
    } else {
      observer = new IntersectionObserver(function (entries) {
        if (entries.some(function (en) { return en.isIntersecting; })) {
          host.classList.add('is-live');
          observer.disconnect();
        }
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
      observer.observe(host);
    }

    /* Shelf position for a card ----------------------------------------- */

    /* Scroll the row so the card is centred, then bring the row on screen.
       Returns the card. */
    function alignShelf(rowIndex, col) {
      var card = cards[rowIndex] && cards[rowIndex][col];
      if (!card) return null;
      var scroller = card.parentElement;
      var cardRect = card.getBoundingClientRect();
      var scrollerRect = scroller.getBoundingClientRect();
      var delta = (cardRect.left + cardRect.width / 2 - (scrollerRect.left + scrollerRect.width / 2)) / scaleOf(scroller);
      scroller.scrollLeft += delta;
      card.closest('.xgal-row').scrollIntoView({ block: 'nearest', behavior: 'auto' });
      return card;
    }

    /* The viewer's window shrinks onto the card, in screen pixels, and
       fades out on the last stretch. */
    function flyStageTo(stage, card) {
      if (!stage || !card) return false;
      var from = stage.getBoundingClientRect();
      var to = card.getBoundingClientRect();
      if (from.width < 2 || to.width < 2) return false;
      var cardRadius = (parseFloat(getComputedStyle(card).borderTopLeftRadius) || 16) * pageZoom();
      var stageRadius = parseFloat(getComputedStyle(stage).borderTopLeftRadius) || 24;
      function box(rect, opacity, radius) {
        return {
          left: rect.left + 'px',
          top: rect.top + 'px',
          width: rect.width + 'px',
          height: rect.height + 'px',
          right: 'auto',
          bottom: 'auto',
          borderRadius: radius + 'px',
          opacity: opacity
        };
      }
      var mid = box(to, 1, cardRadius);
      mid.offset = 0.84;
      stage.animate([box(from, 1, stageRadius), mid, box(to, 0, cardRadius)], {
        duration: EXIT_MS,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      });
      return true;
    }

    /* Viewer -------------------------------------------------------------- */

    function ensureLayer() {
      if (layer) return;
      layer = el('div', 'xgal-layer');
      scrim = el('div', 'xgal-scrim');
      layer.appendChild(scrim);
      document.body.appendChild(layer);
    }

    function openAt(rowIndex, col) {
      if (D) return;
      var row = rows[rowIndex];
      if (!row) return;
      anchored = true;
      cursor = { row: rowIndex, col: col };
      renderMarks();
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();

      ensureLayer();
      var lite = LITE.matches;
      layer.classList.toggle('is-lite', lite);
      host.classList.toggle('is-lite', lite);

      D = {
        rowIndex: rowIndex,
        row: row,
        index: col,
        lite: lite,
        leaving: false,
        navLock: false,
        showChrome: false,
        bright: [col],
        timers: [],
        slideTimers: [],
        tones: {},
        ptr: null,
        prevOverflow: document.body.style.overflow
      };

      document.body.style.overflow = 'hidden';
      host.classList.add('is-behind');
      host.classList.remove('is-settling');
      scrim.classList.add('on');

      buildDetail();
      layer.appendChild(D.root);
      void D.root.offsetWidth;            /* commit the resting style first */
      D.raf = requestAnimationFrame(function () { D.root.classList.add('is-in'); });
      D.timers.push(setTimeout(function () {
        if (!D.navLock && !D.leaving) { D.showChrome = true; syncChrome(); }
      }, lite ? CHROME_DELAY_LITE : CHROME_DELAY));

      window.addEventListener('keydown', onKey);
      window.addEventListener('hashchange', closeNow);
    }

    function buildDetail() {
      var item = D.row.items[D.index];
      var root = el('div', 'xgal-detail');
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-label', D.row.project.title);

      var ambient = el('div', 'xgal-ambient');
      var ambientImg = new Image();
      ambientImg.alt = '';
      ambientImg.src = item.src;
      ambient.appendChild(ambientImg);

      var stage = el('div', 'xgal-stage');
      stage.addEventListener('pointerdown', function (e) {
        if (e.target.closest && e.target.closest('button')) return;
        D.ptr = { x: e.clientX, y: e.clientY };
      });
      stage.addEventListener('pointerup', function (e) {
        if (!D.ptr) return;
        var dx = e.clientX - D.ptr.x;
        var dy = e.clientY - D.ptr.y;
        D.ptr = null;
        if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
        go(dx < 0 ? 1 : -1);
      });
      stage.addEventListener('pointercancel', function () { D.ptr = null; });

      var shift = el('div', 'xgal-shift');
      var reel = el('div', 'xgal-reel');
      reel.style.setProperty('--i', String(D.index));
      var slides = D.row.items.map(function (it, i) {
        var slide = el('div', 'xgal-slide' + (D.bright.indexOf(i) >= 0 ? ' is-bright' : ''));
        slide.appendChild(makeArt(it, true));
        slide.appendChild(el('div', 'xgal-shade'));
        reel.appendChild(slide);
        return slide;
      });
      shift.appendChild(reel);
      stage.appendChild(shift);

      var prev = button('xgal-nav prev', 'Previous');
      prev.appendChild(icon('left'));
      prev.addEventListener('click', function () { go(-1); });
      var next = button('xgal-nav next', 'Next');
      next.appendChild(icon('right'));
      next.addEventListener('click', function () { go(1); });
      stage.appendChild(prev);
      stage.appendChild(next);

      var back = button('xgal-back');
      back.appendChild(icon('back'));
      back.appendChild(document.createTextNode('Back'));
      back.addEventListener('click', requestClose);

      /* The text: five blocks that arrive one after another. */
      var p = D.row.project;
      var chrome = el('div', 'xgal-chrome is-paper');

      var badgeRow = el('div', 'xgal-badge-row');
      var badge = el('span', 'xgal-badge', /present/i.test(p.period || '') ? 'Ongoing' : 'Completed');
      var counter = el('span', 'xgal-counter');
      badgeRow.appendChild(badge);
      badgeRow.appendChild(counter);

      var titleBlock = el('div', 'xgal-title-block');
      var titleCol = el('div');
      titleCol.appendChild(el('h2', 'xgal-title', p.title));
      var service = el('div', 'xgal-service');
      service.appendChild(el('span', '', (p.fields || []).join(' · ')));
      if (p.period) service.appendChild(el('span', 'xgal-pill', p.period));
      titleCol.appendChild(service);
      var cast = el('p', 'xgal-cast');
      cast.appendChild(el('b', '', 'Position'));
      cast.appendChild(document.createTextNode([p.contributor, p.orgShort].filter(Boolean).join(', ')));
      titleBlock.appendChild(titleCol);
      titleBlock.appendChild(cast);

      var logline = el('p', 'xgal-logline', p.focus || '');
      var caption = el('div', 'xgal-service');

      var actions = el('div', 'xgal-actions');
      var more = el('a', 'wur-pill wur-arrowlink xg-morepill', 'Project details ');
      more.href = '#' + p.id;
      var arrow = el('span', 'wur-arrow', '→');
      arrow.setAttribute('aria-hidden', 'true');
      more.appendChild(arrow);
      /* The project card opens on the page behind; the viewer steps aside
         at once rather than flying back. */
      more.addEventListener('click', closeNow);
      actions.appendChild(more);

      chrome.appendChild(badgeRow);
      chrome.appendChild(titleBlock);
      chrome.appendChild(logline);
      chrome.appendChild(caption);
      chrome.appendChild(actions);

      var sr = el('p', 'xgal-sr');
      sr.setAttribute('aria-live', 'polite');

      root.appendChild(ambient);
      root.appendChild(stage);
      root.appendChild(back);
      root.appendChild(chrome);
      root.appendChild(sr);

      D.root = root;
      D.stage = stage;
      D.reel = reel;
      D.slides = slides;
      D.prev = prev;
      D.next = next;
      D.chrome = chrome;
      D.counter = counter;
      D.caption = caption;
      D.ambientImg = ambientImg;
      D.sr = sr;

      fillItem();
    }

    /* What changes from picture to picture: the counter, the caption, the
       blurred backdrop, the end stops on the arrows and the ink colour. */
    function fillItem() {
      var item = D.row.items[D.index];
      var n = D.row.items.length;
      D.counter.textContent = (D.index + 1) + ' / ' + n;
      D.caption.textContent = '';
      D.caption.appendChild(el('span', '', item.caption));
      D.ambientImg.src = item.src;
      D.prev.classList.toggle('is-dim', D.index === 0);
      D.next.classList.toggle('is-dim', D.index === n - 1);
      D.sr.textContent = D.row.project.title + '. ' + item.caption;

      var box = D.stage.getBoundingClientRect();
      var aspect = box.width > 0 && box.height > 0 ? box.width / box.height : 16 / 9;
      var key = item.id + '@' + aspect.toFixed(1);
      var known = D.tones[key];
      if (known) { setTone(known); return; }
      measureTone(item.src, item.focus, aspect).then(function (tone) {
        if (!D) return;
        D.tones[key] = tone;
        if (D.row.items[D.index] === item) setTone(tone);
      });
    }

    function setTone(tone) {
      D.chrome.classList.toggle('is-ink', tone === 'ink');
      D.chrome.classList.toggle('is-paper', tone !== 'ink');
    }

    function syncChrome() {
      if (D) D.chrome.classList.toggle('is-on', D.showChrome && !D.leaving);
    }

    function syncBright() {
      D.slides.forEach(function (slide, i) {
        slide.classList.toggle('is-bright', D.bright.indexOf(i) >= 0);
      });
    }

    function nudge(dir) {
      var shift = D.reel.parentElement;
      shift.classList.remove('nudge-next', 'nudge-prev');
      void shift.offsetWidth;
      shift.classList.add(dir === 1 ? 'nudge-next' : 'nudge-prev');
    }

    function go(dir) {
      if (!D || D.leaving) return;
      var next = D.index + dir;
      if (next < 0 || next >= D.row.items.length) { nudge(dir); return; }
      setIndex(next);
    }

    function setIndex(next) {
      var from = D.index;
      D.index = next;
      cursor = { row: D.rowIndex, col: next };
      renderMarks();
      alignShelf(D.rowIndex, next);

      D.navLock = true;
      D.showChrome = false;
      syncChrome();
      D.bright = [from, next];
      syncBright();
      D.reel.style.setProperty('--i', String(next));
      fillItem();

      D.slideTimers.forEach(clearTimeout);
      D.slideTimers = [
        setTimeout(function () { D.bright = [next]; syncBright(); }, TRAVEL),
        setTimeout(function () {
          D.navLock = false;
          if (!D.leaving) { D.showChrome = true; syncChrome(); }
        }, TRAVEL + CHROME_AFTER_SLIDE)
      ];
    }

    function onKey(e) {
      if (!D || D.leaving) return;
      if (e.key === 'Escape') { e.preventDefault(); requestClose(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    }

    function requestClose() {
      if (!D || D.leaving) return;
      D.leaving = true;
      document.body.style.overflow = D.prevOverflow;
      D.showChrome = false;
      D.slideTimers.forEach(clearTimeout);

      host.classList.remove('is-behind');
      host.classList.add('is-settling');
      scrim.classList.remove('on');
      D.root.classList.add('is-exit');
      syncChrome();

      var flew = false;
      if (!D.lite) flew = flyStageTo(D.stage, alignShelf(D.rowIndex, D.index));
      else alignShelf(D.rowIndex, D.index);
      if (!flew && !D.lite) D.stage.style.transition = 'opacity 220ms ease';
      if (!flew && !D.lite) D.stage.style.opacity = '0';

      D.timers.push(setTimeout(finish, D.lite ? EXIT_LITE_MS : EXIT_MS));
    }

    function finish() {
      var card = cards[cursor.row] && cards[cursor.row][cursor.col];
      teardown();
      host.classList.remove('is-settling');
      if (card && keyboard) card.focus({ preventScroll: true });
    }

    /* Leave without the flight: the route changed, or "Project details"
       was pressed. */
    function closeNow() {
      if (!D) return;
      document.body.style.overflow = D.prevOverflow;
      scrim.classList.remove('on');
      host.classList.remove('is-behind', 'is-settling');
      teardown();
    }

    function teardown() {
      if (!D) return;
      cancelAnimationFrame(D.raf);
      D.timers.concat(D.slideTimers).forEach(clearTimeout);
      D.root.remove();
      D = null;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', closeNow);
    }

    renderMarks();

    return {
      host: host,
      destroy: function () {
        if (D) { document.body.style.overflow = D.prevOverflow; teardown(); }
        if (observer) observer.disconnect();
        if (layer) layer.remove();
      }
    };
  }

  /* ── Mounting ─────────────────────────────────────────────────────────
     The Gallery view is torn down and rebuilt on every route change, so the
     check runs on every DOM change (once per frame) and on a short retry
     while the project data is still on its way. */

  var current = null;
  var queued = false;
  var retries = 0;

  function sync() {
    if (current && !current.host.isConnected) { current.destroy(); current = null; }
    var host = document.querySelector('[data-xgal]');
    if (!host || host.__xgal) return;
    var projects = window.XG_PROJECTS;
    if (!projects) {
      if (retries++ < 40) setTimeout(sync, 250);
      return;
    }
    current = createGallery(host, projects);
    host.__xgal = current || true;
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; sync(); });
  }

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  sync();
})();
