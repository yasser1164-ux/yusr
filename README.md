# يسر | Yusr

موقع تعريفي وطلبات لعلامة **يسر** للأثاث المنزلي المفصّل في السعودية. موقع ثابت — بدون خادم ولا خطوة بناء — عربي/إنجليزي.

A bilingual (AR/EN) marketing and ordering site for **Yusr**, a Saudi made-to-order home furnishing brand. Static — no backend, no build step, no npm.

**الرابط / Live:** https://yasser1164-ux.github.io/yusr/

**ما الذي يحتاجه المالك الآن؟ → [`TODO-OWNER.md`](TODO-OWNER.md)**

---

## العربية

### الفكرة في سطر

كل ما قد يغيّره صاحب المتجر موجود في مجلد **`data/`** كملفات JSON. لا تحتاج تلمس HTML ولا CSS ولا JavaScript لإضافة منتج أو قسم أو صورة أو تغيير رقم واتساب.

```
data/
  site.json          ← العلامة، الهيرو، واتساب، الهاتف، البريد، ساعات العمل، المدن، السجل التجاري ومعروف، السوشال، الشارات
  categories.json    ← الأقسام الستة وأنواعها الفرعية (رقائق التصفية)
  products.json      ← المنتجات (18 حاليًا)
  collections.json   ← مجموعات مختارة تظهر كروابط سريعة تحت «قطع مختارة»
  faq.json           ← الأسئلة المتكررة
  gallery.json       ← «أعمالنا» — صور القطع المنفذة (فارغ = القسم مخفي)
  testimonials.json  ← آراء العملاء (فارغ = القسم مخفي)
```

بعد أي تعديل تأكد أن الملف سليم: `python3 -m json.tool data/products.json` — لو ظهر خطأ فهناك فاصلة ناقصة أو زائدة.

### الوصفات

#### 1) إضافة منتج

1. ضع 3 صور في `assets/products/` بأسماء `معرّف-المنتج-a.jpg` و`-b.jpg` و`-c.jpg` (التفاصيل في `assets/products/README.md`).
2. افتح `data/products.json` وانسخ أي منتج موجود ثم عدّل الحقول:

```json
{
  "id": "wardrobe-4door-01",
  "sku": "YSR-BD-004",
  "category": "bedrooms",
  "tags": ["wardrobe"],
  "visible": true,
  "featured": false,
  "collections": ["fast-delivery"],
  "added": "2026-10-01",
  "name":  { "ar": "خزانة أربعة أبواب", "en": "Four-door wardrobe" },
  "short": { "ar": "سطر واحد للبطاقة", "en": "One line for the card" },
  "description": { "ar": "فقرة لصفحة التفاصيل", "en": "A paragraph for the detail page" },
  "priceFrom": 3200,
  "priceTo": 6500,
  "priceNote": { "ar": "السعر حسب المقاس والخامة", "en": "Price varies by size and material" },
  "leadTimeDays": 14,
  "images": [
    { "src": "assets/products/wardrobe-4door-01-a.jpg", "alt": { "ar": "خزانة أربعة أبواب بيضاء", "en": "White four-door wardrobe" } },
    { "src": "assets/products/wardrobe-4door-01-b.jpg", "alt": { "ar": "من الداخل", "en": "Interior" } }
  ],
  "specs": {
    "dimensions": { "ar": "200 × 60 × 240 سم", "en": "200 × 60 × 240 cm" },
    "material":   { "ar": "MDF مقاوم للرطوبة", "en": "Moisture-resistant MDF" },
    "colors":     [ { "ar": "أبيض", "en": "White" } ],
    "warrantyYears": 2
  },
  "options": {
    "size":     [ { "ar": "200 سم", "en": "200 cm" } ],
    "color":    [ { "ar": "أبيض", "en": "White" } ],
    "material": [ { "ar": "ميلامين", "en": "Melamine" } ]
  },
  "badges": ["made-in-saudi", "warranty-2y"]
}
```

- `id` فريد ولا يتكرر — هو الرابط `product.html?id=…` وبداية أسماء الصور.
- `category` أحد معرّفات `categories.json`، و`tags` من أنواع ذلك القسم الفرعية.
- `featured: true` يُظهر القطعة في الصفحة الرئيسية (أول 6 فقط).
- `added` تاريخ الإضافة — ترتيب «الأحدث» يعتمد عليه.
- `badges` من المفاتيح المعرّفة في `site.json → badges`.
- الأسعار أرقام بدون فواصل؛ العملة والتنسيق يتمّان تلقائيًا.

#### 2) إخفاء منتج مؤقتًا

غيّر `"visible": true` إلى `"visible": false`. يختفي من الموقع والبحث دون حذف بياناته. نفس الشيء يعمل للأقسام والأسئلة والمجموعات.

#### 3) إضافة قسم أو إعادة ترتيبه

في `data/categories.json`:
- **الترتيب:** غيّر رقم `sort` (الأصغر يظهر أولًا).
- **قسم جديد:** انسخ قسمًا موجودًا، أعطه `id` جديدًا، اسمًا ووصفًا بالعربي والإنجليزي، صورة في `assets/categories/`، وأنواعًا فرعية في `subtypes`. الأيقونة من: `majlis` `sofa` `bed` `kitchen` `door` `dining` `home`.
- الأنواع الفرعية (`subtypes`) تظهر كرقائق تصفية في صفحة المنتجات؛ اربط المنتجات بها عبر `tags`.

#### 4) تغيير رقم واتساب / السجل التجاري / معروف

كل ذلك في `data/site.json`:

```json
"contact": { "whatsapp": "966512345678", "phone": "+966 50 000 0000", "email": "hello@example.com" },
"legal":   { "cr": "1010XXXXXX", "maroof": "XXXXXX", "vat": "" }
```

- واتساب بالصيغة الدولية، أرقام فقط، بدون `+` وبدون صفر البداية.
- أي قيمة تتركها فارغة `""` لا تظهر في الموقع إطلاقًا — لا رقم وهمي ولا «قريبًا».
- ما دام رقم واتساب فارغًا: تختفي أزرار واتساب، ونموذج الطلب يعطي الزائر الرسالة لينسخها (أو يرسلها بالبريد إن كان البريد موجودًا).

في نفس الملف أيضًا: نص الهيرو وصورته (`hero`)، ساعات العمل (`hours`)، المدن ومن فيها تركيب مجاني (`cities` → `install`)، السوشال (`social`)، الورش الشريكة (`partners`)، والأرقام في صفحة «عن يسر» (`stats`).

#### 5) الصور

- **المنتجات:** `assets/products/` — انظر README هناك.
- **الأقسام:** `assets/categories/<id>.jpg`.
- **الهيرو:** ضع المسار في `site.json → hero.image.src` (مقاس 1920 × 1080 مناسب).
- **أعمالنا:** `assets/gallery/` + عنصر لكل صورة في `data/gallery.json` — انظر README هناك.
- إذا كان الملف غير موجود أو تعذر تحميله، يعرض الموقع صورة بديلة بألوان العلامة. **لن تظهر أيقونة صورة مكسورة أبدًا.**

#### 6) النشر

```bash
git add .
git commit -m "Update content"
git push
```

GitHub Pages يعيد النشر تلقائيًا خلال دقيقة. الإعداد لمرة واحدة: `Settings → Pages → Deploy from a branch → main / (root)`.

#### 7) التشغيل محليًا

المحتوى يُقرأ من ملفات JSON عبر `fetch`، والمتصفحات تمنع ذلك عند فتح الملف مباشرة (`file://`):

```bash
python3 -m http.server 8000
# افتح http://localhost:8000
```

---

## English

### The idea in one line

Everything a shop owner would change lives in **`data/`** as JSON. Adding a product, a category, a photo or the WhatsApp number never touches HTML, CSS or JavaScript.

| File | Holds |
|---|---|
| `data/site.json` | brand, hero, WhatsApp, phone, e-mail, hours, cities, CR/Maroof, social links, badges, partners, stats |
| `data/categories.json` | the six categories and their sub-types (filter chips) |
| `data/products.json` | products (18 today) |
| `data/collections.json` | curated groups shown as quick links under "Selected pieces" |
| `data/faq.json` | FAQ |
| `data/gallery.json` | "Our work" photos — empty = section hidden |
| `data/testimonials.json` | reviews — empty = section hidden |

Validate after editing: `python3 -m json.tool data/products.json`.

### Recipes

**Add a product** — drop `<id>-a.jpg`, `-b.jpg`, `-c.jpg` into `assets/products/`, copy an entry in `data/products.json` and edit it (full example in the Arabic section above). `id` must be unique; `category` and `tags` come from `categories.json`; `featured: true` puts it on the home page; `added` drives the "Newest" sort; `badges` are keys from `site.json → badges`.

**Hide a product temporarily** — set `"visible": false`. Works for categories, FAQ entries and collections too.

**Add or reorder a category** — in `data/categories.json` change `sort` (lower first) or copy an entry with a new `id`, names, blurb, an image in `assets/categories/`, and `subtypes`. Icons: `majlis` `sofa` `bed` `kitchen` `door` `dining` `home`.

**Change WhatsApp / CR / Maroof** — `data/site.json` → `contact.whatsapp` (international, digits only), `legal.cr`, `legal.maroof`. Any empty value is simply not rendered. While WhatsApp is empty, WhatsApp buttons disappear and the request form hands the visitor a copyable message (or an e-mail link if `contact.email` is set).

**Images** — products in `assets/products/`, categories in `assets/categories/<id>.jpg`, hero via `site.json → hero.image.src`, gallery in `assets/gallery/` + `data/gallery.json`. A missing file shows the branded placeholder, never a broken icon.

**Deploy** — `git add . && git commit -m "Update content" && git push`. Pages redeploys within a minute (one-time: Settings → Pages → Deploy from a branch → `main` / root).

**Run locally** — `python3 -m http.server 8000` then open `http://localhost:8000` (browsers block `fetch` on `file://`).

---

## Technical notes

- Plain HTML + CSS + vanilla ES modules. `js/store.js` is the only module that reads JSON; every page queries through it.
- Arabic is the default (`dir="rtl"`); the toggle switches to English, persists in `localStorage`, and `?lang=en` forces a language. Layout uses logical CSS properties so RTL mirrors without overrides.
- Arabic UI uses Eastern Arabic digits (٢٬٩٠٠); flip `arabicNumerals` in `js/config.js` for Western digits.
- Accessibility: landmarks, skip link, focus rings, focus-trapped overlays (drawer, search, lightbox) with Escape to close, `aria-live` result counts, `aria-pressed` chips, `aria-expanded` accordion.
- Colour contrast: walnut `#4A3728` on sand `#E9DCC9` ≈ 9:1; muted `#6B5E54` on `#FAF7F2` ≈ 5.5:1.
- Only external dependency: Google Fonts (IBM Plex Sans / IBM Plex Sans Arabic, `font-display: swap`).
