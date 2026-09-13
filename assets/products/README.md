# صور المنتجات / Product photos

## العربية

- **المقاس:** 1600 × 1200 بكسل (نسبة 4:3). الصور الأصغر تُقبل لكن تبدو أقل حدة على الشاشات الكبيرة.
- **الحجم:** أقل من 300 كيلوبايت للصورة. اضغطها بصيغة JPG (جودة 75–82) أو WebP.
- **التسمية:** `<معرّف-المنتج>-a.jpg` ثم `-b.jpg` ثم `-c.jpg` … — مثال: `wardrobe-slide-01-a.jpg`.
- **الصورة الأولى** (`-a`) هي التي تظهر في بطاقة المنتج وفي نتائج البحث. اجعلها أوضح صورة للقطعة كاملة.
- بعد وضع الصور هنا، أضف مساراتها في `data/products.json` داخل `images`:

```json
"images": [
  { "src": "assets/products/wardrobe-slide-01-a.jpg", "alt": { "ar": "خزانة أبواب سحب بيضاء", "en": "White sliding-door wardrobe" } },
  { "src": "assets/products/wardrobe-slide-01-b.jpg", "alt": { "ar": "التقسيم الداخلي", "en": "Interior layout" } }
]
```

- إذا كان الملف غير موجود، يعرض الموقع صورة بديلة بألوان العلامة تلقائيًا — لن تظهر أيقونة صورة مكسورة أبدًا.
- اختياري: ضع نسخة WebP بنفس الاسم وأضف `"webp": "assets/products/…-a.webp"` في نفس العنصر.

## English

- **Size:** 1600 × 1200 px (4:3). Smaller files work but look softer on large screens.
- **Weight:** under ~300 KB each. Compress as JPG (quality 75–82) or WebP.
- **Naming:** `<product-id>-a.jpg`, then `-b.jpg`, `-c.jpg` … — e.g. `wardrobe-slide-01-a.jpg`.
- **The first image** (`-a`) is the card thumbnail and the search-result thumbnail. Make it the clearest shot of the whole piece.
- After dropping the files here, list them in `data/products.json` under `images` (see the example above).
- A missing file shows the branded placeholder automatically — never a broken-image icon.
- Optional: add a WebP twin with the same name and set `"webp": "assets/products/…-a.webp"` on the same entry.
