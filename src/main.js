import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { projects, index, archive, categories } from './data.js';
import { getLang, setLangValue, L, t } from './i18n.js';
import { initHeroGL } from './gl.js';
import { initCase } from './case.js';
import { initBadge } from './badge.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ------------------------------------------------------------------ */
/* Render content                                                      */
/* ------------------------------------------------------------------ */
const titleHTML = (title) => {
  const [first, ...rest] = title.split(' ');
  return rest.length ? `${first} <span class="serif">${rest.join(' ')}</span>` : title;
};

function renderProjects() {
  $('.projects').innerHTML = projects
    .map(
      (p, i) => `
      <a href="#work/${p.id}" class="project project--${p.size}" data-id="${p.id}" data-cursor="View" aria-label="${p.title}">
        <div class="project__media">
          <span class="project__award mono">${p.badge}</span>
          <span class="project__tagline" aria-hidden="true"><span data-l="projects.${i}.tagline">${L(p.tagline)}</span></span>
          <img src="${p.img}" alt="${p.title}" loading="${i < 2 ? 'eager' : 'lazy'}" />
        </div>
        <div class="project__meta">
          <span class="project__num mono">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="project__title"><span class="reveal-line"><span>${titleHTML(p.title)}</span></span></h3>
          <span class="project__year mono">${p.year}</span>
          <div class="project__sub">
            <p class="project__desc" data-l="projects.${i}.desc">${L(p.desc)}</p>
            <div class="project__tags mono">${p.services.map((s) => `<span>${s}</span>`).join('')}</div>
          </div>
        </div>
      </a>`
    )
    .join('');
}

function renderIndex() {
  $('.index__filters').innerHTML = categories
    .map((c, i) => {
      const n = c.id === 'all' ? index.length : index.filter((r) => r.cat === c.id).length;
      return `<button class="${i === 0 ? 'is-active' : ''}" data-filter="${c.id}">${c.label} <sup>${String(n).padStart(2, '0')}</sup></button>`;
    })
    .join('');
  $('.index__list').innerHTML = index
    .map(
      (r, i) => `
    <li class="index__item" data-cat="${r.cat}">
      <a href="${r.id ? `#work/${r.id}` : '#'}" class="index__row${r.id ? '' : ' is-static'}" data-img="${r.img}"${r.id ? ` data-id="${r.id}"` : ''}>
        <span class="index__client" data-l="index.${i}.client">${L(r.client)}</span>
        <span class="index__name" data-l="index.${i}.name">${L(r.name)}</span>
        <span class="index__services">${r.services}</span>
        <span class="index__year">${r.year}</span>
      </a>
    </li>`
    )
    .join('');
  [...new Set(index.map((r) => r.img))].forEach((src) => (new Image().src = src));
}

function renderArchive() {
  $('.archive__track').innerHTML =
    archive
      .map(
        (a) => `
    <figure class="arc" style="aspect-ratio:${a.ratio}">
      <div class="arc__media"><img src="${a.img}" alt="${a.title}" loading="lazy" /></div>
      <figcaption class="arc__cap mono"><span>${a.title}</span><span>${a.meta}</span></figcaption>
    </figure>`
      )
      .join('') +
    `<div class="arc__end"><p data-i18n="archive.end"></p><a href="#contact" class="btn-round" data-magnetic><span>Collaborate</span></a></div>`;
}

/* ------------------------------------------------------------------ */
/* i18n                                                                */
/* ------------------------------------------------------------------ */
const sources = { projects, index };
const resolve = (path) => {
  const v = path.split('.').reduce((o, k) => (o == null ? o : o[k]), sources);
  return L(v);
};

function applyLang() {
  const lang = getLang();
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach((el) => (el.innerHTML = t(el.dataset.i18n)));
  $$('[data-l]').forEach((el) => (el.innerHTML = resolve(el.dataset.l)));
  $$('[data-lang-toggle]').forEach((b) => b.setAttribute('aria-label', lang === 'en' ? '日本語に切り替え' : 'Switch to English'));
}

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */
function splitChars(el) {
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.innerHTML = [...text].map((c) => `<span class="char" aria-hidden="true">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  return $$('.char', el);
}

// Word-level split that also handles Japanese (no spaces) via Intl.Segmenter.
function segments(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return [...new Intl.Segmenter(getLang(), { granularity: 'word' }).segment(text)].map((s) => s.segment);
  }
  return text.split(/(\s+)/);
}
function splitWords(el) {
  [...el.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      segments(n.textContent).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) frag.append(' ');
        else {
          const s = document.createElement('span');
          s.className = 'word';
          s.textContent = part;
          frag.append(s);
        }
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && !n.classList.contains('pill')) {
      n.classList.add('word');
    }
  });
  return $$('.word, .pill', el);
}

function setupHoverText() {
  $$('[data-hover-text]').forEach((el) => {
    const txt = el.textContent.trim();
    el.innerHTML = `<span class="roll" data-text="${txt}">${txt}</span>`;
  });
}

/* ------------------------------------------------------------------ */
/* Smooth scroll                                                       */
/* ------------------------------------------------------------------ */
let lenis;
function initScroll() {
  lenis = new Lenis({ duration: 1.15, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: !reduced });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();

  const header = $('.header');
  lenis.on('scroll', ({ scroll, direction }) => {
    if (document.body.classList.contains('menu-open')) return;
    header.classList.toggle('is-hidden', direction === 1 && scroll > window.innerHeight * 0.6);
  });

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.startsWith('#work/')) return e.preventDefault();
      const target = id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      closeMenu();
      lenis.start();
      lenis.scrollTo(target, { duration: 1.6, easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2) });
    })
  );
}

/* ------------------------------------------------------------------ */
/* Loader + intro                                                      */
/* ------------------------------------------------------------------ */
function runLoader(gl) {
  const num = $('.loader__num');
  const counter = { v: 0 };
  const heroChars = $$('.hero__title .char');
  const introLines = $$('.hero__intro .reveal-line > span');

  gsap.set('.loader__word > span', { y: 0, yPercent: 110 });
  gsap.set(heroChars, { yPercent: 110 });
  gsap.set(introLines, { yPercent: 110 });
  gsap.set(['.hero__list li', '.hero__cn', '.hero__badge', '.header'], { autoAlpha: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (reduced) tl.timeScale(4);

  tl.to('.loader__word > span', { yPercent: 0, duration: 1.1, stagger: 0.08 }, 0.1)
    .to(counter, {
      v: 100, duration: 2.1, ease: 'power3.inOut',
      onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, '0')),
    }, 0)
    .to('.loader__bar span', { scaleX: 1, duration: 2.1, ease: 'power3.inOut' }, 0)
    .to('.loader__word > span', { yPercent: -110, duration: 0.7, stagger: 0.05, ease: 'power3.in' }, 2.05)
    .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 2.35)
    .add(() => {
      document.body.classList.remove('is-loading');
      lenis.start();
    }, 2.6)
    .to(gl || {}, { intro: 1, duration: 2.2, ease: 'power2.out' }, 2.6)
    .to(heroChars, { yPercent: 0, duration: 1.4, stagger: 0.05 }, 2.75)
    .to(introLines, { yPercent: 0, duration: 1.2, stagger: 0.08 }, 3.0)
    .to(['.header', '.hero__list li', '.hero__cn', '.hero__badge'], { autoAlpha: 1, duration: 1, stagger: 0.08, ease: 'power2.out' }, 3.1)
    .set('.loader', { display: 'none' });
  return tl;
}

/* ------------------------------------------------------------------ */
/* Scroll animations                                                   */
/* ------------------------------------------------------------------ */
function initThemes() {
  $$('[data-theme]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && (document.body.dataset.theme = sec.dataset.theme),
    });
  });
}

function initReveals() {
  $$('.reveal-line > span').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.from(el, {
      yPercent: 115, rotate: 2, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: el.parentElement, start: 'top 90%' },
      delay: Math.max(0, $$('.reveal-line', el.parentElement.parentElement).indexOf(el.parentElement)) * 0.08,
    });
  });

  $$('.label, .work__lede, .manifesto__foot, .about__cols p, .project__sub, .index__head, .archive__progress, .deliver__lede').forEach((el) => {
    gsap.from(el, { autoAlpha: 0, y: 24, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
}

function initHeroScroll(gl) {
  gsap.to('.hero__title', {
    yPercent: 22, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero__grid', {
    yPercent: -40, autoAlpha: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: true },
  });
  if (gl) {
    ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: 'bottom top',
      onUpdate: (s) => (gl.scroll = s.progress),
    });
  }
}

let manifestoTween;
function buildManifesto() {
  const el = $('.manifesto__text');
  if (manifestoTween) {
    manifestoTween.scrollTrigger && manifestoTween.scrollTrigger.kill();
    manifestoTween.kill();
  }
  el.innerHTML = t('manifesto');
  const words = splitWords(el);
  manifestoTween = gsap.fromTo(words, { opacity: 0.12 }, {
    opacity: 1, stagger: 0.05, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 52%', scrub: 0.6 },
  });
  $$('.pill', el).forEach((p) =>
    gsap.from(p, { width: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 75%' } })
  );
}

function initProjects() {
  $$('.project').forEach((card) => {
    const media = $('.project__media', card);
    const img = $('img', media);
    gsap.fromTo(media, { clipPath: 'inset(18% 10% 18% 10% round 4px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 4px)', ease: 'none',
      scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 35%', scrub: 0.8 },
    });
    gsap.fromTo(img, { yPercent: -9, scale: 1.25 }, {
      yPercent: 9, scale: 1, ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function initArchive() {
  const track = $('.archive__track');
  const bar = $('.archive__progress b');
  const cur = $('.archive__cur');
  const figs = $$('.arc', track);
  const dist = () => track.scrollWidth - window.innerWidth;

  const tween = gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: '.archive', pin: '.archive__pin', start: 'top top',
      end: () => '+=' + dist(), scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: (s) => {
        bar.style.transform = `scaleX(${s.progress})`;
        cur.textContent = String(Math.min(figs.length, Math.floor(s.progress * figs.length) + 1)).padStart(2, '0');
      },
    },
  });

  figs.forEach((f) => {
    gsap.fromTo($('img', f), { scale: 1.3, xPercent: -6 }, {
      scale: 1, xPercent: 6, ease: 'none',
      scrollTrigger: { trigger: f, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
    });
  });
}

// Exploded four-layer stack: layers separate as you scroll, the active one lifts.
function initDeliver() {
  const layers = $$('.layer');
  const items = $$('.deliver__list li');
  const GAP = () => (window.innerWidth > 820 ? 105 : 62);
  let active = -1;
  const setActive = (i) => {
    if (i === active) return;
    active = i;
    layers.forEach((l) => l.classList.toggle('is-active', +l.dataset.step === i));
    items.forEach((it) => it.classList.toggle('is-active', +it.dataset.step === i));
  };
  gsap.set(layers, { '--z': (i) => (3 - i) * 10 });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 821px)', () => {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.deliver', pin: '.deliver__pin', start: 'top top', end: '+=170%', scrub: 0.8, anticipatePin: 1,
        onUpdate: (s) => setActive(Math.min(3, Math.floor(s.progress * 4.4 - 0.2))),
        onLeaveBack: () => setActive(-1),
      },
    })
      .to(layers, { '--z': (i) => (3 - i) * GAP(), ease: 'power2.inOut', duration: 0.35 })
      .to('.stack', { rotateZ: -34, ease: 'none', duration: 0.65 }, 0);
  });
  mm.add('(max-width: 820px)', () => {
    gsap.to(layers, {
      '--z': (i) => (3 - i) * GAP(), ease: 'none',
      scrollTrigger: { trigger: '.deliver__stage', start: 'top 85%', end: 'center 45%', scrub: 0.8 },
    });
    items.forEach((it) =>
      ScrollTrigger.create({ trigger: it, start: 'top 65%', end: 'bottom 65%', onToggle: (s) => s.isActive && setActive(+it.dataset.step) })
    );
  });

  gsap.fromTo(items, { autoAlpha: 0, y: 30 }, {
    autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: '.deliver', start: 'top 40%' },
  });
}

function initRevision() {
  gsap.from('.rev-row:not(.rev-row--head)', {
    autoAlpha: 0, x: -30, duration: 1, stagger: 0.07, ease: 'expo.out',
    scrollTrigger: { trigger: '.rev-table', start: 'top 80%' },
  });
  gsap.fromTo('.seal', { scale: 2.8, rotate: -32, autoAlpha: 0 }, {
    scale: 1, rotate: -8, autoAlpha: 1, duration: 0.55, ease: 'back.out(2.4)',
    scrollTrigger: { trigger: '.rev-row--current', start: 'top 78%' },
    onComplete: () => gsap.fromTo('.rev-row--current', { x: 0 }, { x: 3, duration: 0.05, repeat: 3, yoyo: true, clearProps: 'x' }),
  });
}

function initEngage() {
  gsap.from('.engage__list li', {
    autoAlpha: 0, y: 50, duration: 1.2, stagger: 0.1, ease: 'expo.out',
    scrollTrigger: { trigger: '.engage__list', start: 'top 82%' },
  });
}

function initAbout() {
  gsap.fromTo('.about__img', { clipPath: 'inset(100% 0 0 0)' }, {
    clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut',
    scrollTrigger: { trigger: '.about__portrait', start: 'top 80%' },
  });
  gsap.fromTo('.about__img img', { yPercent: -8 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.about__grid', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  $$('[data-count]').forEach((el) => {
    const o = { v: 0 };
    gsap.to(o, {
      v: +el.dataset.count, duration: 2.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => (el.textContent = String(Math.round(o.v))),
    });
  });

  gsap.from('.services__list li', {
    autoAlpha: 0, y: 40, duration: 1.2, stagger: 0.1, ease: 'expo.out',
    scrollTrigger: { trigger: '.services__list', start: 'top 80%' },
  });
}

function initMarquee() {
  const row = $('.marquee__row');
  const inner = $('.marquee__inner', row);
  for (let i = 0; i < 3; i++) row.append(inner.cloneNode(true));
  let x = 0, dir = -1, speed = 1;
  lenis.on('scroll', (e) => {
    if (e.direction) dir = -e.direction;
    speed = 1 + Math.min(Math.abs(e.velocity) * 0.25, 10);
  });
  gsap.ticker.add(() => {
    speed += (1 - speed) * 0.05;
    x += dir * speed * 0.9;
    const W = inner.offsetWidth;
    if (x <= -W) x += W;
    if (x > 0) x -= W;
    row.style.transform = `translate3d(${x}px,0,0)`;
  });
}

function initContact() {
  gsap.from($$('.footer__giant .char'), {
    yPercent: 100, duration: 1.4, stagger: 0.05, ease: 'expo.out',
    scrollTrigger: { trigger: '.footer__giant', start: 'top 98%' },
  });
}

function initVelocity() {
  if (reduced) return;
  const skew = gsap.quickTo($$('.project__media, .arc__media'), 'skewY', { duration: 0.6, ease: 'power3' });
  lenis.on('scroll', ({ velocity }) => skew(gsap.utils.clamp(-3, 3, velocity * 0.12)));
}

/* ------------------------------------------------------------------ */
/* Interaction                                                         */
/* ------------------------------------------------------------------ */
function initCursor() {
  if (!finePointer) return;
  const cursor = $('.cursor');
  const dot = $('.cursor__dot');
  const ring = $('.cursor__ring');
  const label = $('.cursor__label');
  const media = $('.hover-media');
  const mediaInner = $('.hover-media__inner');

  const dx = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
  const mx = gsap.quickTo(media, 'x', { duration: 0.8, ease: 'power3' });
  const my = gsap.quickTo(media, 'y', { duration: 0.8, ease: 'power3' });
  const mr = gsap.quickTo(media, 'rotate', { duration: 0.8, ease: 'power3' });
  let lastX = 0;

  window.addEventListener('pointermove', () => dot.classList.add('is-ready'), { once: true });
  window.addEventListener('pointermove', (e) => {
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    mx(e.clientX); my(e.clientY);
    mr(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
    lastX = e.clientX;
  });

  document.addEventListener('pointerover', (e) => {
    const v = e.target.closest('[data-cursor]');
    const l = e.target.closest('a:not(.is-static), button');
    cursor.classList.toggle('is-view', !!v);
    dot.classList.toggle('is-view', !!v);
    dot.classList.toggle('is-link', !v && !!l);
    if (v) label.textContent = v.dataset.cursor;
  });

  let current = null;
  $$('.index__row').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      media.classList.add('is-on');
      if (current === row.dataset.img) return;
      current = row.dataset.img;
      const img = document.createElement('img');
      img.src = current;
      img.alt = '';
      mediaInner.append(img);
      gsap.fromTo(img, { clipPath: 'inset(100% 0 0 0)', scale: 1.3 }, {
        clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 0.8, ease: 'expo.out',
        onComplete: () => { while (mediaInner.children.length > 1) mediaInner.firstChild.remove(); },
      });
    });
  });
  $('.index__list').addEventListener('pointerleave', () => media.classList.remove('is-on'));
}

function initMagnetic() {
  if (!finePointer) return;
  $$('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.35);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

function initFilters() {
  const btns = $$('.index__filters button');
  btns.forEach((b) =>
    b.addEventListener('click', () => {
      btns.forEach((x) => x.classList.toggle('is-active', x === b));
      const f = b.dataset.filter;
      const items = $$('.index__item');
      gsap.to(items, {
        autoAlpha: 0, y: -10, duration: 0.25, stagger: 0.015, ease: 'power2.in',
        onComplete: () => {
          items.forEach((it) => it.classList.toggle('is-hidden', f !== 'all' && it.dataset.cat !== f));
          const vis = items.filter((it) => !it.classList.contains('is-hidden'));
          gsap.fromTo(vis, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.04, ease: 'expo.out' });
          ScrollTrigger.refresh();
        },
      });
    })
  );
}

function initClock() {
  const els = $$('[data-clock]');
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const tick = () => { const s = fmt.format(new Date()); els.forEach((e) => (e.textContent = s)); };
  tick();
  setInterval(tick, 1000);
}

let toastTimer;
function toast(msg) {
  const el = $('.toast');
  el.textContent = msg;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 2200);
}

function initCopy() {
  $$('[data-copy]').forEach((a) =>
    a.addEventListener('click', async (e) => {
      if (!navigator.clipboard) return; // fall back to mailto
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(a.dataset.copy);
        toast(`${t('copied')} — ${a.dataset.copy}`);
      } catch (err) {
        location.href = a.href;
      }
    })
  );
}

const menuBtn = () => $('.menu-btn');
function closeMenu() {
  document.body.classList.remove('menu-open');
  $('.menu').classList.remove('is-open');
  menuBtn().setAttribute('aria-expanded', 'false');
  $('.menu').setAttribute('aria-hidden', 'true');
  lenis && !document.body.classList.contains('is-loading') && lenis.start();
}
function initMenu() {
  menuBtn().addEventListener('click', () => {
    const open = !$('.menu').classList.contains('is-open');
    if (!open) return closeMenu();
    document.body.classList.add('menu-open');
    lenis.stop();
    $('.menu').classList.add('is-open');
    menuBtn().setAttribute('aria-expanded', 'true');
    $('.menu').setAttribute('aria-hidden', 'false');
    gsap.from('.menu__nav a', { yPercent: 60, autoAlpha: 0, duration: 1, stagger: 0.06, ease: 'expo.out', delay: 0.25 });
  });
}

let caseApi;
let switching = false;
function switchLang() {
  if (switching) return;
  switching = true;
  const next = getLang() === 'en' ? 'ja' : 'en';
  const curtain = $('.lang-curtain');
  const label = $('.lang-curtain__label');
  label.textContent = next === 'ja' ? '日本語' : 'English';
  gsap.timeline({ onComplete: () => (switching = false) })
    .set(curtain, { display: 'grid' })
    .fromTo(curtain, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'expo.inOut' })
    .fromTo(label, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, 0.35)
    .add(() => {
      setLangValue(next);
      applyLang();
      buildManifesto();
      caseApi && caseApi.refresh();
      ScrollTrigger.refresh();
    })
    .to(label, { yPercent: -110, duration: 0.45, ease: 'expo.in' }, '+=0.2')
    .to(curtain, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut' })
    .set(curtain, { display: 'none' });
}

function initTabTitle() {
  const title = document.title;
  document.addEventListener('visibilitychange', () => (document.title = document.hidden ? '✦ Come back soon — ka1o' : title));
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */
renderProjects();
renderIndex();
renderArchive();
applyLang();
$$('[data-split]').forEach(splitChars);
setupHoverText();

const gl = initHeroGL($('.hero__gl'));
initScroll();
initClock();
initMenu();
initCursor();
initMagnetic();
initFilters();
initCopy();
$$('[data-lang-toggle]').forEach((b) => b.addEventListener('click', switchLang));

document.fonts.ready.then(() => {
  const loader = runLoader(gl);
  // Pinned sections first so later triggers account for their spacers.
  initArchive();
  initDeliver();
  initHeroScroll(gl);
  initThemes();
  initReveals();
  buildManifesto();
  initProjects();
  initAbout();
  initRevision();
  initEngage();
  initMarquee();
  initContact();
  initVelocity();
  initTabTitle();
  ScrollTrigger.refresh();
  caseApi = initCase({ lenis });
  const badge = initBadge();
  if (badge) {
    ScrollTrigger.create({ trigger: '.about', start: 'top 70%', once: true, onEnter: () => badge.dropIn() });
    ScrollTrigger.addEventListener('refresh', () => badge.layout());
  }
  loader.eventCallback('onComplete', () => caseApi.deepLink());
});

window.addEventListener('load', () => ScrollTrigger.refresh());
