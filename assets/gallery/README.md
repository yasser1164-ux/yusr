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
- المقاس المقترح: 1600 على الضلع الأطول، أقل من 300 كيلوبايت.

The "Our work" section renders only when `data/gallery.json` has entries. Drop photos here and add one entry per photo (schema above). `ratio` is optional — mix `"4 / 3"` and `"3 / 4"` for a livelier masonry on desktop.
