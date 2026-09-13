/**
 * Yusr — full-screen search overlay. Client-side, over data/products.json,
 * in the active language. Keyboard: Escape closes, Tab is trapped, Enter
 * on the input opens the full results on the products page.
 */

import { CONFIG } from './config.js';
import { t, pick, formatPrice, formatNumber } from './i18n.js';
import { getProducts, getCategories } from './store.js';
import { ICON, esc, picture, trapFocus, lockScroll } from './ui.js';

export function mountSearch({ lang, onLangChange, applyI18n }) {
  const opener = document.getElementById('search-open');
  if (!opener) return;

  const overlay = document.createElement('div');
  overlay.className = 'search';
  overlay.id = 'search-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'search-title');
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="search__panel">
      <div class="container">
        <div class="search__top">
          <h2 class="search__title" id="search-title" data-i18n="search.title"></h2>
          <button type="button" class="icon-btn" id="search-close" data-i18n-attr="aria-label:search.close">${ICON.close}</button>
        </div>
        <form class="search__bar" id="search-form" role="search">
          <label class="visually-hidden" for="search-input" data-i18n="search.title"></label>
          ${ICON.search}
          <input type="search" id="search-input" autocomplete="off" autocapitalize="off" spellcheck="false"
                 data-i18n-attr="placeholder:search.placeholder" aria-describedby="search-status">
        </form>
        <p class="search__status" id="search-status" role="status" aria-live="polite"></p>
        <ul class="search__results" id="search-results"></ul>
        <p class="search__more"><a class="btn btn--ghost btn--sm" id="search-all" href="products.html" hidden><span data-i18n="search.seeAll"></span>${ICON.arrow}</a></p>
        <div class="search__quick" id="search-quick"></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('#search-input');
  const status = overlay.querySelector('#search-status');
  const results = overlay.querySelector('#search-results');
  const seeAll = overlay.querySelector('#search-all');
  const quick = overlay.querySelector('#search-quick');
  const closeBtn = overlay.querySelector('#search-close');
  const form = overlay.querySelector('#search-form');

  let release = null;
  let lastFocus = null;
  let timer = null;
  let requestId = 0;

  async function renderQuick() {
    const l = lang();
    let cats = [];
    try { cats = await getCategories(); } catch (_) { /* no data */ }
    if (!cats.length) { quick.innerHTML = ''; return; }
    quick.innerHTML = `
      <p class="search__quick-label" data-i18n="search.quick"></p>
      <div class="chips">${cats.map(c => `
        <a class="chip chip--filter" href="products.html?cat=${encodeURIComponent(c.id)}">${esc(pick(c.name, l))}</a>`).join('')}
      </div>`;
    applyI18n(quick);
  }

  function resultItem(p, l) {
    return `
      <li>
        <a class="sres" href="product.html?id=${encodeURIComponent(p.id)}">
          ${picture(p.images && p.images[0], { lang: l, ratio: '1 / 1', className: 'sres__img' })}
          <span class="sres__body">
            <span class="sres__name">${esc(pick(p.name, l))}</span>
            <span class="sres__price">${esc(t('common.from', l))} ${formatPrice(p.priceFrom, l)}</span>
          </span>
          ${ICON.arrow}
        </a>
      </li>`;
  }

  async function runSearch() {
    const q = input.value.trim();
    const l = lang();
    const id = ++requestId;

    if (!q) {
      results.innerHTML = '';
      status.textContent = '';
      seeAll.hidden = true;
      quick.hidden = false;
      return;
    }

    let list = [];
    try { list = await getProducts({ search: q, limit: CONFIG.searchResultLimit }); } catch (_) { list = []; }
    if (id !== requestId) return; // a newer query finished first

    quick.hidden = true;
    if (!list.length) {
      results.innerHTML = '';
      status.textContent = t('search.noResults', l);
      seeAll.hidden = true;
      return;
    }
    results.innerHTML = list.map(p => resultItem(p, l)).join('');
    status.textContent = `${formatNumber(list.length, l)} ${t('search.results', l)}`;
    seeAll.href = `products.html?q=${encodeURIComponent(q)}`;
    seeAll.hidden = list.length < CONFIG.searchResultLimit;
  }

  function open() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('search-open');
    lockScroll(true);
    release = trapFocus(overlay);
    renderQuick();
    requestAnimationFrame(() => input.focus());
  }

  function close() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove('search-open');
    lockScroll(false);
    if (release) { release(); release = null; }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  opener.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hidden) close();
    // "/" opens search from anywhere outside a field.
    if (e.key === '/' && overlay.hidden && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)) {
      e.preventDefault(); open();
    }
  });

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(runSearch, CONFIG.searchDebounceMs);
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) location.href = `products.html?q=${encodeURIComponent(q)}`;
  });

  onLangChange(() => {
    applyI18n(overlay);
    if (!overlay.hidden) { renderQuick(); runSearch(); }
  });
  applyI18n(overlay);
}
