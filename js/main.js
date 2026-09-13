/**
 * Yusr — shared shell: header, drawer, footer, language switching, sticky
 * WhatsApp button, accordions. Every page loads this module; page modules
 * `await ready` before rendering.
 */

import { CONFIG, DEMO_MODE } from './config.js';
import { DICT, LANGS, getLang, storeLang, t, pick } from './i18n.js';
import { getSite, isDemo } from './store.js';
import { ICON, esc, trapFocus, lockScroll, initReveal, revealWithin } from './ui.js';
import { mountSearch } from './search.js';

let currentLang = getLang();
let site = null;

export function lang() { return currentLang; }
export function siteData() { return site; }

/* Used when data/site.json cannot be loaded (e.g. opened from file://). */
const FALLBACK_SITE = {
  brand: { name: { ar: 'يسر', en: 'Yusr' }, tagline: { ar: 'بيتك على راحتك', en: 'Your home, your way.' } },
  hero: {}, contact: {}, social: {}, legal: {}, cities: [], hours: [], badges: {}, partners: [], stats: [], seo: {}
};

/* -------------------------------------------------------------- links -- */

export function waNumber() {
  return String(site?.contact?.whatsapp || '').replace(/\D/g, '');
}

/** wa.me deep link with a pre-filled message, or '' when no number is configured. */
export function waLink(text) {
  const n = waNumber();
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : '';
}

export function mailLink(subject, body) {
  const email = site?.contact?.email;
  return email ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : '';
}

function greetingLink() {
  return waLink(t('waMsg.greeting', currentLang));
}

/* ---------------------------------------------------------------- logo -- */

export function logoMarkup(l = currentLang) {
  return `
    <span class="logo" aria-hidden="true">
      <svg class="logo__mark" viewBox="0 0 40 40" focusable="false" aria-hidden="true">
        <path d="M6 20 20 8l14 12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 21v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity=".45"/>
      </svg>
      <span class="logo__word">${esc(pick(site?.brand?.name, l) || t('brand.name', l))}</span>
    </span>`;
}

/* -------------------------------------------------------------- header -- */

const NAV = [
  { key: 'home', href: 'index.html', page: 'home' },
  { key: 'products', href: 'products.html', page: 'products' },
  { key: 'custom', href: 'custom.html', page: 'custom' },
  { key: 'how', href: 'how.html', page: 'how' },
  { key: 'about', href: 'about.html', page: 'about' },
  { key: 'contact', href: 'contact.html', page: 'contact' }
];

function buildHeader(page) {
  const links = NAV.map(item => {
    const current = item.page === page ? ' aria-current="page"' : '';
    return `<li><a class="nav__link" href="${item.href}" data-i18n="nav.${item.key}"${current}></a></li>`;
  }).join('');

  return `
  <a class="skip-link" href="#main" data-i18n="nav.skip"></a>
  <header class="hdr" id="site-header">
    <div class="container hdr__in">
      <a class="hdr__brand" href="index.html">
        ${logoMarkup()}
        <span class="visually-hidden" data-i18n="brand.name"></span>
      </a>

      <nav class="nav" id="primary-nav" aria-label="Main">
        <ul class="nav__list">${links}</ul>
        <div class="nav__drawer-foot">
          <a class="btn btn--primary btn--block" id="drawer-wa" href="#" target="_blank" rel="noopener" hidden>
            ${ICON.whatsapp}<span data-i18n="sticky.cta"></span>
          </a>
        </div>
      </nav>

      <div class="hdr__actions">
        <button type="button" class="icon-btn" id="search-open" data-i18n-attr="aria-label:nav.search">
          ${ICON.search}
        </button>
        <button type="button" class="lang-toggle" id="lang-toggle">
          <span data-i18n="nav.langToggle"></span>
        </button>
        <a class="btn btn--primary btn--sm hdr__wa" id="header-wa" href="#" target="_blank" rel="noopener" hidden>
          ${ICON.whatsapp}<span data-i18n="nav.whatsapp"></span>
        </a>
        <button type="button" class="icon-btn nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="primary-nav">
          <span class="nav-toggle__open">${ICON.menu}</span>
          <span class="nav-toggle__close">${ICON.close}</span>
          <span class="visually-hidden" data-i18n="nav.menu"></span>
        </button>
      </div>
    </div>
  </header>`;
}

function initDrawer() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;
  let release = null;

  const setOpen = open => {
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
    lockScroll(open);
    if (open) {
      release = trapFocus(nav.parentElement);
      const first = nav.querySelector('a');
      if (first) first.focus();
    } else if (release) {
      release(); release = null;
    }
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  // Close the drawer if the viewport grows past the mobile breakpoint.
  window.matchMedia('(min-width: 900px)').addEventListener('change', ev => { if (ev.matches) setOpen(false); });
}

/** Hide the header on scroll-down, show it on scroll-up. */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const overlayOpen = document.body.classList.contains('nav-open') || document.body.classList.contains('search-open');
    if (overlayOpen || y < CONFIG.headerHideAfter) {
      header.classList.remove('hdr--hidden');
    } else if (y > lastY + 4) {
      header.classList.add('hdr--hidden');
    } else if (y < lastY - 4) {
      header.classList.remove('hdr--hidden');
    }
    header.classList.toggle('hdr--scrolled', y > 8);
    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  // Never hide the header while something inside it has keyboard focus.
  header.addEventListener('focusin', () => header.classList.remove('hdr--hidden'));
}

/* ---------------------------------------------------------- sticky WA -- */

function mountStickyWa() {
  if (document.body.dataset.page === 'custom') return; // the form page has its own submit
  const el = document.createElement('a');
  el.className = 'wa-fab';
  el.id = 'wa-fab';
  el.target = '_blank';
  el.rel = 'noopener';
  el.hidden = true;
  el.innerHTML = `${ICON.whatsapp}<span data-i18n="sticky.cta"></span>`;
  el.setAttribute('data-wa-greeting', '');
  document.body.appendChild(el);

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 1;
    el.classList.toggle('is-on', progress >= CONFIG.stickyWaThreshold);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------------------------------------------------------------- demo -- */

/** Inert target for demo phone / WhatsApp / e-mail links — never a real number. */
export const DEMO_HREF = '#demo';
const DEMO_TOAST = 'رقم تجريبي — لن يتم الإرسال / Demo number — nothing will be sent';
const DEMO_BANNER = 'وضع تجريبي — البيانات والصور غير حقيقية · Demo mode — data and images are not real';
const DEMO_DISMISS_KEY = 'yusr.demoDismissed';

/** href for a contact link: the real one, or the inert demo target when the value is demo-filled. */
export function demoHref(realHref, sitePath) {
  return isDemo(site, sitePath) ? DEMO_HREF : esc(realHref);
}

/** True when the value at `sitePath` is demo-filled (for callers that build their own links). */
export function isDemoValue(sitePath) {
  return isDemo(site, sitePath);
}

let toastEl = null;
let toastTimer = null;
export function showToast(text) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = text;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
}

function mountDemoBanner() {
  if (!DEMO_MODE) return;

  // Every demo link is inert: swallow the click and explain why.
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-demo-link]');
    if (!link) return;
    e.preventDefault();
    e.stopPropagation();
    showToast(DEMO_TOAST);
  }, true);

  let dismissed = false;
  try { dismissed = sessionStorage.getItem(DEMO_DISMISS_KEY) === '1'; } catch (_) { /* private mode */ }
  if (dismissed) return;

  const banner = document.createElement('div');
  banner.className = 'demo-banner';
  banner.id = 'demo-banner';
  banner.setAttribute('role', 'status');
  banner.innerHTML = `<span>${DEMO_BANNER}</span>
    <button type="button" class="demo-banner__x" id="demo-banner-x" aria-label="${esc(t('nav.close', currentLang))}">${ICON.close}</button>`;
  document.body.appendChild(banner);

  const setOffset = () => {
    document.documentElement.style.setProperty('--demo-offset', `${banner.offsetHeight}px`);
    document.body.classList.add('demo-banner-on');
  };
  setOffset();
  window.addEventListener('resize', setOffset, { passive: true });

  banner.querySelector('#demo-banner-x').addEventListener('click', () => {
    try { sessionStorage.setItem(DEMO_DISMISS_KEY, '1'); } catch (_) { /* private mode */ }
    banner.remove();
    document.documentElement.style.removeProperty('--demo-offset');
    document.body.classList.remove('demo-banner-on');
    window.removeEventListener('resize', setOffset);
  });
}

/* -------------------------------------------------------------- footer -- */

function socialMarkup() {
  return Object.entries(site?.social || {})
    .filter(([, url]) => url)
    .map(([name, url]) => `
      <a class="social__link" href="${esc(url)}" target="_blank" rel="noopener me">
        ${ICON[name] || ICON.arrow}
        <span class="visually-hidden" data-i18n="footer.${name}"></span>
      </a>`)
    .join('');
}

function buildFooter() {
  const links = NAV.map(i => `<li><a href="${i.href}" data-i18n="nav.${i.key}"></a></li>`).join('');
  const c = site?.contact || {};
  const legal = site?.legal || {};
  const social = socialMarkup();

  const contactItems = [
    waNumber() ? `<li><a class="with-icon" id="footer-wa" href="#" target="_blank" rel="noopener" data-wa-greeting>${ICON.whatsapp}<span data-i18n="nav.whatsapp"></span></a></li>` : '',
    c.phone ? `<li><a class="with-icon" href="${demoHref(`tel:${String(c.phone).replace(/\s/g, '')}`, 'contact.phone')}"${isDemo(site, 'contact.phone') ? ' data-demo-link' : ''}>${ICON.phone}<span dir="ltr">${esc(c.phone)}</span></a></li>` : '',
    c.email ? `<li><a class="with-icon" href="${demoHref(`mailto:${c.email}`, 'contact.email')}"${isDemo(site, 'contact.email') ? ' data-demo-link' : ''}>${ICON.mail}<span dir="ltr">${esc(c.email)}</span></a></li>` : ''
  ].join('');

  const legalItems = [
    legal.maroof ? `<span><span data-i18n="footer.maroof"></span>: <span dir="ltr">${esc(legal.maroof)}</span></span>` : '',
    legal.cr ? `<span><span data-i18n="footer.cr"></span>: <span dir="ltr">${esc(legal.cr)}</span></span>` : '',
    legal.vat ? `<span><span data-i18n="footer.vat"></span>: <span dir="ltr">${esc(legal.vat)}</span></span>` : ''
  ].filter(Boolean).join(' · ');

  return `
  <footer class="ftr">
    <div class="container ftr__grid">
      <div class="ftr__col">
        <a class="ftr__brand" href="index.html">${logoMarkup()}<span class="visually-hidden" data-i18n="brand.name"></span></a>
        <p class="ftr__about" data-i18n="footer.about"></p>
        <p class="ftr__made">${ICON.check}<span data-i18n="common.madeIn"></span></p>
      </div>

      <div class="ftr__col">
        <h2 class="ftr__title" data-i18n="footer.links"></h2>
        <ul class="ftr__links">${links}</ul>
      </div>

      <div class="ftr__col">
        ${contactItems ? `<h2 class="ftr__title" data-i18n="footer.contact"></h2><ul class="ftr__links">${contactItems}</ul>` : ''}
        ${social ? `<h2 class="ftr__title" data-i18n="footer.social"></h2><div class="social">${social}</div>` : ''}
      </div>
    </div>

    <div class="container ftr__bottom">
      <p><span data-i18n="brand.name"></span> © <span id="year">${new Date().getFullYear()}</span> · <span data-i18n="footer.rights"></span></p>
      ${legalItems ? `<p class="ftr__legal">${legalItems}</p>` : ''}
    </div>
  </footer>`;
}

/* ------------------------------------------------------------- i18n DOM -- */

export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n, currentLang);
  });
  root.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const idx = pair.indexOf(':');
      if (idx < 0) return;
      const attr = pair.slice(0, idx).trim();
      const key = pair.slice(idx + 1).trim();
      if (attr && key) el.setAttribute(attr, t(key, currentLang));
    });
  });
}

function setMeta(attr, name, content) {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Per-page title/description in the active language, plus OG tags. */
export function applyMeta(overrides = {}) {
  const page = document.body.dataset.page;
  const meta = DICT[currentLang].meta[page] || {};
  const title = overrides.title || meta.t;
  const description = overrides.description || meta.d;
  if (!title) return;

  document.title = title;
  setMeta('name', 'description', description || '');
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description || '');
  setMeta('property', 'og:locale', currentLang === 'ar' ? 'ar_SA' : 'en_US');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description || '');
  if (site?.seo?.ogImage) setMeta('property', 'og:image', site.seo.ogImage);
}

/** hreflang alternates for the current page in both languages. */
function applyAlternates() {
  document.head.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());
  const file = location.pathname.split('/').pop() || 'index.html';
  const params = new URLSearchParams(location.search);
  LANGS.concat(['x-default']).forEach(code => {
    const p = new URLSearchParams(params);
    p.set('lang', code === 'x-default' ? CONFIG.defaultLang : code);
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = code;
    link.href = new URL(`${file}?${p.toString()}`, location.href).href; // hreflang must be absolute
    document.head.appendChild(link);
  });
}

const langListeners = [];
/** Register a callback that re-renders when the language changes. */
export function onLangChange(fn) { langListeners.push(fn); }

export function setLang(next, { persist = true } = {}) {
  currentLang = LANGS.includes(next) ? next : CONFIG.defaultLang;
  if (persist) storeLang(currentLang);

  const conf = DICT[currentLang];
  document.documentElement.lang = conf.htmlLang;
  document.documentElement.dir = conf.dir;

  document.querySelectorAll('.logo').forEach(el => { el.outerHTML = logoMarkup(); });

  // The toggle names the *other* language, so mark its text with that language.
  const toggleText = document.querySelector('#lang-toggle [data-i18n]');
  if (toggleText) toggleText.lang = currentLang === 'ar' ? 'en' : 'ar';

  applyI18n();
  applyMeta();
  applyAlternates();
  refreshWaLinks();

  const params = new URLSearchParams(location.search);
  params.set('lang', currentLang);
  history.replaceState(null, '', `${location.pathname}?${params.toString()}${location.hash}`);

  langListeners.forEach(fn => fn(currentLang));
}

function refreshWaLinks() {
  const link = greetingLink();
  const demo = isDemo(site, 'contact.whatsapp');
  document.querySelectorAll('[data-wa-greeting]').forEach(el => {
    el.href = demo ? DEMO_HREF : (link || '#');
    el.hidden = !link;
    el.toggleAttribute('data-demo-link', demo);
  });
}

/* ------------------------------------------------------------ accordion -- */

export function initAccordions(root = document) {
  root.querySelectorAll('.acc__trigger').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
    });
  });
}

/* ----------------------------------------------------------------- init -- */

/**
 * <html class="pre"> keeps <main> unpainted until the page has rendered its first
 * content, so text and data arrive in place instead of shifting the layout.
 * Page modules call this after their first render; a timeout guarantees it.
 */
export function markReady() {
  document.documentElement.classList.remove('pre');
}

async function init() {
  initReveal();
  setTimeout(markReady, 3000);

  if (DEMO_MODE) {
    // A demo build must never be indexed.
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
  }

  // The header depends only on the dictionary, so it renders before any fetch —
  // into space the stylesheet already reserved — and never shifts the page.
  const page = document.body.dataset.page || '';
  const headerSlot = document.getElementById('header-slot');
  if (headerSlot) headerSlot.outerHTML = buildHeader(page);

  ['header-wa', 'drawer-wa'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('data-wa-greeting', '');
  });

  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.addEventListener('click', () => setLang(currentLang === 'ar' ? 'en' : 'ar'));

  initDrawer();
  initHeaderScroll();
  mountSearch({ lang, onLangChange, applyI18n, siteData: () => site });
  initAccordions();
  setLang(currentLang, { persist: false });

  try {
    site = await getSite();
  } catch (err) {
    console.warn('[yusr] site.json unavailable, using fallbacks:', err.message);
    site = FALLBACK_SITE;
  }

  // Everything that needs business data: footer, WhatsApp links, share image.
  const footerSlot = document.getElementById('footer-slot');
  if (footerSlot) footerSlot.outerHTML = buildFooter();
  mountStickyWa();
  applyI18n(document);
  applyMeta();
  refreshWaLinks();
  revealWithin(document);
  mountDemoBanner();
  // Pages with a data-driven module (body[data-async]) reveal themselves after their first render.
  if (!document.body.hasAttribute('data-async')) markReady();
  return site;
}

export const ready = init();
