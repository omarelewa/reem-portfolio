// Shared chrome + site-wide upgrades for the Reem Awad portfolio.
//  - initChrome(refs, opts): nav-scroll state, scroll reveal, reading progress, blend-mode cursor (case studies).
//  - initExtras(opts): page-transition curtain, per-page <title>, baseline alt text,
//    fullscreen menu, image lightbox, tap-to-flip cards. Safe to call from any page.
// All shared styling lives in site.css (linked from every page's <head>).

const PROJECTS = [
  { file: 'anti.html', name: 'anti:time' },
  { file: 'larz.html', name: 'LARZ Development' },
  { file: 'mother-naked.html', name: 'Mother Naked' },
  { file: 'miniz.html', name: 'miniz' },
  { file: 'cairo-marathon.html', name: 'Cairo Marathon' },
  { file: 'fit-and-fix.html', name: 'Fit & Fix' },
  { file: 'cairo-food-week.html', name: 'Cairo Food Week' },
  { file: 'wonderville.html', name: 'Wonderville' },
  { file: 'cairo-posters.html', name: 'Cairo Posters' },
  { file: 'frank-sol.html', name: 'Frank Sol' },
  { file: 'photography.html', name: 'Photography' }
];

function currentProject() {
  let path = location.pathname + location.search;
  try { path = decodeURIComponent(path); } catch (_) {}
  const i = PROJECTS.findIndex(p => path.indexOf(p.file) !== -1);
  return i < 0 ? null : { i, cur: PROJECTS[i], next: PROJECTS[(i + 1) % PROJECTS.length] };
}

const onHome = () => !currentProject();

/* ---------------- fullscreen menu ---------------- */
function buildMenu() {
  if (document.querySelector('.mnav')) return;
  const navLinks = document.querySelector('.nav-links') || document.querySelector('.nav > div');
  if (!navLinks) return;
  // mark the WhatsApp link so it stays visible next to the menu button on mobile
  navLinks.querySelectorAll('a[href*="wa.me"]').forEach(a => a.classList.add('nav-cta'));

  const btn = document.createElement('button');
  btn.className = 'mnav-btn';
  btn.setAttribute('aria-label', 'Open menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span class="bars" aria-hidden="true"><i></i><i></i></span>Menu';
  navLinks.insertBefore(btn, navLinks.firstChild);

  const home = onHome() ? '' : './';
  const proj = currentProject();
  const ov = document.createElement('div');
  ov.className = 'mnav';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-label', 'Site menu');
  ov.innerHTML =
    '<div class="grain"></div>' +
    '<div class="mnav-top"><span class="mnav-brand">Reem Awad <span class="mk" aria-hidden="true"><svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M4.2 4.2H19.8V19.8H4.2Z M12 1L23 12L12 23L1 12Z"/></svg></span></span>' +
    '<button class="mnav-close" aria-label="Close menu">×</button></div>' +
    '<nav class="mnav-links">' +
      '<a href="' + (home || '#top') + '">Home</a>' +
      '<a href="' + home + '#work">Work</a>' +
      '<a href="' + home + '#about">About</a>' +
      '<a href="' + home + '#contact">Contact</a>' +
    '</nav>' +
    '<div class="mnav-label">Projects — ' + PROJECTS.length + '</div>' +
    '<nav class="mnav-proj">' +
      PROJECTS.map((p, i) =>
        '<a href="' + p.file + '"' + (proj && proj.i === i ? ' class="cur-page" aria-current="page"' : '') + '>' +
        '<em>' + String(i + 1).padStart(2, '0') + '</em>' + p.name + '</a>'
      ).join('') +
    '</nav>';
  document.body.appendChild(ov);

  const closeBtn = ov.querySelector('.mnav-close');
  let lastFocus = null;
  const open = () => {
    lastFocus = document.activeElement;
    ov.classList.add('open');
    document.documentElement.classList.add('mnav-lock');
    btn.setAttribute('aria-expanded', 'true');
    closeBtn.focus({ preventScroll: true });
  };
  const close = () => {
    ov.classList.remove('open');
    document.documentElement.classList.remove('mnav-lock');
    btn.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  ov.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a');
    if (a) close();  // page links also trigger the curtain via the global handler
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ov.classList.contains('open')) close();
  });
}

/* ---------------- image lightbox ---------------- */
function initLightbox() {
  if (document.querySelector('.lb')) return;
  const imgs = Array.from(document.querySelectorAll('img[data-lb]'));
  if (!imgs.length) return;
  imgs.forEach(im => { if (!im.hasAttribute('data-cursor')) im.setAttribute('data-cursor', 'Expand'); });

  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML =
    '<img alt="">' +
    '<div class="lb-ui">' +
      '<button class="lb-prev" aria-label="Previous image">←</button>' +
      '<button class="lb-next" aria-label="Next image">→</button>' +
      '<button class="lb-close" aria-label="Close viewer">×</button>' +
      '<div class="lb-cap" aria-live="polite"></div>' +
    '</div>';
  document.body.appendChild(lb);

  const big = lb.querySelector('img');
  const cap = lb.querySelector('.lb-cap');
  let idx = 0, zoom = false, panX = 0, panY = 0, lastFocus = null;

  const render = () => {
    const src = imgs[idx].currentSrc || imgs[idx].src;
    big.src = src;
    big.alt = imgs[idx].alt || '';
    cap.textContent = (idx + 1) + ' / ' + imgs.length + (imgs[idx].alt ? ' — ' + imgs[idx].alt : '');
    [idx - 1, idx + 1].forEach(j => {
      const k = (j + imgs.length) % imgs.length;
      const pre = new Image(); pre.src = imgs[k].currentSrc || imgs[k].src;
    });
  };
  const applyZoom = () => {
    lb.classList.toggle('zoomed', zoom);
    big.style.transform = zoom ? 'translate(' + panX + 'px,' + panY + 'px) scale(2.2)' : '';
  };
  const open = (i) => {
    idx = i; zoom = false; panX = panY = 0; applyZoom(); render();
    lastFocus = document.activeElement;
    lb.classList.add('open');
    document.documentElement.classList.add('mnav-lock');
    lb.querySelector('.lb-close').focus({ preventScroll: true });
  };
  const close = () => {
    lb.classList.remove('open');
    document.documentElement.classList.remove('mnav-lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  const nav = (d) => { idx = (idx + d + imgs.length) % imgs.length; zoom = false; panX = panY = 0; applyZoom(); render(); };

  imgs.forEach((im, i) => im.addEventListener('click', () => open(i)));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => nav(-1));
  lb.querySelector('.lb-next').addEventListener('click', () => nav(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') nav(-1);
    else if (e.key === 'ArrowRight') nav(1);
  });

  // touch: swipe to navigate / swipe down to close / double-tap to zoom / drag to pan
  let px = 0, py = 0, moved = false, lastTap = 0;
  big.addEventListener('pointerdown', (e) => {
    px = e.clientX; py = e.clientY; moved = false;
    if (zoom) big.setPointerCapture(e.pointerId);
  });
  big.addEventListener('pointermove', (e) => {
    if (zoom && e.buttons) {
      panX += e.movementX; panY += e.movementY; applyZoom(); moved = true;
    }
  });
  big.addEventListener('pointerup', (e) => {
    const dx = e.clientX - px, dy = e.clientY - py;
    if (!zoom && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) { nav(dx < 0 ? 1 : -1); return; }
    if (!zoom && dy > 80 && Math.abs(dy) > Math.abs(dx)) { close(); return; }
    if (moved) return;
    const now = Date.now();
    if (now - lastTap < 350) { zoom = !zoom; panX = panY = 0; applyZoom(); lastTap = 0; }
    else lastTap = now;
  });
}

/* ---------------- tap-to-flip cards (touch devices) ---------------- */
function initFlipCards() {
  const cards = document.querySelectorAll('[data-cursor="Flip"]');
  if (!cards.length) return;
  const hoverable = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  cards.forEach(card => {
    const inner = card.firstElementChild;
    if (inner) inner.classList.add('flip-inner');
    if (!hoverable) card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}

/* ---------------- extras (every page) ---------------- */
export function initExtras(opts) {
  opts = opts || {};
  const proj = currentProject();
  if (opts.accent) document.documentElement.style.setProperty('--curtain', opts.accent);
  // per-page browser title (static <title> tags exist too; this keeps SPA-side consistency)
  const title = opts.title || (proj ? proj.cur.name + ' — Reem Awad · Case study' : null);
  if (title) document.title = title;
  // baseline alt text for any image that slipped through without one
  try {
    const nm = opts.name || (proj ? proj.cur.name : 'Reem Awad');
    document.querySelectorAll('img:not([alt])').forEach(im => { im.alt = nm + ' — project image'; });
  } catch (_) {}

  buildMenu();
  initLightbox();
  initFlipCards();

  // page-transition curtain + internal-link interception
  let curtain = document.getElementById('cs-curtain');
  if (!curtain) { curtain = document.createElement('div'); curtain.id = 'cs-curtain'; document.body.appendChild(curtain); }
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (!reduce) {
    if (sessionStorage.getItem('cs-nav') === '1') {
      sessionStorage.removeItem('cs-nav');
      curtain.style.opacity = '1';
      requestAnimationFrame(() => requestAnimationFrame(() => { curtain.style.opacity = '0'; }));
    }
    if (!window.__csNavBound) {
      window.__csNavBound = true;
      document.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a');
        if (!a) return;
        if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const href = a.getAttribute('href') || '';
        let u; try { u = new URL(href, location.href); } catch (_) { return; }
        if (u.origin !== location.origin) return;
        if (u.pathname === location.pathname) return;
        if (!/(\.html|\/)$/i.test(u.pathname)) return;
        e.preventDefault();
        sessionStorage.setItem('cs-nav', '1');
        curtain.style.opacity = '1';
        setTimeout(() => { location.href = href; }, 380);
      });
    }
  }
}

/* ---------------- chrome (case studies) ---------------- */
export function initChrome(refs, opts) {
  opts = opts || {};
  refs = refs || {};
  initExtras(opts);
  const nav = document.querySelector('.nav');
  const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
  reveals.forEach((el, i) => { el.style.transitionDelay = (Math.min(i % 3, 2) * 0.08) + 's'; });
  const prog = refs.prog;
  const check = () => {
    const y = window.scrollY || window.pageYOffset || 0;
    const vh = window.innerHeight;
    if (nav) nav.classList.toggle('scrolled', y > 30);
    if (prog && prog.current) { const h = document.documentElement.scrollHeight - vh; prog.current.style.width = (h > 0 ? (y / h) * 100 : 0) + '%'; }
    for (const el of reveals) { if (!el.classList.contains('in') && el.getBoundingClientRect().top < vh * 0.9) el.classList.add('in'); }
    if (opts.onScroll) opts.onScroll(y, vh);
  };
  let ticking = false;
  const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { check(); ticking = false; }); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  check();
  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => io.observe(el));
  }
  let move, over, out;
  const cur = refs.cur && refs.cur.current;
  const lbl = refs.lbl && refs.lbl.current;
  if (cur && opts.cursor !== false && window.matchMedia('(pointer:fine)').matches) {
    document.documentElement.classList.add('cc');
    move = (e) => { cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; };
    over = (e) => { const t = e.target.closest && e.target.closest('[data-cursor]'); if (t) { cur.classList.add('active'); if (lbl) lbl.textContent = t.getAttribute('data-cursor') || 'View'; } };
    out = (e) => { const t = e.target.closest && e.target.closest('[data-cursor]'); const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-cursor]'); if (t && !to) cur.classList.remove('active'); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
  }
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (io) io.disconnect();
    if (move) document.removeEventListener('mousemove', move);
    if (over) document.removeEventListener('mouseover', over);
    if (out) document.removeEventListener('mouseout', out);
    document.documentElement.classList.remove('cc');
  };
}
