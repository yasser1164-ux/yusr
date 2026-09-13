/**
 * Yusr — homepage sections rendered from data/: hero, category tiles,
 * featured products, our-work gallery, testimonials (only when present), FAQ.
 * Static copy sections (Why Yusr, How it works, final CTA) live in index.html.
 */

import { CONFIG } from './config.js';
import { ready, lang, onLangChange, siteData, applyI18n, initAccordions, markReady } from './main.js';
import { getCategories, getProducts, getCollections, getFaq, getGallery, getTestimonials } from './store.js';
import { t, pick } from './i18n.js';
import { ICON, esc, picture, productCard, sectionHead, revealWithin, icon } from './ui.js';
import { galleryMarkup, bindGallery } from './gallery.js';

await ready;

const $ = id => document.getElementById(id);

/* ---------------------------------------------------------------- hero -- */

function renderHero(l) {
  const root = $('hero');
  if (!root) return;
  const site = siteData();
  const hero = site.hero || {};
  const image = hero.image && hero.image.src ? hero.image : null;

  const title = pick(hero.title, l) || pick(site.brand?.tagline, l) || t('brand.tagline', l);
  const subtitle = pick(hero.subtitle, l);
  const eyebrow = pick(hero.eyebrow, l) || t('common.madeIn', l);

  root.classList.toggle('hero--pattern', !image);
  root.innerHTML = `
    ${image ? `<div class="hero__media">${picture(image, { lang: l, ratio: '16 / 9', eager: true, priority: true, sizes: '100vw' })}</div>` : ''}
    <div class="hero__overlay" aria-hidden="true"></div>
    <div class="container hero__content">
      <p class="eyebrow eyebrow--light">${esc(eyebrow)}</p>
      <h1 class="hero__title">${esc(title)}</h1>
      ${subtitle ? `<p class="hero__text">${esc(subtitle)}</p>` : ''}
      <div class="btn-row">
        <a class="btn btn--sand" href="products.html">${esc(t('common.browse', l))}</a>
        <a class="btn btn--ghost-light" href="custom.html">${esc(t('common.customCta', l))}</a>
      </div>
    </div>`;
}

/* ---------------------------------------------------------- categories -- */

async function renderCategories(l) {
  const section = $('categories');
  if (!section) return;
  let cats = [];
  try { cats = await getCategories(); } catch (_) { cats = []; }
  section.removeAttribute('data-loading');
  section.hidden = cats.length === 0;
  if (!cats.length) return;

  section.innerHTML = `
    <div class="container">
      ${sectionHead({ eyebrow: t('home.categories.eyebrow', l), title: t('home.categories.title', l), text: t('home.categories.text', l) })}
      <div class="tiles">
        ${cats.map((c, i) => `
          <a class="tile reveal${i === 0 ? ' tile--wide' : ''}" href="products.html?cat=${encodeURIComponent(c.id)}">
            ${picture(c.image, { lang: l, ratio: i === 0 ? '16 / 10' : '1 / 1', className: 'tile__img', sizes: i === 0 ? '(min-width: 1024px) 400px, 100vw' : '(min-width: 1024px) 400px, 50vw' })}
            <span class="tile__body">
              <span class="tile__icon">${icon(c.icon)}</span>
              <span class="tile__name">${esc(pick(c.name, l))}</span>
              <span class="tile__blurb">${esc(pick(c.blurb, l))}</span>
            </span>
          </a>`).join('')}
      </div>
    </div>`;
  revealWithin(section);
}

/* ------------------------------------------------------------ featured -- */

async function renderFeatured(l) {
  const section = $('featured');
  if (!section) return;
  const site = siteData();
  let list = [], cats = [], collections = [];
  try {
    [list, cats, collections] = await Promise.all([
      getProducts({ featured: true, limit: CONFIG.featuredLimit }),
      getCategories(),
      getCollections()
    ]);
  } catch (_) { list = []; }
  section.removeAttribute('data-loading');
  section.hidden = list.length === 0;
  if (!list.length) return;

  const catNames = Object.fromEntries(cats.map(c => [c.id, pick(c.name, l)]));
  const chips = collections.length ? `
    <div class="chips chips--center reveal">
      ${collections.map(c => `<a class="chip chip--filter" href="products.html?collection=${encodeURIComponent(c.id)}">${esc(pick(c.name, l))}</a>`).join('')}
    </div>` : '';

  section.innerHTML = `
    <div class="container">
      ${sectionHead({ eyebrow: t('home.featured.eyebrow', l), title: t('home.featured.title', l), text: t('home.featured.text', l) })}
      ${chips}
      <div class="grid grid--3">
        ${list.map((p, i) => productCard(p, { lang: l, badges: site.badges, categoryName: catNames[p.category], eager: i < 3, priority: i === 0 })).join('')}
      </div>
      <p class="btn-row btn-row--center reveal">
        <a class="btn btn--primary" href="products.html">${esc(t('common.viewAll', l))}${ICON.arrow}</a>
      </p>
    </div>`;
  revealWithin(section);
}

/* ------------------------------------------------------------- gallery -- */

async function renderWork(l) {
  const section = $('work');
  if (!section) return;
  let items = [], cats = [];
  try { [items, cats] = await Promise.all([getGallery(), getCategories({ includeHidden: true })]); } catch (_) { items = []; }
  section.hidden = items.length === 0;
  if (!items.length) return;

  const categoryNames = Object.fromEntries(cats.map(c => [c.id, c.name]));
  section.innerHTML = `
    <div class="container">
      ${sectionHead({ eyebrow: t('home.gallery.eyebrow', l), title: t('home.gallery.title', l), text: t('home.gallery.text', l) })}
    </div>
    <div class="container container--bleed">
      ${galleryMarkup(items, { lang: l, categoryNames })}
    </div>`;
  bindGallery(section, items, { lang: l, categoryNames });
  revealWithin(section);
}

/* -------------------------------------------------------- testimonials -- */

async function renderTestimonials(l) {
  const section = $('testimonials');
  if (!section) return;
  let items = [];
  try { items = await getTestimonials(); } catch (_) { items = []; }
  section.hidden = items.length === 0;
  if (!items.length) return;

  section.innerHTML = `
    <div class="container">
      ${sectionHead({ eyebrow: t('home.testimonials.eyebrow', l), title: t('home.testimonials.title', l) })}
      <div class="grid grid--3">
        ${items.map(q => `
          <figure class="quote reveal">
            <blockquote>${esc(pick(q.text, l))}</blockquote>
            <figcaption><strong>${esc(pick(q.name, l))}</strong>${q.city ? `<span>${esc(pick(q.city, l))}</span>` : ''}</figcaption>
          </figure>`).join('')}
      </div>
    </div>`;
  revealWithin(section);
}

/* ----------------------------------------------------------------- FAQ -- */

async function renderFaq(l) {
  const section = $('faq');
  if (!section) return;
  let items = [];
  try { items = await getFaq(); } catch (_) { items = []; }
  items = items.slice(0, CONFIG.faqLimit);
  section.hidden = items.length === 0;
  if (!items.length) return;

  section.innerHTML = `
    <div class="container container--narrow">
      ${sectionHead({ eyebrow: t('home.faq.eyebrow', l), title: t('home.faq.title', l) })}
      <div class="acc reveal">
        ${items.map((f, i) => `
          <div class="acc__item">
            <h3 class="acc__h"><button type="button" class="acc__trigger" id="faq-t${i}" aria-expanded="false" aria-controls="faq-p${i}">
              <span>${esc(pick(f.q, l))}</span>${ICON.chevron}
            </button></h3>
            <div class="acc__panel" id="faq-p${i}" role="region" aria-labelledby="faq-t${i}" hidden><p>${esc(pick(f.a, l))}</p></div>
          </div>`).join('')}
      </div>
    </div>`;
  initAccordions(section);
  revealWithin(section);
}

/* ------------------------------------------------- background rhythm -- */

/** Off-white → sand → off-white over the *visible* sections, so hiding one never leaves two sand blocks adjacent. */
function alternateSections() {
  const sections = [...document.querySelectorAll('main > section.section')].filter(s => !s.hidden);
  sections.forEach((s, i) => s.classList.toggle('section--sand', i % 2 === 1));
}

/* ---------------------------------------------------------------- run -- */

async function render() {
  const l = lang();
  renderHero(l);
  await Promise.all([renderCategories(l), renderFeatured(l), renderWork(l), renderTestimonials(l), renderFaq(l)]);
  applyI18n(document);
  alternateSections();
  revealWithin(document);
}

render().then(markReady);
onLangChange(render);
