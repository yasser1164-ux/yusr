/**
 * Yusr — shared UI pieces: icons, the image component, product cards,
 * focus trapping, scroll-reveal and body scroll locking.
 */

import { CONFIG } from './config.js';
import { t, pick, formatPrice, formatDays } from './i18n.js';

/* ---------------------------------------------------------------- text -- */

export function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* --------------------------------------------------------------- icons -- */

const svg = (path, extra = '') =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"${extra}><path fill="currentColor" d="${path}"/></svg>`;

export const ICON = {
  whatsapp: svg('M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07s.9 2.4 1.02 2.56c.12.17 1.76 2.67 4.25 3.74.6.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z'),
  phone: svg('M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .7-.2 1l-2.2 2.2Z'),
  mail: svg('M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm8 7.2L4.4 6.3a.5.5 0 0 0-.4.5v.3l8 5.1 8-5.1v-.3a.5.5 0 0 0-.4-.5L12 11.2Z'),
  pin: svg('M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z'),
  clock: svg('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 10.6V6h-2v7.4l5 3 1-1.7-4-2.1Z'),
  menu: svg('M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z'),
  close: svg('m6.4 5 12.6 12.6-1.4 1.4L5 6.4 6.4 5Zm12.6 1.4L6.4 19 5 17.6 17.6 5 19 6.4Z'),
  search: svg('M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z'),
  chevron: svg('m12 15.4-6-6L7.4 8l4.6 4.6L16.6 8 18 9.4l-6 6Z'),
  arrow: svg('m13.2 5 6.3 7-6.3 7-1.5-1.3 4.1-4.6H4.5v-2h11.3l-4.1-4.6L13.2 5Z', ' class="i-dir"'),
  back: svg('m10.8 5-6.3 7 6.3 7 1.5-1.3-4.1-4.6h11.3v-2H8.2l4.1-4.6L10.8 5Z', ' class="i-dir"'),
  prev: svg('m15.4 6-6 6 6 6 1.4-1.4L12.2 12l4.6-4.6L15.4 6Z', ' class="i-dir"'),
  next: svg('m8.6 6 6 6-6 6-1.4-1.4 4.6-4.6-4.6-4.6L8.6 6Z', ' class="i-dir"'),
  check: svg('M9.5 17.2 4.8 12.5l1.4-1.4 3.3 3.3 8-8 1.4 1.4-9.4 9.4Z'),
  shield: svg('M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-1 13.5-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.6 1.4 1.4-6 6Z'),
  ruler: svg('m3.4 14.6 11.2-11.2 5.9 5.9L9.3 20.5l-5.9-5.9Zm3.4.3 1.4 1.4 1.4-1.4-1.4-1.4 1.4-1.4 1.4 1.4 1.4-1.4-1.4-1.4 1.4-1.4 1.4 1.4 1.4-1.4-1.4-1.4 1.5-1.4 2.8 2.9-8.4 8.4-2.9-2.9Z'),
  tag: svg('M11 2H4a2 2 0 0 0-2 2v7l11 11 9-9L11 2Zm-3.5 6A1.5 1.5 0 1 1 7.5 5a1.5 1.5 0 0 1 0 3Z'),
  truck: svg('M3 5h11v9H3V5Zm12 3h3.5L21 11.5V14h-6V8ZM6.5 19a1.8 1.8 0 1 1 0-3.5 1.8 1.8 0 0 1 0 3.5Zm11 0a1.8 1.8 0 1 1 0-3.5 1.8 1.8 0 0 1 0 3.5Z'),
  home: svg('m12 3 9 8h-3v9h-5v-6h-2v6H6v-9H3l9-8Z'),
  zoom: svg('M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2Zm-1 5h2v2h2v2h-2v2H9v-2H7V9h2V7Z'),
  copy: svg('M8 4h10a2 2 0 0 1 2 2v10h-2V6H8V4Zm-4 4h10a2 2 0 0 1 2 2v10H4V8Zm2 2v8h8v-8H6Z'),
  doc: svg('M4 3h11l5 5v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm10 1.5V9h4.5L14 4.5ZM7 12h10v2H7v-2Zm0 4h7v2H7v-2Z'),
  /* category icons */
  majlis: svg('M3 14h18v5H3v-5Zm1-6h7v5H4V8Zm9 0h7v5h-7V8Z'),
  sofa: svg('M6 6h12a2 2 0 0 1 2 2v2.2A2.5 2.5 0 0 1 22 12.5V18h-2v-2H4v2H2v-5.5A2.5 2.5 0 0 1 4 10.2V8a2 2 0 0 1 2-2Zm0 2v2.2c.8.3 1.4 1 1.7 1.8h8.6c.3-.8.9-1.5 1.7-1.8V8H6Z'),
  bed: svg('M3 6h8v6H3V6Zm9 2h9v4h-9V8ZM2 13h20v6h-2v-2H4v2H2v-6Z'),
  kitchen: svg('M3 3h18v4H3V3Zm0 6h18v12H3V9Zm2 2v8h6v-8H5Zm8 0v8h6v-8h-6Zm-6 3h2v2H7v-2Zm8 0h2v2h-2v-2Z'),
  door: svg('M6 3h12v18H6V3Zm2 2v14h8V5H8Zm5 6h2v2h-2v-2Z'),
  dining: svg('M2 7h20v2h-2v10h-2V9H6v10H4V9H2V7Zm5 6h10v2H7v-2Z'),
  /* social */
  instagram: svg('M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.8a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 9.9a3.9 3.9 0 1 1 0-7.8 3.9 3.9 0 0 1 0 7.8Zm7.6-10.1a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z'),
  x: svg('M17.5 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.1 21H2l7.3-8.3L2.2 3h6.4l4.4 5.9L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z'),
  tiktok: svg('M16.8 2h-3v13.4a2.6 2.6 0 1 1-2-2.5V9.8a5.9 5.9 0 1 0 5 5.8V9.1a7 7 0 0 0 4 1.3V7.3a4.1 4.1 0 0 1-4-4.1V2Z'),
  snapchat: svg('M12 2c2.8 0 4.7 2 4.8 4.7v2.1c.5.2 1-.2 1.5-.2.6 0 1.1.4 1.1.9 0 .6-.7.9-1.4 1.1-.5.2-.8.3-.8.7 0 .8 2 3.3 3.9 3.7.3.1.5.3.5.6 0 .7-1.6 1.1-2.5 1.2-.2.4-.2 1.1-.6 1.3-.3.2-.9 0-1.6 0-1 0-1.6.2-2.3.7-.7.5-1.4 1.2-2.6 1.2s-1.9-.7-2.6-1.2c-.7-.5-1.3-.7-2.3-.7-.7 0-1.3.2-1.6 0-.4-.2-.4-.9-.6-1.3-.9-.1-2.5-.5-2.5-1.2 0-.3.2-.5.5-.6 1.9-.4 3.9-2.9 3.9-3.7 0-.4-.3-.5-.8-.7-.7-.2-1.4-.5-1.4-1.1 0-.5.5-.9 1.1-.9.5 0 1 .4 1.5.2V6.7C7.3 4 9.2 2 12 2Z')
};

export function icon(name) {
  return ICON[name] || '';
}

/* ------------------------------------------------------- image component -- */

/**
 * A fixed-ratio image box: lazy, async, sand placeholder while loading,
 * branded placeholder when the file is missing or fails.
 *
 * @param {object} img  { src, webp?, alt } — alt may be a string or { ar, en }
 * @param {object} opts { lang, ratio: '4 / 3', className, eager, sizes }
 */
export function picture(img, { lang = 'ar', ratio = '4 / 3', className = '', eager = false, priority = false, sizes = '' } = {}) {
  const src = img && img.src;
  const alt = esc(pick(img && img.alt, lang));
  const loading = eager ? 'eager' : 'lazy';
  const priorityAttr = priority ? ' fetchpriority="high"' : '';
  const sizesAttr = sizes ? ` sizes="${esc(sizes)}"` : '';

  if (!src) {
    return `<span class="img-box ${className}" style="--ratio:${ratio}" data-placeholder>
      <img src="${CONFIG.placeholderImage}" alt="" width="1600" height="1200" loading="${loading}" decoding="async">
    </span>`;
  }

  const webp = img.webp ? `<source srcset="${esc(img.webp)}" type="image/webp"${sizesAttr}>` : '';
  return `<span class="img-box ${className}" style="--ratio:${ratio}">
    <picture>${webp}<img src="${esc(src)}" alt="${alt}" width="1600" height="1200" loading="${loading}" decoding="async"${priorityAttr}${sizesAttr} data-fallback></picture>
  </span>`;
}

/* Swap any failed <img data-fallback> for the branded placeholder — one listener, capture phase. */
document.addEventListener('error', e => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || !img.hasAttribute('data-fallback')) return;
  img.removeAttribute('data-fallback');
  const source = img.parentElement && img.parentElement.querySelector('source');
  if (source) source.remove();
  img.src = CONFIG.placeholderImage;
  img.alt = '';
  const box = img.closest('.img-box');
  if (box) box.setAttribute('data-placeholder', '');
}, true);

/* ---------------------------------------------------------------- chips -- */

export function leadChip(days, lang) {
  if (!days) return '';
  return `<span class="chip chip--lead">${ICON.clock}${esc(t('common.readyIn', lang))} ${formatDays(days, lang)}</span>`;
}

export function badgeChips(ids = [], badges = {}, lang, max = Infinity) {
  return ids
    .filter(id => badges[id])
    .slice(0, max)
    .map(id => `<span class="chip chip--badge">${icon(badges[id].icon || 'check')}${esc(pick(badges[id].label || badges[id], lang))}</span>`)
    .join('');
}

/* --------------------------------------------------------- product card -- */

/**
 * Whole-card link: 4:3 image, name, "from" price, lead-time chip, badge row.
 * @param {object} p       product
 * @param {object} ctx     { lang, badges, categoryName }
 */
export function productCard(p, { lang, badges = {}, categoryName = '', eager = false, priority = false } = {}) {
  const href = `product.html?id=${encodeURIComponent(p.id)}`;
  const first = (p.images && p.images[0]) || null;
  return `
  <a class="pcard reveal" href="${href}">
    ${picture(first, { lang, ratio: '4 / 3', className: 'pcard__media', eager, priority, sizes: '(min-width: 1024px) 380px, (min-width: 600px) 50vw, 100vw' })}
    <span class="pcard__body">
      ${categoryName ? `<span class="pcard__cat">${esc(categoryName)}</span>` : ''}
      <span class="pcard__name">${esc(pick(p.name, lang))}</span>
      <span class="pcard__price"><span class="pcard__from">${esc(t('common.from', lang))}</span> <strong>${formatPrice(p.priceFrom, lang)}</strong></span>
      <span class="pcard__meta">
        ${leadChip(p.leadTimeDays, lang)}
        ${badgeChips(p.badges, badges, lang, 2)}
      </span>
    </span>
  </a>`;
}

/* -------------------------------------------------------- section head -- */

export function sectionHead({ eyebrow, title, text, center = false, tag = 'h2' }) {
  return `
  <div class="sec-head${center ? ' sec-head--center' : ''} reveal">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <${tag} class="sec-head__title">${esc(title)}</${tag}>
    ${text ? `<p class="sec-head__text">${esc(text)}</p>` : ''}
  </div>`;
}

/* ---------------------------------------------------------- focus trap -- */

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Keep Tab / Shift+Tab inside `container`. Returns a release function. */
export function trapFocus(container) {
  function onKey(e) {
    if (e.key !== 'Tab') return;
    const items = [...container.querySelectorAll(FOCUSABLE)].filter(el => !el.hidden && el.offsetParent !== null);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}

/* ----------------------------------------------------- body scroll lock -- */

let lockCount = 0;
export function lockScroll(on) {
  lockCount = Math.max(0, lockCount + (on ? 1 : -1));
  document.body.classList.toggle('is-locked', lockCount > 0);
}

/* --------------------------------------------------------- scroll reveal -- */

let observer = null;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal() {
  document.documentElement.classList.add('js');
  if (reduced() || !('IntersectionObserver' in window)) {
    document.documentElement.classList.add('no-reveal');
    return;
  }
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  revealWithin(document);
}

/** Observe any new .reveal elements inside root (call after rendering). */
export function revealWithin(root = document) {
  if (!observer) return;
  root.querySelectorAll('.reveal:not(.in)').forEach((el, i) => {
    el.style.setProperty('--delay', `${Math.min(i, 8) * 45}ms`);
    observer.observe(el);
  });
}
