(function () {
  'use strict';
  const guide = document.getElementById('ai-guide');
  if (!guide) return;
  const pet = document.getElementById('ai-guide-pet');
  const artwork = guide.querySelector('.pet-artwork');
  const bubble = document.getElementById('ai-guide-bubble');
  const form = document.getElementById('ai-guide-form');
  const question = document.getElementById('ai-guide-question');
  const submit = document.getElementById('ai-guide-submit');
  const status = document.getElementById('ai-guide-status');
  const result = document.getElementById('ai-guide-result');
  const answer = document.getElementById('ai-guide-answer');
  const sources = document.getElementById('ai-guide-sources');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  question.placeholder = 'Ask about Xiaojun…';
  const POSITION_KEY = 'xg-ai-pet-position';
  let pending = null, pendingStarted = 0, drag = null, skipClick = false;
  let transient = { name: 'waving', until: performance.now() + 1500 };
  let frameId = null, currentState = '', currentArtwork = '', position = null;

  // Play the user's original transparent WebP animations without re-encoding.
  const animations = {
    idle: 'idle.webp', right: 'running-right.webp', left: 'running-left.webp',
    waving: 'waving.webp', failed: 'failed.webp', thinking: 'running.webp', review: 'review.webp',
  };
  const assetBase = guide.dataset.petAssets;
  const failedArtwork = new Set();
  artwork.addEventListener('load', () => {
    if (artwork.naturalWidth !== 192 || artwork.naturalHeight !== 208) return;
    artwork.hidden = false;
    guide.querySelector('.pet-fallback').hidden = true;
    guide.dataset.petReady = 'true';
  });
  artwork.addEventListener('error', () => {
    failedArtwork.add(currentArtwork);
    if (currentArtwork !== 'portrait.png') {
      currentArtwork = 'portrait.png';
      artwork.src = assetBase + currentArtwork;
    } else {
      artwork.hidden = true;
      guide.querySelector('.pet-fallback').hidden = false;
      delete guide.dataset.petReady;
    }
  });
  for (const file of [...Object.values(animations), 'portrait.png']) {
    const preload = new Image();
    preload.addEventListener('error', () => failedArtwork.add(file));
    preload.src = assetBase + file;
  }
  function animate(now) {
    let state = transient && now < transient.until ? transient.name : 'idle';
    let x = 0;
    if (pending && !drag && !reducedMotion.matches) {
      const phase = (now - pendingStarted) % 4200;
      const travel = Math.min(guide.getBoundingClientRect().width - 100, 210);
      if (phase < 1000) { state = 'right'; x = travel * phase / 1000; }
      else if (phase < 2400) { state = 'thinking'; x = travel; }
      else if (phase < 3400) { state = 'left'; x = travel * (1 - (phase - 2400) / 1000); }
      else state = 'thinking';
    } else if (pending) state = 'thinking';
    if (drag) state = 'idle';
    if (currentState !== state) { currentState = state; guide.dataset.petState = state; }
    pet.style.transform = `translateX(${x}px)`;
    const desiredArtwork = reducedMotion.matches || failedArtwork.has(animations[state]) ? 'portrait.png' : animations[state];
    if (currentArtwork !== desiredArtwork) {
      currentArtwork = desiredArtwork;
      artwork.src = assetBase + currentArtwork;
    }
    frameId = requestAnimationFrame(animate);
  }
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frameId);
    if (!document.hidden) frameId = requestAnimationFrame(animate);
  });
  function placeBubble() {
    const rect = guide.getBoundingClientRect();
    const above = rect.top - 18, below = innerHeight - rect.bottom - 18;
    const openBelow = below > above;
    guide.toggleAttribute('data-bubble-below', openBelow);
    guide.style.setProperty('--pet-bubble-max-height', `${Math.max(100, Math.min(310, openBelow ? below : above))}px`);
  }
  function moveTo(x, y, save = false) {
    const rect = guide.getBoundingClientRect();
    const maxX = Math.max(12, innerWidth - rect.width - 12), maxY = Math.max(12, innerHeight - rect.height - 12);
    x = Math.min(maxX, Math.max(12, x)); y = Math.min(maxY, Math.max(12, y));
    Object.assign(guide.style, { left: `${x}px`, top: `${y}px`, right: 'auto', bottom: 'auto' });
    position = { x: (x - 12) / Math.max(1, maxX - 12), y: (y - 12) / Math.max(1, maxY - 12) };
    if (save) { try { localStorage.setItem(POSITION_KEY, JSON.stringify(position)); } catch { /* Storage can be disabled. */ } }
    placeBubble();
  }
  function restorePosition() {
    if (!position) return placeBubble();
    const rect = guide.getBoundingClientRect();
    moveTo(12 + position.x * Math.max(0, innerWidth - rect.width - 24), 12 + position.y * Math.max(0, innerHeight - rect.height - 24));
  }
  try {
    const saved = JSON.parse(localStorage.getItem(POSITION_KEY));
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y) && saved.x >= 0 && saved.x <= 1 && saved.y >= 0 && saved.y <= 1) position = saved;
  } catch { /* Use the lower-right default. */ }
  guide.hidden = false;
  restorePosition();
  addEventListener('resize', restorePosition);
  pet.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const rect = guide.getBoundingClientRect();
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false };
    skipClick = false;
    pet.setPointerCapture(event.pointerId);
    guide.setAttribute('data-dragging', '');
  });
  pet.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 4) drag.moved = true;
    if (drag.moved) moveTo(drag.left + dx, drag.top + dy);
  });
  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    skipClick = drag.moved;
    if (drag.moved) { const rect = guide.getBoundingClientRect(); moveTo(rect.left, rect.top, true); }
    drag = null;
    guide.removeAttribute('data-dragging');
  }
  pet.addEventListener('pointerup', endDrag);
  pet.addEventListener('pointercancel', endDrag);
  pet.addEventListener('lostpointercapture', endDrag);
  pet.addEventListener('click', () => {
    if (skipClick) { skipClick = false; return; }
    transient = { name: 'waving', until: performance.now() + 1000 };
    question.focus();
  });
  pet.addEventListener('keydown', event => {
    const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!direction) return;
    event.preventDefault();
    const rect = guide.getBoundingClientRect(), step = event.shiftKey ? 30 : 10;
    moveTo(rect.left + direction[0] * step, rect.top + direction[1] * step, true);
  });
  document.getElementById('ai-guide-close').addEventListener('click', () => {
    if (pending) pending.abort();
    bubble.hidden = true;
    question.focus();
  });
  guide.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !bubble.hidden) { event.preventDefault(); document.getElementById('ai-guide-close').click(); }
  });
  function renderSources(items) {
    const list = sources.querySelector('ul');
    list.replaceChildren();
    for (const item of Array.isArray(items) ? items : []) {
      if (typeof item?.label !== 'string') continue;
      const li = document.createElement('li');
      let safeUrl;
      try {
        const url = new URL(item.url);
        if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) safeUrl = url.href;
      } catch { /* Non-URL document keys remain plain text. */ }
      if (safeUrl) {
        const link = document.createElement('a');
        Object.assign(link, { href: safeUrl, target: '_blank', rel: 'noopener noreferrer', textContent: item.label });
        li.append(link);
      } else li.textContent = item.label;
      list.append(li);
    }
    sources.hidden = !list.childElementCount;
    sources.open = false;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !question.value.trim()) return;
    bubble.hidden = false; result.hidden = true; status.hidden = false; status.classList.remove('pet-sr-only');
    placeBubble();
    if (location.hostname.endsWith('.github.io')) {
      status.replaceChildren(document.createTextNode('Ask Zion on '));
      const link = document.createElement('a');
      link.href = 'https://xiaojunge.com/'; link.textContent = 'xiaojunge.com'; status.append(link);
      return;
    }
    const controller = new AbortController();
    pending = controller; pendingStarted = performance.now();
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 60_000);
    submit.disabled = true; question.readOnly = true; form.setAttribute('aria-busy', 'true');
    status.textContent = 'Let me look through his work…';
    try {
      const response = await fetch('/api/ask', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.value.trim() }), signal: controller.signal,
      });
      if (!response.headers.get('Content-Type')?.includes('application/json')) throw new Error('I’m not connected yet. Try again later.');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Please try again later.');
      if (typeof data.answer !== 'string' || !data.answer.trim()) throw new Error('No answer returned. Try another question.');
      answer.textContent = data.answer; renderSources(data.sources); result.hidden = false;
      status.textContent = 'Answer ready.'; status.classList.add('pet-sr-only');
      transient = { name: 'review', until: performance.now() + 1700 };
    } catch (error) {
      status.textContent = controller.signal.aborted
        ? (timedOut ? 'Taking a little too long. Please try again.' : 'Cancelled. Ask me anytime.')
        : (error.message || 'Could not connect. Please try again.');
      transient = { name: controller.signal.aborted ? 'idle' : 'failed', until: performance.now() + 1700 };
    } finally {
      clearTimeout(timeout); pending = null; submit.disabled = false; question.readOnly = false;
      form.removeAttribute('aria-busy'); placeBubble();
    }
  });
  frameId = requestAnimationFrame(animate);
})();
