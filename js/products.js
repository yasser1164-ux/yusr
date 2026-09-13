/**
 * Yusr — products page: category chips → sub-type chips → sort, with the
 * whole filter state in the URL (?cat=&tag=&collection=&q=&sort=).
 */

import { ready, lang, onLangChange, siteData, applyMeta, markReady } from './main.js';
import { getCategories, getProducts, getCollection, SORT_KEYS } from './store.js';
import { t, pick, formatCount } from './i18n.js';
import { ICON, esc, productCard, revealWithin } from './ui.js';

await ready;

const $ = id => document.getElementById(id);
const grid = $('catalog-grid');
const catRow = $('filter-cats');
const tagRow = $('filter-tags');
const activeRow = $('filter-active');
const sortSel = $('sort');
const searchInput = $('catalog-search');
const count = $('catalog-count');
const empty = $('catalog-empty');
const heading = $('catalog-title');
const lead = $('catalog-lead');

const SORT_LABEL = { newest: 'sort.newest', 'price-asc': 'sort.priceAsc', 'price-desc': 'sort.priceDesc', 'lead-asc': 'sort.fastest' };

/* --------------------------------------------------------------- state -- */

function readState() {
  const p = new URLSearchParams(location.search);
  return {
    cat: p.get('cat') || 'all',
    tag: p.get('tag') || '',
    collection: p.get('collection') || '',
    q: (p.get('q') || '').trim(),
    sort: SORT_KEYS.includes(p.get('sort')) ? p.get('sort') : 'newest'
  };
}

function writeState(s) {
  const p = new URLSearchParams(location.search);
  const set = (k, v, def = '') => (v && v !== def ? p.set(k, v) : p.delete(k));
  set('cat', s.cat, 'all');
  set('tag', s.tag);
  set('collection', s.collection);
  set('q', s.q);
  set('sort', s.sort, 'newest');
  history.replaceState(null, '', `${location.pathname}?${p.toString()}`);
}

let state = readState();
let categories = [];

/* ------------------------------------------------------------- render -- */

function chip(label, { pressed = false, data = {}, className = '' } = {}) {
  const attrs = Object.entries(data).map(([k, v]) => ` data-${k}="${esc(v)}"`).join('');
  return `<button type="button" class="chip chip--filter ${className}" aria-pressed="${pressed}"${attrs}>${esc(label)}</button>`;
}

function renderCategoryChips(l) {
  catRow.innerHTML = [
    chip(t('common.all', l), { pressed: state.cat === 'all', data: { cat: 'all' } }),
    ...categories.map(c => chip(pick(c.name, l), { pressed: state.cat === c.id, data: { cat: c.id } }))
  ].join('');
  // Keep the active chip in view inside the horizontal scroller.
  const active = catRow.querySelector('[aria-pressed="true"]');
  if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest', inline: 'center' });
}

function renderTagChips(l) {
  const cat = categories.find(c => c.id === state.cat);
  const subtypes = (cat && cat.subtypes) || [];
  tagRow.hidden = subtypes.length === 0;
  if (!subtypes.length) { tagRow.innerHTML = ''; return; }
  tagRow.innerHTML = [
    chip(t('common.all', l), { pressed: !state.tag, data: { tag: '' }, className: 'chip--sub' }),
    ...subtypes.map(s => chip(pick(s.name, l), { pressed: state.tag === s.id, data: { tag: s.id }, className: 'chip--sub' }))
  ].join('');
}

async function renderActive(l) {
  const parts = [];
  if (state.collection) {
    const col = await getCollection(state.collection);
    parts.push(`<span class="chip chip--active">${esc(col ? pick(col.name, l) : state.collection)}<button type="button" class="chip__x" data-clear="collection" aria-label="${esc(t('common.clear', l))}">${ICON.close}</button></span>`);
  }
  if (state.q) {
    parts.push(`<span class="chip chip--active">“${esc(state.q)}”<button type="button" class="chip__x" data-clear="q" aria-label="${esc(t('common.clear', l))}">${ICON.close}</button></span>`);
  }
  activeRow.hidden = parts.length === 0;
  activeRow.innerHTML = parts.join('');
}

function renderSort(l) {
  const current = sortSel.value || state.sort;
  sortSel.innerHTML = SORT_KEYS.map(k => `<option value="${k}">${esc(t(SORT_LABEL[k], l))}</option>`).join('');
  sortSel.value = SORT_KEYS.includes(current) ? current : 'newest';
  sortSel.disabled = Boolean(state.q); // search results are ranked by relevance
}

function renderHeading(l) {
  const cat = categories.find(c => c.id === state.cat);
  heading.textContent = cat ? pick(cat.name, l) : t('products.title', l);
  lead.textContent = cat && pick(cat.blurb, l) ? pick(cat.blurb, l) : t('products.lead', l);
  applyMeta(cat ? { title: `${pick(cat.name, l)} | ${t('brand.name', l)}` } : {});
}

async function renderGrid(l) {
  const site = siteData();
  let list = [];
  try {
    list = await getProducts({
      category: state.cat, tag: state.tag, collection: state.collection, search: state.q, sort: state.sort
    });
  } catch (err) {
    grid.innerHTML = `<div class="notice notice--warn"><p>${esc(t('common.loadError', l))}</p><p class="muted">${esc(t('common.loadErrorHint', l))}</p></div>`;
    count.textContent = '';
    return;
  }
  const catNames = Object.fromEntries(categories.map(c => [c.id, pick(c.name, l)]));
  grid.innerHTML = list.map((p, i) => productCard(p, {
    lang: l, badges: site.badges, categoryName: state.cat === 'all' ? catNames[p.category] : '', eager: i < 3, priority: i === 0
  })).join('');
  grid.removeAttribute('data-loading');
  count.textContent = list.length ? formatCount(list.length, l) : t('common.noResults', l);
  empty.hidden = list.length > 0;
  revealWithin(grid);
}

async function render() {
  const l = lang();
  if (searchInput && searchInput.value !== state.q) searchInput.value = state.q;
  renderHeading(l);
  renderCategoryChips(l);
  renderTagChips(l);
  renderSort(l);
  await Promise.all([renderActive(l), renderGrid(l)]);
}

/* ------------------------------------------------------------- events -- */

catRow.addEventListener('click', e => {
  const btn = e.target.closest('[data-cat]');
  if (!btn) return;
  state.cat = btn.dataset.cat;
  state.tag = '';
  writeState(state);
  render();
});

tagRow.addEventListener('click', e => {
  const btn = e.target.closest('[data-tag]');
  if (!btn) return;
  state.tag = btn.dataset.tag;
  writeState(state);
  render();
});

activeRow.addEventListener('click', e => {
  const btn = e.target.closest('[data-clear]');
  if (!btn) return;
  state[btn.dataset.clear] = '';
  writeState(state);
  render();
});

sortSel.addEventListener('change', () => {
  state.sort = sortSel.value;
  writeState(state);
  renderGrid(lang());
});

if (searchInput) {
  let timer = null;
  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.q = searchInput.value.trim();
      writeState(state);
      render();
    }, 150);
  });
}

empty.querySelector('[data-clear-all]')?.addEventListener('click', () => {
  state = { cat: 'all', tag: '', collection: '', q: '', sort: 'newest' };
  writeState(state);
  render();
});

window.addEventListener('popstate', () => { state = readState(); render(); });

/* ---------------------------------------------------------------- init -- */

try { categories = await getCategories(); } catch (_) { categories = []; }
if (state.cat !== 'all' && !categories.some(c => c.id === state.cat)) state.cat = 'all';
render().then(markReady);
onLangChange(render);
