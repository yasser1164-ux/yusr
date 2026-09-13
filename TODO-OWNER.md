# ما يحتاجه الموقع منك / What the site needs from you

> **وضع تجريبي / Demo mode:** الموقع الآن يعمل بوضع تجريبي (`DEMO_MODE = true` في `js/config.js`) يملأ الحقول الفارغة ببيانات ورسوم تجريبية واضحة، ويجعل روابط الاتصال التجريبية معطّلة. كل قيمة حقيقية تكتبها في `data/site.json` تظهر فورًا بدل التجريبية. **يوم الإطلاق:** غيّر السطر إلى `DEMO_MODE = false`.
> The site currently runs in demo mode (`DEMO_MODE = true` in `js/config.js`), which fills empty fields with obviously-fake data and illustrations and makes demo contact links inert. Any real value you enter in `data/site.json` replaces the demo one immediately. **On launch day:** change that line to `DEMO_MODE = false`.

الموقع مكتمل تقنيًا لكنه **لا يعرض أي بيانات وهمية**. كل عنصر أدناه فارغ الآن ويظهر تلقائيًا بمجرد تعبئته — لا تحتاج مطوّرًا.
The site is technically complete but shows **no invented data**. Each item below is empty today and appears automatically once filled — no developer needed.

الترتيب حسب الأهمية / In priority order:

## 1. رقم واتساب — الأهم / WhatsApp number — most important
- **أين:** `data/site.json` → `contact.whatsapp`
- **الصيغة:** `966512345678` (دولي، أرقام فقط، بدون + وبدون صفر البداية)
- بدونه: كل أزرار واتساب مخفية، ونموذج الطلب يعطي الزائر رسالة لينسخها فقط.
- Where: `data/site.json` → `contact.whatsapp`, format `966512345678`. Without it every WhatsApp button is hidden and the request form only offers a copyable message.

## 2. البريد الإلكتروني / E-mail
- `data/site.json` → `contact.email` — يظهر في الفوتر وصفحة التواصل، ويصبح بديل واتساب في نموذج الطلب.

## 3. رقم الهاتف / Phone
- `data/site.json` → `contact.phone` — كما تريد عرضه، مثل `+966 50 000 0000`.

## 4. السجل التجاري ورقم معروف / CR and Maroof numbers
- `data/site.json` → `legal.cr` و `legal.maroof` (و `legal.vat` اختياري)
- تظهر في أسفل الفوتر فقط عندما تكون معبأة. **لا تضع رقمًا غير حقيقي.**

## 5. الصور الحقيقية / Real photography
- **المنتجات:** 18 منتجًا × 3 صور في `assets/products/` بالأسماء المذكورة في `data/products.json` (كل منتج يشير الآن إلى `<id>-a.jpg` و `-b.jpg` و `-c.jpg`). القواعد في `assets/products/README.md`.
- **الأقسام:** 6 صور في `assets/categories/`: `majlis.jpg` `living.jpg` `bedrooms.jpg` `kitchens.jpg` `doors.jpg` `dining.jpg`
- **الهيرو:** صورة واحدة عريضة، ضع مسارها في `site.json → hero.image.src`
- **صفحة عن يسر:** `site.json → about.image.src`
- **أعمالنا:** صور القطع المسلّمة في `assets/gallery/` + عنصر لكل صورة في `data/gallery.json` (القسم مخفي حتى تُضاف)
- إلى أن تصل الصور يعرض الموقع صورة بديلة بألوان العلامة — بدون أيقونات مكسورة.

## 6. الأسعار الحقيقية / Real prices
- كل منتج في `data/products.json` يحمل `"_todo": "confirm price"`. راجع `priceFrom` و `priceTo` و `leadTimeDays` ثم احذف سطر `_todo`.
- Every product carries `"_todo": "confirm price"` — verify `priceFrom`, `priceTo`, `leadTimeDays`, then delete the `_todo` line.

## 7. الورش الشريكة / Partner workshops
- `data/site.json` → `partners` — مصفوفة فارغة الآن. لكل ورشة:
```json
{ "name": {"ar": "ورشة …", "en": "… Workshop"}, "role": {"ar": "أثاث خشبي", "en": "Wooden furniture"},
  "text": {"ar": "سطران عنها", "en": "Two lines about it"}, "image": {"src": "assets/partners/x.jpg", "alt": {"ar": "", "en": ""}} }
```
- القسم في صفحة «عن يسر» مخفي حتى تُضاف.

## 8. ساعات العمل / Working hours
- `data/site.json` → `hours` — مثال:
```json
[ { "days": {"ar": "الأحد – الخميس", "en": "Sunday – Thursday"}, "time": {"ar": "9 ص – 6 م", "en": "9am – 6pm"} } ]
```

## 9. المدن ومن فيها تركيب مجاني / Cities and free-installation flags
- `data/site.json` → `cities` — القائمة الحالية تقديرية؛ عدّل `install: true/false` لكل مدينة.

## 10. العنوان والخريطة / Address and map
- `data/site.json` → `contact.address` (عربي/إنجليزي) و `contact.mapEmbedUrl` (رابط تضمين خرائط Google). القسم مخفي حتى تُعبأ.

## 11. حسابات التواصل / Social accounts
- `data/site.json` → `social.instagram` / `x` / `tiktok` / `snapchat` — الأيقونة تظهر فقط للحساب المعبأ.

## 12. أرقام «عن يسر» / About-page figures
- `data/site.json` → `stats` — مثال: `[{ "value": "350+", "label": {"ar": "طلب منفّذ", "en": "orders delivered"} }]`. مخفي حتى يُعبأ.

## 13. آراء العملاء / Testimonials
- `data/testimonials.json` — فارغ. لكل رأي: `{ "text": {"ar":"","en":""}, "name": {"ar":"","en":""}, "city": {"ar":"","en":""}, "visible": true }`

## 14. صورة المشاركة / Share image
- `data/site.json` → `seo.ogImage` — رابط كامل لصورة 1200 × 630 (JPG/PNG). حتى ذلك الحين تستخدم الصفحات الشعار.

## 15. المحتوى النصي للسياسات / Policy wording
- الضمان، الإلغاء، الدفع (50% عند التأكيد) في `js/i18n.js` تحت `how.*` والأسئلة في `data/faq.json` — راجعها لتطابق سياستك الفعلية.
