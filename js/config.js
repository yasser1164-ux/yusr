/**
 * Yusr — technical constants only.
 * Business content (contact details, WhatsApp number, cities, hours, legal numbers)
 * lives in data/site.json. Do not put content here.
 */

/**
 * Demo mode: fills every EMPTY value with obviously-fake content from data/demo/
 * (contact details, hours, partners, gallery, reviews, furniture illustrations),
 * shows a "demo" banner, makes every demo phone/WhatsApp/e-mail link inert and
 * marks the pages noindex. Real values in data/*.json always win over demo ones.
 */
export const DEMO_MODE = true;   // set to false before launch

export const CONFIG = {
  /* Where the JSON content files live, relative to the HTML pages. */
  dataDir: 'data',

  /* Branded image shown whenever a photo is missing or fails to load. */
  placeholderImage: 'assets/placeholder.svg',

  /* localStorage key for the chosen language. */
  storageKey: 'yusr.lang',
  defaultLang: 'ar',

  /* true → Arabic UI shows Eastern Arabic digits (٢٬٩٠٠); false → Western digits (2,900). */
  arabicNumerals: true,

  /* Rendering limits. */
  featuredLimit: 6,
  faqLimit: 5,
  relatedLimit: 3,
  searchResultLimit: 8,
  searchDebounceMs: 120,

  /* Sticky WhatsApp button appears after this fraction of the page has been scrolled. */
  stickyWaThreshold: 0.3,

  /* Header hides on scroll-down only after this many pixels. */
  headerHideAfter: 80
};
