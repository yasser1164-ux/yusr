# صور الأعمال المنفذة / "Our work" gallery

قسم «أعمالنا» في الصفحة الرئيسية يظهر فقط عندما يحتوي `data/gallery.json` على عناصر. ضع الصور هنا ثم أضف لكل صورة عنصرًا:

```json
[
  {
    "visible": true,
    "sort": 1,
    "category": "majlis",
    "image": { "src": "assets/gallery/majlis-riyadh-01.jpg", "alt": { "ar": "مجلس عربي بعد التركيب", "en": "Arabic majlis after installation" } },
    "caption": { "ar": "مجلس عربي ١٢ متر — الرياض", "en": "12-metre Arabic majlis — Riyadh" },
    "ratio": "4 / 3"
  }
]
```

- `category` هو معرّف القسم من `categories.json` (يظهر كتصنيف صغير فوق التعليق).
- `ratio` اختياري: `"4 / 3"` أفقي (الافتراضي) أو `"3 / 4"` عمودي — التنوع يجعل الشبكة أجمل على الشاشات الكبيرة.
- المقاس المقترح: **800 × 600 بكسل**، أقل من 100 كيلوبايت. أوسع مكان تظهر فيه الصورة عرضه ~390 بكسل (ثلاثة أعمدة على الشاشات الكبيرة)، فـ 800 تكفي للشاشات عالية الدقة.
- ضع نسخة WebP بنفس الاسم وأضف `"webp": "assets/gallery/…​.webp"` داخل `image` — كما في الملفات الموجودة.

> **تنبيه على المحتوى:** الصور الموجودة الآن **توضيحية وليست تركيبات حقيقية**، ولهذا عنوان القسم «نماذج من التصاميم التي ننفّذها». إذا وضعت صور تركيب حقيقية مكانها، يمكنك إعادة العنوان الأقوى من `js/i18n.js` (`home.gallery`) — الصيغة الأصلية محفوظة في تعليق فوق السطر. لا تكتب في `caption` اسم عميل أو مدينة لم يحدث فيها تركيب فعلي.

The "Our work" section renders only when `data/gallery.json` has entries. Drop photos here and add one entry per photo (schema above). `ratio` is optional — mix `"4 / 3"` and `"3 / 4"` for a livelier masonry on desktop.
