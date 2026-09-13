/**
 * Yusr — product detail page (product.html?id=…): breadcrumbs, gallery with
 * lightbox, price + lead time + badges, option selectors that feed the order
 * link, specs table and related pieces.
 */

import { CONFIG } from './config.js';
import { ready, lang, onLangChange, siteData, applyI18n, applyMeta, markReady } from './main.js';
import { getProduct, getProducts, getCategory, getCategories } from './store.js';
import { t, pick, formatPrice, formatDays, formatNumber } from './i18n.js';
import { ICON, esc, picture, productCard, leadChip, badgeChips, revealWithin, demoImage } from './ui.js';
import { openLightbox } from './gallery.js';

await ready;

const root = document.getElementById('product-detail');
const relatedRoot = document.getElementById('related');
const id = new URLSearchParams(location.search).get('id');

function specRow(label, value) {
  return value ? `<div class="specs__row"><dt>${esc(label)}</dt><dd>${value}</dd></div>` : '';
}

function optionField(kind, values, l) {
  if (!values || !values.length) return '';
  const labelKey = kind === 'material' ? 'product.materialOpt' : `product.${kind}`;
  return `
    <p class="field">
      <label class="field__label" for="opt-${kind}">${esc(t(labelKey, l))}</label>
      <select class="field__input" id="opt-${kind}" data-option="${kind}">
        ${values.map(v => `<option value="${esc(pick(v, l))}">${esc(pick(v, l))}</option>`).join('')}
      </select>
    </p>`;
}

async function render() {
  const l = lang();
  const site = siteData();
  const p = id ? await getProduct(id).catch(() => null) : null;
  root.removeAttribute('data-loading');

  if (!p) {
    root.innerHTML = `
      <div class="notice notice--warn">
        <p>${esc(t('product.notFound', l))}</p>
        <p><a class="btn btn--primary btn--sm" href="products.html">${ICON.back}<span>${esc(t('common.backToProducts', l))}</span></a></p>
      </div>`;
    if (relatedRoot) relatedRoot.hidden = true;
    return;
  }

  const category = await getCategory(p.category);
  const name = pick(p.name, l);
  const images = (p.images || []).filter(i => i && i.src);
  const slides = images.map(i => ({ src: i.src, alt: pick(i.alt, l) || name, caption: name }));
  const colors = (p.specs?.colors || []).map(c => pick(c, l)).join(l === 'ar' ? '، ' : ', ');
  const priceNote = pick(p.priceNote, l) || t('product.priceNote', l);

  root.innerHTML = `
    <nav class="crumbs" aria-label="${esc(t('product.breadcrumb', l))}">
      <ol>
        <li><a href="index.html">${esc(t('nav.home', l))}</a></li>
        <li><a href="products.html">${esc(t('nav.products', l))}</a></li>
        ${category ? `<li><a href="products.html?cat=${encodeURIComponent(category.id)}">${esc(pick(category.name, l))}</a></li>` : ''}
        <li aria-current="page">${esc(name)}</li>
      </ol>
    </nav>

    <div class="detail">
      <div class="detail__gallery">
        <figure class="pgal" aria-label="${esc(t('product.gallery', l))}">
          <button type="button" class="pgal__main" id="pgal-main" aria-label="${esc(t('gallery.open', l))}" ${images.length ? '' : 'disabled'}>
            ${picture(images[0], { lang: l, ratio: '4 / 3', eager: true, sizes: '(min-width: 900px) 55vw, 100vw', demoSrc: demoImage(p.category) })}
            ${images.length ? `<span class="pgal__zoom">${ICON.zoom}</span>` : ''}
          </button>
          ${images.length > 1 ? `
          <div class="pgal__thumbs">
            ${images.map((img, i) => `
              <button type="button" class="pgal__thumb" data-index="${i}" aria-pressed="${i === 0}" aria-label="${esc(t('product.thumbAlt', l))} ${formatNumber(i + 1, l)}">
                ${picture(img, { lang: l, ratio: '4 / 3', demoSrc: demoImage(p.category) })}
              </button>`).join('')}
          </div>` : ''}
        </figure>
      </div>

      <div class="detail__info">
        ${category ? `<a class="chip chip--soft" href="products.html?cat=${encodeURIComponent(category.id)}">${esc(pick(category.name, l))}</a>` : ''}
        <h1 class="detail__title">${esc(name)}</h1>
        ${p.sku ? `<p class="detail__sku muted small">${esc(t('product.sku', l))}: <span dir="ltr">${esc(p.sku)}</span></p>` : ''}

        <p class="detail__price">
          <span class="muted">${esc(t('common.from', l))}</span> <strong>${formatPrice(p.priceFrom, l)}</strong>
          ${p.priceTo ? `<span class="muted">${esc(t('common.to', l))}</span> <strong>${formatPrice(p.priceTo, l)}</strong>` : ''}
        </p>
        <p class="muted small">${esc(priceNote)}</p>
        <p class="detail__chips">${leadChip(p.leadTimeDays, l)}${badgeChips(p.badges, site.badges, l)}</p>

        <p class="detail__desc">${esc(pick(p.description, l))}</p>

        <form class="detail__options" id="product-options">
          <h2 class="h5">${esc(t('product.options', l))}</h2>
          ${optionField('size', p.options?.size, l)}
          ${optionField('color', p.options?.color, l)}
          ${optionField('material', p.options?.material, l)}
          <a class="btn btn--primary btn--block" id="order-this" href="custom.html?product=${encodeURIComponent(p.id)}">
            ${ICON.whatsapp}<span>${esc(t('common.orderThis', l))}</span>
          </a>
        </form>

        <h2 class="h5">${esc(t('product.specs', l))}</h2>
        <dl class="specs">
          ${specRow(t('product.dimensions', l), esc(pick(p.specs?.dimensions, l)))}
          ${specRow(t('product.material', l), esc(pick(p.specs?.material, l)))}
          ${specRow(t('product.colors', l), esc(colors))}
          ${specRow(t('product.leadTime', l), p.leadTimeDays ? formatDays(p.leadTimeDays, l) : '')}
          ${specRow(t('product.warranty', l), p.specs?.warrantyYears ? `${formatNumber(p.specs.warrantyYears, l)} ${esc(t('common.years', l))}` : '')}
        </dl>
      </div>
    </div>`;

  applyMeta({ title: `${name} | ${t('brand.name', l)}`, description: pick(p.short, l) });

  // Each product gets its own canonical URL so search engines index it, not the bare page.
  const canonicalHref = new URL(`product.html?id=${encodeURIComponent(p.id)}`, location.href).href;
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
  canonical.href = canonicalHref;
  const ogUrl = document.head.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', canonicalHref);

  // Gallery
  const main = root.querySelector('#pgal-main');
  let current = 0;
  root.querySelectorAll('.pgal__thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      current = Number(btn.dataset.index);
      main.querySelector('.img-box').outerHTML = picture(images[current], { lang: l, ratio: '4 / 3', eager: true, demoSrc: demoImage(p.category) });
      root.querySelectorAll('.pgal__thumb').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    });
  });
  if (images.length) main.addEventListener('click', () => openLightbox(slides, current, { lang: l }));

  // Order link mirrors the chosen options.
  const form = root.querySelector('#product-options');
  const orderLink = root.querySelector('#order-this');
  const syncOrderLink = () => {
    const params = new URLSearchParams({ product: p.id });
    form.querySelectorAll('[data-option]').forEach(sel => { if (sel.value) params.set(sel.dataset.option, sel.value); });
    params.set('lang', lang());
    orderLink.href = `custom.html?${params.toString()}`;
  };
  form.addEventListener('change', syncOrderLink);
  syncOrderLink();

  await renderRelated(p, l, site);
  revealWithin(document);
}

async function renderRelated(p, l, site) {
  if (!relatedRoot) return;
  let list = [];
  try {
    list = (await getProducts({ category: p.category })).filter(x => x.id !== p.id).slice(0, CONFIG.relatedLimit);
  } catch (_) { list = []; }
  relatedRoot.hidden = list.length === 0;
  if (!list.length) return;
  relatedRoot.innerHTML = `
    <div class="container">
      <h2 class="sec-head__title sec-head__title--sm">${esc(t('product.related', l))}</h2>
      <div class="grid grid--3">${list.map(x => productCard(x, { lang: l, badges: site.badges })).join('')}</div>
    </div>`;
}

render().then(markReady);
onLangChange(render);
