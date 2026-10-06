import gsap from 'gsap';
import { projects } from './data.js';
import { L, t } from './i18n.js';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const titleHTML = (t) => {
  const [first, ...rest] = t.split(' ');
  return rest.length ? `${first} <span class="serif">${rest.join(' ')}</span>` : t;
};

export function initCase({ lenis, onClose }) {
  const el = $('.case');
  const scroller = $('.case__scroll', el);
  const media = $('.case__media', el);
  const heroImg = $('img', media);
  const inner = $('.case__inner', el);
  const crumb = $('.case__crumb-name', el);
  const bar = $('.case__bar', el);
  let current = null;
  let busy = false;

  const render = (p) => {
    const i = projects.indexOf(p);
    const next = projects[(i + 1) % projects.length];
    heroImg.src = p.img;
    heroImg.alt = p.title;
    crumb.textContent = p.title;
    inner.innerHTML = `
      <div class="case__head">
        <span class="case__num mono">( ${String(i + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')} ) — ${L(p.client)}</span>
        <h2 class="case__title" id="case-title"><span class="reveal-line"><span>${titleHTML(p.title)}</span></span></h2>
        <p class="case__tagline">${L(p.tagline)}</p>
      </div>
      <dl class="case__meta mono">
        <div><dt>Client</dt><dd>${L(p.client)}</dd></div>
        <div><dt>Timeline</dt><dd>${p.year}</dd></div>
        <div><dt>Stack</dt><dd>${p.stack}</dd></div>
        <div><dt>Role</dt><dd>${L(p.role)}</dd></div>
      </dl>
      ${p.url ? `<a class="case__visit mono" href="${p.url}" target="_blank" rel="noopener">${t('case.visit')} <span>↗</span></a>` : ''}
      <section class="case__text"><h3 class="mono">${t('case.challenge')}</h3><p>${L(p.challenge)}</p></section>
      <section class="case__text"><h3 class="mono">${t('case.approach')}</h3><p class="small">${L(p.approach)}</p></section>
      <div class="case__gallery">${p.gallery.map((g) => `<figure><img src="${g}" alt="" loading="lazy" /></figure>`).join('')}</div>
      <a href="#work/${next.id}" class="case__next" data-next="${next.id}" data-cursor="Next">
        <div class="case__next-img"><img src="${next.img}" alt="" loading="lazy" /></div>
        <div class="case__next-label mono"><span>${t('case.next')}</span><span>${next.year}</span></div>
        <div class="case__next-title">${titleHTML(next.title)}</div>
      </a>`;
    $('.case__next', inner).addEventListener('click', (e) => {
      e.preventDefault();
      goNext(next);
    });
  };

  const animateIn = () => {
    gsap.fromTo($('.case__title .reveal-line > span', inner), { yPercent: 110 }, { yPercent: 0, duration: 1.4, ease: 'expo.out' });
    gsap.fromTo([$('.case__num', inner), $('.case__tagline', inner), $('.case__meta', inner), $('.case__bar', el)], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out', delay: 0.15 });
  };

  // parallax on hero + reveal gallery inside the overlay scroller
  scroller.addEventListener('scroll', () => {
    const y = scroller.scrollTop;
    heroImg.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${1 + y * 0.0002})`;
    const heroH = $('.case__hero', el).offsetHeight;
    const nextEl = $('.case__next', inner);
    const overNext = nextEl && nextEl.getBoundingClientRect().top < 40;
    bar.classList.toggle('is-dark', y > heroH - 40 && !overNext);
  }, { passive: true });

  const open = (id, fromEl) => {
    const p = projects.find((x) => x.id === id);
    if (!p || busy) return;
    busy = true;
    current = p;
    render(p);
    scroller.scrollTop = 0;
    heroImg.style.transform = '';
    bar.classList.remove('is-dark');
    lenis.stop();
    history.pushState({ case: id }, '', `#work/${id}`);

    const srcImg = fromEl && $('img', fromEl);
    const hero = $('.case__hero', el);
    if (srcImg) {
      const r = srcImg.closest('.project__media').getBoundingClientRect();
      const flip = document.createElement('div');
      flip.className = 'flip';
      flip.innerHTML = `<img src="${p.img}" alt="" />`;
      Object.assign(flip.style, { top: r.top + 'px', left: r.left + 'px', width: r.width + 'px', height: r.height + 'px' });
      document.body.append(flip);
      const target = hero.getBoundingClientRect();
      gsap.timeline({
        onComplete: () => {
          el.classList.add('is-open');
          el.setAttribute('aria-hidden', 'false');
          gsap.set(el, { clipPath: 'none' });
          flip.remove();
          busy = false;
          $('.case__close', el).focus({ preventScroll: true });
        },
      })
        .to(flip, { top: 0, left: 0, width: window.innerWidth, height: target.height || window.innerHeight * 0.92, borderRadius: 0, duration: 1.2, ease: 'expo.inOut' })
        .add(() => {
          gsap.set(el, { clipPath: 'inset(0 0 0 0)' });
          el.classList.add('is-open');
          animateIn();
        }, 1.05);
    } else {
      gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'expo.inOut', onStart: () => { el.classList.add('is-open'); animateIn(); }, onComplete: () => { busy = false; } });
      el.setAttribute('aria-hidden', 'false');
    }
  };

  const goNext = (next) => {
    if (busy) return;
    busy = true;
    const cover = document.createElement('div');
    cover.className = 'flip';
    cover.innerHTML = `<img src="${next.img}" alt="" />`;
    const r = $('.case__next', inner).getBoundingClientRect();
    Object.assign(cover.style, { top: Math.max(r.top, 0) + 'px', left: 0, width: '100vw', height: Math.min(r.height, window.innerHeight) + 'px', borderRadius: 0 });
    document.body.append(cover);
    gsap.to(cover, {
      top: 0, height: $('.case__hero', el).offsetHeight, duration: 1.1, ease: 'expo.inOut',
      onComplete: () => {
        current = next;
        render(next);
        scroller.scrollTop = 0;
        heroImg.style.transform = '';
        bar.classList.remove('is-dark');
        history.replaceState({ case: next.id }, '', `#work/${next.id}`);
        animateIn();
        gsap.to(cover, { autoAlpha: 0, duration: 0.4, delay: 0.1, onComplete: () => { cover.remove(); busy = false; } });
      },
    });
  };

  const close = (fromPop = false) => {
    if (!el.classList.contains('is-open') || busy) return;
    busy = true;
    gsap.to(el, {
      clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut',
      onComplete: () => {
        el.classList.remove('is-open');
        el.setAttribute('aria-hidden', 'true');
        gsap.set(el, { clearProps: 'clipPath' });
        lenis.start();
        busy = false;
        current = null;
        onClose && onClose();
      },
    });
    if (!fromPop) history.pushState({}, '', location.pathname);
  };

  $('.case__close', el).addEventListener('click', () => close());
  window.addEventListener('keydown', (e) => e.key === 'Escape' && close());
  window.addEventListener('popstate', () => {
    const m = location.hash.match(/^#work\/(.+)$/);
    if (m && !current) open(m[1]);
    else if (!m) close(true);
  });

  $$('.project').forEach((card) =>
    card.addEventListener('click', (e) => {
      e.preventDefault();
      open(card.dataset.id, card);
    })
  );
  $$('.index__row[data-id]').forEach((row) =>
    row.addEventListener('click', (e) => {
      e.preventDefault();
      open(row.dataset.id);
    })
  );

  // Re-render the open case in the current language without re-animating.
  const refresh = () => {
    if (!current) return;
    const y = scroller.scrollTop;
    render(current);
    scroller.scrollTop = y;
  };

  return { open, close, refresh, deepLink: () => { const m = location.hash.match(/^#work\/(.+)$/); if (m) open(m[1]); } };
}
