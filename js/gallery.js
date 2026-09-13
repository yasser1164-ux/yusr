/**
 * Yusr — "Our work" gallery and the shared lightbox.
 * Masonry on desktop, horizontal snap-scroll on mobile (CSS decides);
 * the lightbox is keyboard-navigable with a focus trap and Escape to close.
 */

import { t, pick, formatNumber } from './i18n.js';
import { ICON, esc, picture, trapFocus, lockScroll } from './ui.js';

/**
 * @param {Array} items  gallery entries: { image:{src,alt}, caption:{ar,en}, category, ratio? }
 * @param {object} ctx   { lang, categoryNames: {id: {ar,en}} }
 */
export function galleryMarkup(items, { lang, categoryNames = {} }) {
  return `<ul class="gal reveal">${items.map((g, i) => {
    const caption = pick(g.caption, lang);
    const cat = categoryNames[g.category] ? pick(categoryNames[g.category], lang) : '';
    return `
    <li class="gal__item">
      <button type="button" class="gal__btn" data-index="${i}" aria-label="${esc(t('gallery.open', lang))}: ${esc(caption)}">
        ${picture(g.image, { lang, ratio: g.ratio || '4 / 3', className: 'gal__img', sizes: '(min-width: 1024px) 33vw, 78vw' })}
        <span class="gal__cap">
          ${cat ? `<span class="gal__cat">${esc(cat)}</span>` : ''}
          <span class="gal__text">${esc(caption)}</span>
        </span>
      </button>
    </li>`;
  }).join('')}</ul>`;
}

/** Wire every .gal__btn inside root to the lightbox. */
export function bindGallery(root, items, { lang, categoryNames = {} }) {
  const slides = items.map(g => ({
    src: g.image && g.image.src,
    alt: pick(g.image && g.image.alt, lang) || pick(g.caption, lang),
    caption: [categoryNames[g.category] ? pick(categoryNames[g.category], lang) : '', pick(g.caption, lang)].filter(Boolean).join(' · ')
  }));
  root.querySelectorAll('.gal__btn').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(slides, Number(btn.dataset.index), { lang }));
  });
}

/* ------------------------------------------------------------- lightbox -- */

let box = null;

/**
 * @param {Array<{src:string, alt:string, caption?:string}>} slides
 * @param {number} start
 * @param {{lang:string}} ctx
 */
export function openLightbox(slides, start = 0, { lang }) {
  if (!slides.length) return;
  if (box) closeLightbox();

  let index = Math.max(0, Math.min(start, slides.length - 1));
  const opener = document.activeElement;
  const rtl = document.documentElement.dir === 'rtl';

  box = document.createElement('div');
  box.className = 'lb';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', t('gallery.open', lang));
  box.innerHTML = `
    <button type="button" class="lb__close icon-btn" aria-label="${esc(t('gallery.close', lang))}">${ICON.close}</button>
    <button type="button" class="lb__nav lb__prev icon-btn" aria-label="${esc(t('gallery.prev', lang))}" ${slides.length < 2 ? 'hidden' : ''}>${ICON.prev}</button>
    <figure class="lb__fig">
      <span class="lb__stage"><img class="lb__img" alt=""></span>
      <figcaption class="lb__cap"><span class="lb__text"></span><span class="lb__count"></span></figcaption>
    </figure>
    <button type="button" class="lb__nav lb__next icon-btn" aria-label="${esc(t('gallery.next', lang))}" ${slides.length < 2 ? 'hidden' : ''}>${ICON.next}</button>`;
  document.body.appendChild(box);

  const img = box.querySelector('.lb__img');
  const text = box.querySelector('.lb__text');
  const count = box.querySelector('.lb__count');

  function show(i) {
    index = (i + slides.length) % slides.length;
    const s = slides[index];
    img.src = s.src || '';
    img.alt = s.alt || '';
    text.textContent = s.caption || '';
    count.textContent = slides.length > 1
      ? `${formatNumber(index + 1, lang)} ${t('gallery.counter', lang)} ${formatNumber(slides.length, lang)}`
      : '';
    // Warm the neighbours so arrows feel instant.
    [index + 1, index - 1].forEach(n => {
      const s2 = slides[(n + slides.length) % slides.length];
      if (s2.src) { const pre = new Image(); pre.src = s2.src; }
    });
  }

  const onKey = e => {
    if (e.key === 'Escape') { closeLightbox(); return; }
    const nextKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === nextKey) show(index + 1);
    if (e.key === prevKey) show(index - 1);
  };

  box.querySelector('.lb__close').addEventListener('click', closeLightbox);
  box.querySelector('.lb__prev').addEventListener('click', () => show(index - 1));
  box.querySelector('.lb__next').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', e => { if (e.target === box || e.target.classList.contains('lb__fig')) closeLightbox(); });
  document.addEventListener('keydown', onKey);

  // Touch swipe
  let startX = null;
  box.addEventListener('pointerdown', e => { startX = e.clientX; });
  box.addEventListener('pointerup', e => {
    if (startX == null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) < 40) return;
    const forward = rtl ? dx > 0 : dx < 0;
    show(forward ? index + 1 : index - 1);
  });

  const release = trapFocus(box);
  lockScroll(true);
  box._cleanup = () => {
    document.removeEventListener('keydown', onKey);
    release();
    lockScroll(false);
    if (opener && opener.focus) opener.focus();
  };

  show(index);
  box.querySelector('.lb__close').focus();
}

export function closeLightbox() {
  if (!box) return;
  box._cleanup();
  box.remove();
  box = null;
}
