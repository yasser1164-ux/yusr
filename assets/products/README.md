# صور المنتجات / Product photos

## العربية

- **المقاس:** ابعث الأصل بأي مقاس (نسبة 4:3)، ثم صغّره إلى **900 × 675 بكسل** قبل رفعه. أكبر مكان تظهر فيه الصورة في الموقع عرضه 576 بكسل، فـ 900 تكفي للشاشات عالية الدقة، وما زاد عنها بطء بلا فائدة.
- **الحجم:** أقل من 150 كيلوبايت للصورة. اضغطها بصيغة JPG (جودة 80–84) أو WebP (جودة 76).
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

- **Size:** shoot at any size (4:3), then resize to **900 × 675 px** before uploading. The largest slot on the site is 576 CSS px wide, so 900 px covers high-DPI screens and anything bigger is dead weight.
- **Weight:** under ~150 KB each. Compress as JPG (quality 80–84) or WebP (quality 76).
- **Naming:** `<product-id>-a.jpg`, then `-b.jpg`, `-c.jpg` … — e.g. `wardrobe-slide-01-a.jpg`.
- **The first image** (`-a`) is the card thumbnail and the search-result thumbnail. Make it the clearest shot of the whole piece.
- After dropping the files here, list them in `data/products.json` under `images` (see the example above).
- A missing file shows the branded placeholder automatically — never a broken-image icon.
- Optional: add a WebP twin with the same name and set `"webp": "assets/products/…-a.webp"` on the same entry.
