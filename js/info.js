/**
 * Yusr — site.json-driven blocks on the About and Contact pages.
 * Every block hides itself when its data is empty.
 */

import { ready, lang, onLangChange, siteData, applyI18n, waLink, markReady } from './main.js';
import { t, pick } from './i18n.js';
import { ICON, esc, picture, revealWithin } from './ui.js';

await ready;

const $ = id => document.getElementById(id);
const page = document.body.dataset.page;

/* --------------------------------------------------------------- about -- */

function renderAbout(l) {
  const site = siteData();

  const media = $('about-media');
  if (media) media.innerHTML = picture(site.about && site.about.image, { lang: l, ratio: '4 / 3', sizes: '(min-width: 900px) 45vw, 100vw' });

  const partners = $('partners');
  const list = site.partners || [];
  if (partners) {
    partners.hidden = list.length === 0;
    if (list.length) {
      partners.innerHTML = `
        <div class="container">
          <div class="sec-head reveal">
            <p class="eyebrow">${esc(t('about.partnersTitle', l))}</p>
            <h2 class="sec-head__title">${esc(t('about.partnersTitle', l))}</h2>
            <p class="sec-head__text">${esc(t('about.partnersText', l))}</p>
          </div>
          <div class="grid grid--3">
            ${list.map(p => `
              <article class="partner reveal">
                ${picture(p.image, { lang: l, ratio: '4 / 3' })}
                <div class="partner__body">
                  ${p.role ? `<p class="partner__role">${esc(pick(p.role, l))}</p>` : ''}
                  <h3>${esc(pick(p.name, l))}</h3>
                  <p>${esc(pick(p.text, l))}</p>
                </div>
              </article>`).join('')}
          </div>
        </div>`;
    }
  }

  const stats = $('stats');
  const figures = site.stats || [];
  if (stats) {
    stats.hidden = figures.length === 0;
    if (figures.length) {
      stats.innerHTML = `
        <div class="container">
          <h2 class="sec-head__title sec-head__title--sm">${esc(t('about.statsTitle', l))}</h2>
          <ul class="stats">
            ${figures.map(s => `<li class="stat reveal"><strong>${esc(s.value)}</strong><span>${esc(pick(s.label, l))}</span></li>`).join('')}
          </ul>
        </div>`;
    }
  }
}

/* ------------------------------------------------------------- contact -- */

function card(iconName, titleKey, body) {
  return `
    <div class="contact-card reveal">
      <span class="contact-card__icon">${ICON[iconName]}</span>
      <h2>${esc(t(titleKey, lang()))}</h2>
      ${body}
    </div>`;
}

function renderContact(l) {
  const site = siteData();
  const c = site.contact || {};

  const cards = $('contact-cards');
  if (cards) {
    const wa = waLink(t('waMsg.greeting', l));
    const items = [
      wa ? card('whatsapp', 'contact.waTitle', `<p>${esc(t('contact.waText', l))}</p><p><a href="${esc(wa)}" target="_blank" rel="noopener">${esc(t('contact.waCta', l))}</a></p>`) : '',
      c.phone ? card('phone', 'contact.phoneTitle', `<p><a href="tel:${esc(String(c.phone).replace(/\s/g, ''))}"><span dir="ltr">${esc(c.phone)}</span></a></p>`) : '',
      c.email ? card('mail', 'contact.emailTitle', `<p><a href="mailto:${esc(c.email)}"><span dir="ltr">${esc(c.email)}</span></a></p>`) : ''
    ].filter(Boolean);
    cards.innerHTML = items.join('');
    cards.hidden = items.length === 0;
  }

  const hoursPanel = $('hours-panel');
  const hours = site.hours || [];
  if (hoursPanel) {
    hoursPanel.hidden = hours.length === 0;
    $('hours-list').innerHTML = hours.map(h => `<li><span>${esc(pick(h.days, l))}</span><span dir="ltr">${esc(pick(h.time, l))}</span></li>`).join('');
  }

  const coverage = $('coverage-list');
  const cities = site.cities || [];
  if (coverage) {
    coverage.innerHTML = cities.map(city => `
      <li${city.install ? ` title="${esc(t('contact.installBadge', l))}"` : ''}>
        ${city.install ? ICON.check : ''}${esc(pick(city.name, l))}
      </li>`).join('');
    $('coverage-panel').hidden = cities.length === 0;
  }

  const mapPanel = $('map-panel');
  const address = pick(c.address, l);
  if (mapPanel) {
    const hasMap = Boolean(c.mapEmbedUrl);
    mapPanel.hidden = !address && !hasMap;
    $('address-line').textContent = address;
    const frame = $('map-frame');
    frame.hidden = !hasMap;
    frame.innerHTML = hasMap ? `<iframe src="${esc(c.mapEmbedUrl)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${esc(t('contact.mapTitle', l))}"></iframe>` : '';
  }
}

/* ----------------------------------------------------------------- run -- */

function render() {
  const l = lang();
  if (page === 'about') renderAbout(l);
  if (page === 'contact') renderContact(l);
  applyI18n(document);
  revealWithin(document);
}

render();
markReady();
onLangChange(render);
