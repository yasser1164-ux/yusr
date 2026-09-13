/**
 * Yusr — the request form on custom.html.
 * Validates, composes a message in the active language, then opens WhatsApp.
 * With no WhatsApp number configured it falls back to e-mail, and with neither
 * it shows the message with a copy button — never a dead link.
 */

import { ready, lang, onLangChange, siteData, applyI18n, waLink, mailLink, waNumber, markReady, isDemoValue, DEMO_HREF } from './main.js';
import { getCategories, getProduct } from './store.js';
import { t, pick } from './i18n.js';
import { ICON, esc } from './ui.js';

await ready;

const form = document.getElementById('request-form');
const BUDGETS = ['a', 'b', 'c', 'd', 'e'];
const TIMES = ['morning', 'afternoon', 'evening', 'any'];
const SAUDI_MOBILE = /^(?:(?:\+|00)?966|0)?5\d{8}$/;

let categories = [];
let product = null;
let productOptions = '';

/* ------------------------------------------------------------- selects -- */

function fillSelect(select, items, placeholderKey) {
  if (!select) return;
  const l = lang();
  const previous = select.value;
  const placeholder = placeholderKey
    ? `<option value="" disabled ${previous ? '' : 'selected'}>${esc(t(placeholderKey, l))}</option>`
    : '';
  select.innerHTML = placeholder + items.map(({ value, label }) => `<option value="${esc(value)}">${esc(label)}</option>`).join('');
  if (previous) select.value = previous;
}

function fillAllSelects() {
  const l = lang();
  const cities = (siteData().cities || []).map(c => ({ value: c.id, label: pick(c.name, l) }));
  cities.push({ value: 'other', label: t('form.cityOther', l) });
  fillSelect(form.querySelector('#f-city'), cities, 'form.cityPh');
  fillSelect(form.querySelector('#f-category'), categories.map(c => ({ value: c.id, label: pick(c.name, l) })), 'form.categoryPh');
  fillSelect(form.querySelector('#f-budget'), BUDGETS.map(k => ({ value: k, label: t(`form.budgetRanges.${k}`, l) })), 'form.budgetPh');
  fillSelect(form.querySelector('#f-time'), TIMES.map(k => ({ value: k, label: t(`form.time.${k}`, l) })), null);
}

/* ---------------------------------------------------------- validation -- */

function normalisePhone(raw) {
  const digits = raw.replace(/[\s()\-]/g, '').replace(/^\+/, '');
  return `966${digits.replace(/^(00966|966|0)/, '')}`;
}

function setError(field, key) {
  const wrap = field.closest('.field');
  const el = wrap && wrap.querySelector('.field__error');
  field.setAttribute('aria-invalid', 'true');
  if (el) { el.dataset.i18n = key; el.textContent = t(key, lang()); el.hidden = false; }
}

function clearError(field) {
  const wrap = field.closest('.field');
  const el = wrap && wrap.querySelector('.field__error');
  field.removeAttribute('aria-invalid');
  if (el) el.hidden = true;
}

function validate() {
  const problems = [];
  const check = (sel, test, key) => {
    const field = form.querySelector(sel);
    if (!field) return;
    if (test(field.value.trim())) clearError(field);
    else { setError(field, key); problems.push(field); }
  };
  check('#f-name', v => v.length >= 2, 'form.nameErr');
  check('#f-city', v => v !== '', 'form.cityErr');
  check('#f-phone', v => SAUDI_MOBILE.test(v.replace(/[\s\-()]/g, '')), 'form.phoneErr');
  check('#f-category', v => v !== '', 'form.categoryErr');
  check('#f-description', v => v.length >= 10, 'form.descriptionErr');
  check('#f-ref', v => v === '' || /^https?:\/\/\S+$/i.test(v), 'form.refErr');
  return problems;
}

/* ------------------------------------------------------------- message -- */

const value = sel => { const el = form.querySelector(sel); return el ? el.value.trim() : ''; };

function cityLabel(id, l) {
  if (id === 'other') return t('form.cityOther', l);
  const c = (siteData().cities || []).find(x => x.id === id);
  return c ? pick(c.name, l) : id;
}

function buildMessage() {
  const l = lang();
  const m = key => t(`waMsg.${key}`, l);
  const none = m('notSpecified');
  const cat = categories.find(c => c.id === value('#f-category'));

  const lines = [
    m('title'),
    '——————',
    `${m('name')}: ${value('#f-name')}`,
    `${m('city')}: ${cityLabel(value('#f-city'), l)}`,
    `${m('phone')}: ${normalisePhone(value('#f-phone'))}`,
    `${m('category')}: ${cat ? pick(cat.name, l) : value('#f-category')}`
  ];
  if (product) lines.push(`${m('product')}: ${pick(product.name, l)}${product.sku ? ` (${product.sku})` : ''}`);
  if (productOptions) lines.push(`${m('options')}: ${productOptions}`);
  lines.push(`${m('description')}: ${value('#f-description')}`);

  const w = value('#f-width'), d = value('#f-depth'), h = value('#f-height');
  const dims = (w || d || h) ? `${w || '?'} × ${d || '?'} × ${h || '?'} ${l === 'ar' ? 'سم' : 'cm'}` : none;
  lines.push(`${m('dims')}: ${dims}`);
  lines.push(`${m('material')}: ${value('#f-material') || none}`);
  const budget = value('#f-budget');
  lines.push(`${m('budget')}: ${budget ? t(`form.budgetRanges.${budget}`, l) : none}`);
  if (value('#f-ref')) lines.push(`${m('ref')}: ${value('#f-ref')}`);
  const time = value('#f-time');
  lines.push(`${m('contactTime')}: ${time ? t(`form.time.${time}`, l) : none}`);
  return lines.join('\n');
}

/* ------------------------------------------------------------- prefill -- */

function optionsFromUrl(l) {
  const params = new URLSearchParams(location.search);
  const parts = [];
  if (params.get('size')) parts.push(`${t('product.size', l)}: ${params.get('size')}`);
  if (params.get('color')) parts.push(`${t('product.color', l)}: ${params.get('color')}`);
  if (params.get('material')) parts.push(`${t('product.materialOpt', l)}: ${params.get('material')}`);
  return parts.join(' · ');
}

async function prefill() {
  const params = new URLSearchParams(location.search);
  const productId = params.get('product');
  const notice = document.getElementById('prefill-notice');
  const label = document.getElementById('prefill-product');
  if (!productId) return;

  product = await getProduct(productId).catch(() => null);
  const l = lang();
  productOptions = optionsFromUrl(l);
  const name = product ? pick(product.name, l) : productId;
  if (label) label.textContent = productOptions ? `${name} — ${productOptions}` : name;
  if (notice) notice.hidden = false;

  if (product) {
    const cat = form.querySelector('#f-category');
    if (cat) cat.value = product.category;
    const desc = form.querySelector('#f-description');
    if (desc && !desc.value) desc.value = l === 'ar' ? `أرغب بطلب: ${name}. ` : `I would like to order: ${name}. `;
  }
}

/* ---------------------------------------------------------------- flow -- */

function channel() {
  if (waNumber()) return 'wa';
  if (siteData().contact?.email) return 'mail';
  return 'copy';
}

function renderSubmitLabel() {
  const span = form.querySelector('#submit-label');
  const key = { wa: 'custom.submit', mail: 'custom.submitMail', copy: 'custom.submitCopy' }[channel()];
  span.dataset.i18n = key;
  span.textContent = t(key, lang());
}

function init() {
  fillAllSelects();
  renderSubmitLabel();
  prefill();

  onLangChange(() => {
    fillAllSelects();
    renderSubmitLabel();
    if (product) {
      const l = lang();
      productOptions = optionsFromUrl(l);
      const label = document.getElementById('prefill-product');
      const name = pick(product.name, l);
      if (label) label.textContent = productOptions ? `${name} — ${productOptions}` : name;
    }
    form.querySelectorAll('.field__error:not([hidden])').forEach(el => {
      if (el.dataset.i18n) el.textContent = t(el.dataset.i18n, lang());
    });
  });

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('change', () => clearError(field));
  });

  const summary = document.getElementById('form-error-summary');
  const success = document.getElementById('form-success');
  const successText = document.getElementById('success-text');
  const waBtn = document.getElementById('success-wa');
  const mailBtn = document.getElementById('success-mail');
  const copyBtn = document.getElementById('success-copy');
  const preview = document.getElementById('message-preview');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const problems = validate();
    if (problems.length) {
      summary.hidden = false;
      applyI18n(summary);
      problems[0].focus();
      return;
    }
    summary.hidden = true;

    const message = buildMessage();
    const wa = waLink(message);
    const mail = mailLink(t('waMsg.title', lang()), message);
    const waDemo = isDemoValue('contact.whatsapp');
    const mailDemo = isDemoValue('contact.email');
    // In demo mode nothing is ever sent: buttons become inert and the message is shown to copy.
    const mode = (channel() === 'wa' && waDemo) || (channel() === 'mail' && mailDemo) ? 'copy' : channel();

    waBtn.hidden = !wa;
    mailBtn.hidden = !mail;
    if (wa) waBtn.href = waDemo ? DEMO_HREF : wa;
    if (mail) mailBtn.href = mailDemo ? DEMO_HREF : mail;
    waBtn.toggleAttribute('data-demo-link', waDemo);
    mailBtn.toggleAttribute('data-demo-link', mailDemo);
    preview.value = message;
    preview.hidden = mode === 'wa';
    copyBtn.hidden = mode === 'wa';
    successText.dataset.i18n = mode === 'wa' ? 'custom.successWa' : 'custom.successCopy';

    success.hidden = false;
    form.hidden = true;
    applyI18n(success);
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    success.querySelector('h2').focus();

    if (mode === 'wa') window.open(wa, '_blank', 'noopener');
    else if (mode === 'mail') location.href = mail;
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(preview.value);
    } catch (_) {
      preview.hidden = false; preview.select(); document.execCommand && document.execCommand('copy');
    }
    copyBtn.querySelector('span').textContent = t('common.copied', lang());
    setTimeout(() => { copyBtn.querySelector('span').textContent = t('common.copy', lang()); }, 1800);
  });

  document.getElementById('form-again').addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    form.querySelector('#f-name').focus();
  });
}

if (form) {
  try { categories = await getCategories(); } catch (_) { categories = []; }
  init();
}
markReady();
