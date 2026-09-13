/**
 * Yusr — the one place that loads content from data/*.json.
 * Every page reads through these functions; nothing else fetches JSON.
 * Results are cached for the life of the page.
 */

import { CONFIG, DEMO_MODE } from './config.js';
import { pick } from './i18n.js';

const cache = new Map();

function load(name) {
  if (!cache.has(name)) {
    const promise = fetch(`${CONFIG.dataDir}/${name}.json`, { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error(`${name}.json: HTTP ${res.status}`);
        return res.json();
      })
      .catch(err => {
        cache.delete(name); // allow a retry on the next call
        throw err;
      });
    cache.set(name, promise);
  }
  return cache.get(name);
}

const visible = item => item.visible !== false;
const bySort = (a, b) => (a.sort ?? 0) - (b.sort ?? 0);

/* ---------------------------------------------------------------- site -- */

/* -------------------------------------------------------------- demo -- */

const isBlank = v => v == null || v === '' || (Array.isArray(v) && v.length === 0);
const isPlainObject = v => v !== null && typeof v === 'object' && !Array.isArray(v);

/**
 * Deep-merge `demo` UNDER `real`: a real value always wins, demo only fills a blank.
 * Every dotted path that was filled from demo is recorded in `filled`.
 */
function mergeDemo(real, demo, path, filled) {
  const out = { ...(real || {}) };
  Object.keys(demo || {}).forEach(key => {
    const p = path ? `${path}.${key}` : key;
    const r = real ? real[key] : undefined;
    const d = demo[key];
    if (isPlainObject(r) && isPlainObject(d)) {
      out[key] = mergeDemo(r, d, p, filled);
    } else if (isBlank(r) && !isBlank(d)) {
      out[key] = d;
      filled[p] = true;
    } else {
      out[key] = r;
    }
  });
  return out;
}

/** True when the value at a dotted path (e.g. 'contact.whatsapp') came from demo data. */
export function isDemo(site, path) {
  return Boolean(site && site._demo && site._demo[path]);
}

/** Demo list used only when DEMO_MODE is on and the real list is empty. */
async function withDemoList(name, real) {
  if (!DEMO_MODE || real.length) return real;
  try {
    const demo = await load(`demo/${name}.demo`);
    return demo.filter(visible).map(item => ({ ...item, _demo: true }));
  } catch (_) { return real; }
}

export function getSite() {
  if (!DEMO_MODE) return load('site');
  return Promise.all([load('site'), load('demo/site.demo').catch(() => null)])
    .then(([real, demo]) => {
      if (!demo) return real;
      const filled = {};
      const merged = mergeDemo(real, demo, '', filled);
      merged._demo = filled;
      return merged;
    });
}

/* ---------------------------------------------------------- categories -- */

export async function getCategories({ includeHidden = false } = {}) {
  const list = await load('categories');
  return list.filter(c => includeHidden || visible(c)).sort(bySort);
}

export async function getCategory(id) {
  const list = await getCategories();
  return list.find(c => c.id === id) || null;
}

/** Map of subtype id → { ar, en } names across all categories (hidden ones included). */
export async function getSubtypeNames() {
  const list = await getCategories({ includeHidden: true });
  const map = {};
  list.forEach(c => (c.subtypes || []).forEach(s => { map[s.id] = s.name; }));
  return map;
}

/* --------------------------------------------------------- collections -- */

export async function getCollections() {
  const list = await load('collections');
  return list.filter(visible).sort(bySort);
}

export async function getCollection(id) {
  const list = await getCollections();
  return list.find(c => c.id === id) || null;
}

/* ------------------------------------------------------------ products -- */

/**
 * Normalise text for search: case, Arabic diacritics, alef/yaa/taa-marbuta variants.
 */
export function normalize(str) {
  return String(str || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, '')   // harakat, superscript alef, tatweel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

const SORTERS = {
  newest: (a, b) => {
    const da = Date.parse(a.added || '') || 0;
    const db = Date.parse(b.added || '') || 0;
    return db - da || b._index - a._index;
  },
  'price-asc': (a, b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0),
  'price-desc': (a, b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0),
  'lead-asc': (a, b) => (a.leadTimeDays ?? 999) - (b.leadTimeDays ?? 999)
};

export const SORT_KEYS = Object.keys(SORTERS);

async function searchHaystack(p, subtypeNames, categoryNames) {
  const parts = [
    p.sku,
    p.name?.ar, p.name?.en,
    p.short?.ar, p.short?.en,
    categoryNames[p.category]?.ar, categoryNames[p.category]?.en
  ];
  (p.tags || []).forEach(tag => {
    parts.push(tag, subtypeNames[tag]?.ar, subtypeNames[tag]?.en);
  });
  return normalize(parts.filter(Boolean).join(' '));
}

/**
 * Query products.
 * @param {object} q
 * @param {string}  [q.category]   category id ('all' or undefined = every category)
 * @param {string}  [q.tag]        subtype id
 * @param {string}  [q.collection] collection id
 * @param {boolean} [q.featured]   only featured pieces
 * @param {string}  [q.search]     free text (both languages are searched)
 * @param {string}  [q.sort]       newest | price-asc | price-desc | lead-asc
 * @param {number}  [q.limit]
 * @param {boolean} [q.includeHidden]
 */
export async function getProducts({
  category, tag, collection, featured, search, sort = 'newest', limit, includeHidden = false
} = {}) {
  const [raw, categories] = await Promise.all([load('products'), getCategories({ includeHidden: true })]);
  const hiddenCategories = new Set(categories.filter(c => !visible(c)).map(c => c.id));

  let list = raw.map((p, i) => ({ ...p, _index: i }));
  if (!includeHidden) list = list.filter(p => visible(p) && !hiddenCategories.has(p.category));
  if (category && category !== 'all') list = list.filter(p => p.category === category);
  if (tag) list = list.filter(p => (p.tags || []).includes(tag));
  if (collection) list = list.filter(p => (p.collections || []).includes(collection));
  if (featured) list = list.filter(p => p.featured === true);

  const query = normalize(search);
  if (query) {
    const subtypeNames = await getSubtypeNames();
    const categoryNames = Object.fromEntries(categories.map(c => [c.id, c.name]));
    const terms = query.split(' ');
    const scored = [];
    for (const p of list) {
      const hay = await searchHaystack(p, subtypeNames, categoryNames);
      if (terms.every(term => hay.includes(term))) {
        // Name matches rank above tag/description matches.
        const nameHit = normalize(`${pick(p.name, 'ar')} ${pick(p.name, 'en')}`).includes(query);
        scored.push({ p, score: nameHit ? 2 : 1 });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    list = scored.map(s => s.p);
  } else {
    list.sort(SORTERS[sort] || SORTERS.newest);
  }

  if (limit) list = list.slice(0, limit);
  return list;
}

export async function getProduct(id) {
  const list = await getProducts();
  return list.find(p => p.id === id) || null;
}

/* ------------------------------------------------------- simple lists -- */

export async function getFaq() {
  const list = await load('faq');
  return list.filter(visible).sort(bySort);
}

export async function getTestimonials() {
  const list = await load('testimonials');
  return withDemoList('testimonials', list.filter(visible));
}

export async function getGallery() {
  const list = await load('gallery');
  return withDemoList('gallery', list.filter(visible).sort(bySort));
}
