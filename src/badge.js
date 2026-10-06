import { createBadgeRenderer } from './badge-renderer.js';

/**
 * A weighted ID badge on a woven strap, hanging in the About section.
 * Ported from the proposal site; the strap bends but never stretches.
 * Coordinates are local to .badge-wrap (which may be CSS-scaled).
 */
export function initBadge() {
  const wrap = document.querySelector('.badge-wrap');
  const card = document.querySelector('.badge-card');
  if (!wrap || !card) return null;

  const render = createBadgeRenderer(wrap, card);
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = motionPreference.matches;
  const LENGTH = 185;
  const ANCHOR_Y = -80;
  const GRAVITY = 1100;
  const DAMPING = 1.35;
  const DT = 1 / 120;
  const POINT_COUNT = 19;
  const points = Array.from({ length: POINT_COUNT }, () => ({ x: 0, y: 0 }));
  const rotation = { z: 0, y: 0, x: 0 };
  const hook = { x: 0, y: ANCHOR_Y + LENGTH, vx: 0, vy: 0 };
  let anchorX = 0;
  let minX = -Infinity, maxX = Infinity;
  let enabled = window.innerWidth > 900;
  let active = false;
  let entrance = 0;
  let bendSide = 1;
  let dragging = false;
  let pointerId = null;
  let grabX = 0, grabY = 0;
  let lastPointerTime = 0;
  let rafId = null;
  let lastTime = null;
  let accumulator = 0;
  let inView = false;
  let visible = false;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function rest() {
    hook.x = anchorX;
    hook.y = ANCHOR_Y + LENGTH;
    hook.vx = hook.vy = 0;
    rotation.x = rotation.y = rotation.z = 0;
  }
  function resetClock() { lastTime = null; accumulator = 0; }
  function pause() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    resetClock();
  }

  // Keep the hook within the strap length and on screen. Projection removes
  // outward speed instead of bouncing it back.
  function constrain() {
    const reach = Math.sqrt(LENGTH * LENGTH - 90 * 90);
    const nextX = clamp(hook.x, Math.max(minX, anchorX - reach), Math.min(maxX, anchorX + reach));
    if (nextX !== hook.x) hook.vx = 0;
    hook.x = nextX;
    if (hook.y < ANCHOR_Y + 90) {
      hook.y = ANCHOR_Y + 90;
      hook.vy = Math.max(0, hook.vy);
    }
    const dx = hook.x - anchorX;
    const dy = hook.y - ANCHOR_Y;
    const distance = Math.hypot(dx, dy);
    if (distance > LENGTH) {
      const nx = dx / distance, ny = dy / distance;
      hook.x = anchorX + nx * LENGTH;
      hook.y = ANCHOR_Y + ny * LENGTH;
      const outward = hook.vx * nx + hook.vy * ny;
      if (outward > 0) {
        hook.vx -= outward * nx;
        hook.vy -= outward * ny;
      }
    }
  }

  // A single smooth bow uses the slack in the strap; solving its sampled arc
  // length avoids the kinks and vibration of a loose node chain.
  function shape() {
    const dx = hook.x - anchorX, dy = hook.y - ANCHOR_Y;
    const distance = Math.hypot(dx, dy) || 1;
    if (distance >= LENGTH - 0.05 && Math.abs(dx) > 12) bendSide = dx > 0 ? 1 : -1;
    const nx = (-dy / distance) * bendSide;
    const ny = (dx / distance) * bendSide;
    const curveLength = (bend) => {
      let length = 0, px = anchorX, py = ANCHOR_Y;
      for (let i = 1; i < POINT_COUNT; i++) {
        const t = i / (POINT_COUNT - 1);
        const bow = 4 * bend * t * (1 - t);
        const x = anchorX + dx * t + nx * bow;
        const y = ANCHOR_Y + dy * t + ny * bow;
        length += Math.hypot(x - px, y - py);
        px = x;
        py = y;
      }
      return length;
    };
    let bend = 0;
    if (distance < LENGTH - 0.05) {
      let low = 0, high = LENGTH * 0.65;
      for (let i = 0; i < 12; i++) {
        const mid = (low + high) / 2;
        if (curveLength(mid) < LENGTH) low = mid;
        else high = mid;
      }
      bend = (low + high) / 2;
    }
    for (let i = 0; i < POINT_COUNT; i++) {
      const t = i / (POINT_COUNT - 1);
      const bow = 4 * bend * t * (1 - t);
      points[i].x = anchorX + dx * t + nx * bow;
      points[i].y = ANCHOR_Y + dy * t + ny * bow;
    }
  }

  function pose(dt) {
    const end = points[POINT_COUNT - 1];
    const before = points[POINT_COUNT - 2];
    const tension = Math.pow(Math.hypot(hook.x - anchorX, hook.y - ANCHOR_Y) / LENGTH, 3);
    const targetZ = clamp((-Math.atan2(end.x - before.x, Math.max(5, end.y - before.y)) * 180) / Math.PI, -55, 55) * tension;
    const follow = 1 - Math.exp(-13 * dt);
    rotation.z += (targetZ - rotation.z) * follow;
    rotation.y += (clamp(hook.vx * 0.045, -14, 14) - rotation.y) * follow;
    rotation.x += (clamp(-hook.vy * 0.02, -6, 6) - rotation.x) * follow;
  }

  function draw() {
    shape();
    render({ points, rotation });
  }

  function refreshVisibility() {
    const fade = reduced ? 1 : entrance * entrance * (3 - 2 * entrance);
    wrap.style.opacity = (active ? fade : 0).toFixed(3);
    visible = active && enabled && inView && !document.hidden;
    wrap.style.visibility = active && enabled ? 'visible' : 'hidden';
    return visible;
  }

  function settled() {
    return Math.abs(hook.x - anchorX) < 0.08
      && Math.abs(hook.y - ANCHOR_Y - LENGTH) < 0.08
      && Math.hypot(hook.vx, hook.vy) < 0.15
      && Math.abs(rotation.z) + Math.abs(rotation.x) + Math.abs(rotation.y) < 0.12;
  }

  function step(dt) {
    entrance = Math.min(1, entrance + dt / 0.22);
    if (dragging) {
      // Pointer events own the position; let old movement fade so holding
      // the card still does not store an artificial throw.
      const damping = Math.exp(-12 * dt);
      hook.vx *= damping;
      hook.vy *= damping;
    } else {
      const damping = Math.exp(-DAMPING * dt);
      hook.vx *= damping;
      hook.vy = hook.vy * damping + GRAVITY * dt;
      hook.x += hook.vx * dt;
      hook.y += hook.vy * dt;
      constrain();
    }
    shape();
    pose(dt);
  }

  function tick(time) {
    rafId = null;
    if (!refreshVisibility() || reduced) {
      resetClock();
      return;
    }
    if (lastTime === null) lastTime = time;
    accumulator += clamp((time - lastTime) / 1000, 0, 0.05);
    lastTime = time;
    let steps = 0;
    while (accumulator >= DT && steps < 6) {
      step(DT);
      accumulator -= DT;
      steps++;
    }
    if (steps === 6) accumulator = 0;
    if (!dragging && entrance === 1 && settled()) {
      rest();
      draw();
      resetClock();
      return;
    }
    draw();
    rafId = requestAnimationFrame(tick);
  }

  function wake() {
    if (!refreshVisibility()) {
      pause();
      return;
    }
    draw();
    if (!reduced && rafId === null && (dragging || entrance < 1 || !settled())) {
      resetClock();
      rafId = requestAnimationFrame(tick);
    }
  }

  const scale = () => {
    const rect = wrap.getBoundingClientRect();
    return { rect, sx: (wrap.clientWidth || rect.width) / (rect.width || 1), sy: (wrap.clientHeight || rect.height) / (rect.height || 1) };
  };
  function localPointer(e) {
    const { rect, sx, sy } = scale();
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  }

  function finishDrag(keepVelocity = false) {
    if (!dragging) return;
    const captured = pointerId;
    dragging = false;
    pointerId = null;
    card.classList.remove('grabbed');
    document.body.classList.remove('badge-dragging');
    if (!keepVelocity || performance.now() - lastPointerTime > 100) hook.vx = hook.vy = 0;
    if (captured !== null && card.hasPointerCapture(captured)) card.releasePointerCapture(captured);
    if (reduced) rest();
  }

  card.addEventListener('pointerdown', (e) => {
    if (!active || !visible || dragging || e.isPrimary === false || e.button !== 0) return;
    const local = localPointer(e);
    grabX = local.x - hook.x;
    grabY = local.y - hook.y;
    hook.vx = hook.vy = 0;
    lastPointerTime = performance.now();
    pointerId = e.pointerId;
    dragging = true;
    card.setPointerCapture(pointerId);
    card.classList.add('grabbed');
    document.body.classList.add('badge-dragging');
    e.preventDefault();
    wake();
  });

  card.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const local = localPointer(e);
    const oldX = hook.x, oldY = hook.y;
    const now = performance.now();
    const elapsed = clamp((now - lastPointerTime) / 1000, 1 / 120, 0.08);
    hook.x = local.x - grabX;
    hook.y = local.y - grabY;
    constrain();
    hook.vx = clamp((hook.x - oldX) / elapsed, -550, 550) * 0.65 + hook.vx * 0.35;
    hook.vy = clamp((hook.y - oldY) / elapsed, -550, 550) * 0.65 + hook.vy * 0.35;
    constrain();
    lastPointerTime = now;
    if (reduced) rotation.x = rotation.y = rotation.z = 0;
    wake();
  });

  card.addEventListener('pointerup', (e) => {
    if (e.pointerId !== pointerId) return;
    finishDrag(true);
    wake();
  });
  for (const type of ['pointercancel', 'lostpointercapture']) {
    card.addEventListener(type, (e) => {
      if (e.pointerId !== pointerId) return;
      finishDrag();
      wake();
    });
  }

  function layout() {
    const wasEnabled = enabled;
    const previousAnchor = anchorX;
    enabled = window.innerWidth > 900;
    const w = wrap.clientWidth;
    anchorX = w * 0.55;
    // Keep the card inside the viewport horizontally while dragging.
    const { rect, sx } = scale();
    minX = (0 - rect.left) * sx + 110;
    maxX = (window.innerWidth - rect.left) * sx - 110;
    hook.x += anchorX - previousAnchor;
    finishDrag();
    if (enabled !== wasEnabled || !active || reduced) rest();
    else constrain();
    resetClock();
    wake();
  }
  window.addEventListener('resize', layout);
  window.addEventListener('blur', () => { finishDrag(); wake(); });
  document.addEventListener('visibilitychange', () => { finishDrag(); resetClock(); wake(); });
  motionPreference.addEventListener('change', (e) => {
    reduced = e.matches;
    finishDrag();
    if (reduced) { entrance = 1; rest(); pause(); }
    wake();
  });

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (!inView) finishDrag();
    wake();
  }, { rootMargin: '200px 0px' }).observe(wrap.parentElement);

  // Dropped in rather than faded in: the strap starts slack just under the
  // anchor, so gravity does the fall and the strap snapping taut does the swing.
  function dropIn() {
    if (active) return;
    active = true;
    layout();
    rest();
    entrance = reduced || !enabled ? 1 : 0;
    if (!reduced && enabled) {
      hook.x = anchorX + 50;
      hook.y = ANCHOR_Y + 92;
      hook.vx = -290;
      hook.vy = 70;
      rotation.z = -22;
      rotation.y = 26;
      rotation.x = -8;
    }
    wake();
  }

  layout();
  return { dropIn, layout };
}
