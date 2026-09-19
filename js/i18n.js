/**
 * Yusr — UI strings in both languages, plus language and number helpers.
 * Business content (products, categories, contact details, FAQ) lives in data/*.json;
 * this file holds only interface wording and static page copy.
 *
 * Usage in markup: <h1 data-i18n="how.title"></h1>
 *                  <input data-i18n-attr="placeholder:form.namePh">
 */

import { CONFIG } from './config.js';

export const DICT = {
  ar: {
    dir: 'rtl',
    htmlLang: 'ar',
    currency: 'ر.س',
    brand: { name: 'يسر', tagline: 'بيتك على راحتك' },

    nav: {
      home: 'الرئيسية',
      products: 'المنتجات',
      custom: 'اطلب على مقاسك',
      how: 'كيف نعمل',
      about: 'عن يسر',
      contact: 'تواصل',
      menu: 'القائمة',
      close: 'إغلاق',
      skip: 'تخطّي إلى المحتوى',
      langToggle: 'English',
      langToggleLabel: 'تغيير اللغة إلى الإنجليزية',
      whatsapp: 'واتساب',
      search: 'بحث'
    },

    common: {
      from: 'يبدأ من',
      to: 'إلى',
      orderNow: 'اطلب الآن',
      orderThis: 'اطلب هذا المنتج',
      viewAll: 'عرض كل المنتجات',
      browse: 'تصفّح المنتجات',
      customCta: 'اطلب على مقاسك',
      details: 'التفاصيل',
      day: 'يوم',
      years: 'سنوات',
      readyIn: 'جاهز خلال',
      loading: 'جاري التحميل…',
      backToProducts: 'رجوع إلى المنتجات',
      all: 'الكل',
      clear: 'مسح',
      copy: 'نسخ الرسالة',
      copied: 'تم النسخ',
      product: 'منتج',
      products: 'منتج',
      noResults: 'لا توجد نتائج',
      madeIn: 'صُنع في السعودية',
      loadError: 'تعذّر تحميل المحتوى.',
      loadErrorHint: 'إذا فتحت الملف مباشرة من جهازك، شغّل خادمًا محليًا: python3 -m http.server'
    },

    search: {
      title: 'ابحث عن قطعة',
      placeholder: 'مثال: خزانة، مجلس، طاولة طعام…',
      hint: 'اكتب اسم القطعة أو نوعها',
      results: 'نتيجة',
      noResults: 'ما لقينا شيئًا بهذا الاسم. جرّب كلمة أخرى أو تصفّح الأقسام.',
      seeAll: 'عرض كل النتائج',
      quick: 'تصفّح سريع',
      close: 'إغلاق البحث'
    },

    sort: {
      label: 'ترتيب',
      newest: 'الأحدث',
      priceAsc: 'السعر: من الأقل',
      priceDesc: 'السعر: من الأعلى',
      fastest: 'الأسرع تنفيذًا'
    },

    filters: {
      category: 'القسم',
      subtype: 'النوع',
      collection: 'مجموعة',
      searchLabel: 'ابحث في المنتجات',
      searchPh: 'ابحث باسم القطعة…',
      clearAll: 'إلغاء التصفية'
    },

    products: {
      title: 'المنتجات',
      lead: 'كل قطعة تُصنع بعد طلبك، على مقاس مكانك، بالخامة واللون اللي تختارهم.',
      empty: 'ما لقينا قطعة مطابقة. غيّر التصفية، أو اطلبها على مقاسك وبنصنعها لك.',
      emptyCta: 'اطلب على مقاسك'
    },

    product: {
      notFound: 'هذا المنتج غير موجود أو تم إخفاؤه.',
      sku: 'رقم المنتج',
      specs: 'المواصفات',
      dimensions: 'الأبعاد',
      material: 'الخامة',
      colors: 'الألوان',
      leadTime: 'مدة التنفيذ',
      warranty: 'الضمان',
      options: 'اختر مواصفات قطعتك',
      size: 'المقاس',
      color: 'اللون',
      materialOpt: 'الخامة',
      priceNote: 'السعر يختلف حسب المقاس والخامة النهائية، ونؤكده قبل بدء التصنيع.',
      gallery: 'صور المنتج',
      thumbAlt: 'صورة',
      related: 'قد يناسبك أيضًا',
      breadcrumb: 'مسار الصفحة'
    },

    home: {
      categories: { eyebrow: 'الأقسام', title: 'اختر القسم وابدأ', text: 'ستة أقسام تغطي البيت كله، وكل قطعة فيها تُصنع على مقاسك.' },
      values: {
        eyebrow: 'لماذا يسر',
        title: 'أثاث يُصنع لبيتك، لا لمعرض',
        a: { t: 'صُنع في السعودية', d: 'ورش سعودية نزورها ونتابع جودتها.' },
        b: { t: 'على مقاسك', d: 'نقيس مكانك ونصنع القطعة له بالسنتيمتر.' },
        c: { t: 'سعر مباشر من المصنع', d: 'بدون معارض ولا وسطاء. تدفع للخامة والصنعة.' },
        d: { t: 'توصيل وتركيب', d: 'نوصل ونركّب في المدن الرئيسية ونشحن للبقية.' }
      },
      featured: { eyebrow: 'مختارات', title: 'قطع يطلبها عملاؤنا كثيرًا', text: 'ابدأ من هنا، وغيّر المقاس والخامة كما تحب.' },
      /* Wording note: these are illustrative design visuals, not photos of delivered jobs.
         Once real installation photos replace assets/gallery/*, this can go back to
         'قطع سلّمناها لبيوت حقيقية' / 'صور من التركيب في بيوت عملائنا.' */
      gallery: { eyebrow: 'أعمالنا', title: 'نماذج من التصاميم التي ننفّذها', text: 'صور توضيحية للأنماط والتشطيبات المتاحة.' },
      testimonials: { eyebrow: 'آراء العملاء', title: 'ماذا يقول من طلب قبلك' },
      process: {
        eyebrow: 'كيف نعمل',
        title: 'أربع خطوات من الرسالة إلى التركيب',
        s1: { t: 'اختر أو صف ما تريد', d: 'أرسل صورة أو وصفًا بسيطًا وحدد المكان المخصص للقطعة.' },
        s2: { t: 'نؤكد القياسات والسعر', d: 'نزورك أو نرسل دليل قياس، ثم نعطيك سعرًا نهائيًا مكتوبًا.' },
        s3: { t: 'التصنيع', d: 'تبدأ الورشة بالتنفيذ ونرسل لك صور التقدم في كل مرحلة.' },
        s4: { t: 'التوصيل والتركيب', d: 'نوصل القطعة ونركّبها وننظف المكان قبل ما نمشي.' },
        cta: 'التفاصيل كاملة'
      },
      faq: { eyebrow: 'أسئلة', title: 'أسئلة متكررة' },
      cta: { title: 'جاهز تبدأ؟', text: 'أرسل لنا تفاصيل قطعتك ونرد عليك بالسعر خلال 24 ساعة عمل.' }
    },

    gallery: {
      open: 'تكبير الصورة',
      close: 'إغلاق الصورة',
      prev: 'الصورة السابقة',
      next: 'الصورة التالية',
      counter: 'من'
    },

    custom: {
      title: 'اطلب قطعة على مقاسك',
      lead: 'عبّي النموذج وبنرسل لك السعر المبدئي خلال 24 ساعة عمل.',
      prefilled: 'تم تجهيز الطلب لهذا المنتج:',
      section1: 'معلومات التواصل',
      section2: 'تفاصيل القطعة',
      submit: 'أرسل الطلب عبر واتساب',
      submitMail: 'أرسل الطلب بالبريد',
      submitCopy: 'جهّز الرسالة',
      successTitle: 'رسالتك جاهزة',
      successWa: 'فتحنا لك واتساب برسالة جاهزة. إذا ما فتح تلقائيًا، استخدم أحد الخيارين:',
      successCopy: 'انسخ الرسالة وأرسلها لنا بالطريقة التي تناسبك:',
      openWa: 'افتح واتساب',
      openMail: 'أرسل بالبريد',
      again: 'إرسال طلب آخر',
      errorSummary: 'راجع الحقول المطلوبة بالأسفل.'
    },

    form: {
      name: 'الاسم',
      namePh: 'مثال: سارة العتيبي',
      nameErr: 'اكتب اسمك من فضلك.',
      city: 'المدينة',
      cityPh: 'اختر مدينتك',
      cityOther: 'مدينة أخرى',
      cityErr: 'اختر المدينة.',
      phone: 'رقم الجوال',
      phonePh: '05XXXXXXXX',
      phoneHint: 'رقم سعودي يبدأ بـ 05 أو ‎+9665.',
      phoneErr: 'أدخل رقم جوال سعودي صحيح (05XXXXXXXX).',
      category: 'القسم',
      categoryPh: 'اختر القسم',
      categoryErr: 'اختر القسم.',
      description: 'وصف ما تريد',
      descriptionPh: 'مثال: خزانة بأربعة أبواب سحب ومرآة في الوسط، للغرفة الرئيسية.',
      descriptionErr: 'اكتب وصفًا قصيرًا (10 أحرف على الأقل).',
      dims: 'الأبعاد التقريبية (سم)',
      width: 'العرض',
      depth: 'العمق',
      height: 'الارتفاع',
      dimsHint: 'تقريبية تكفي الآن، ونؤكدها بالقياس الفعلي.',
      materialPref: 'الخامة أو اللون المفضل',
      materialPh: 'مثال: خشب بلوط فاتح مع قماش بيج',
      budget: 'الميزانية التقريبية',
      budgetPh: 'اختر نطاقًا',
      ref: 'رابط صورة مرجعية (اختياري)',
      refPh: 'https://…',
      refErr: 'أدخل رابطًا صحيحًا يبدأ بـ http أو https.',
      contactTime: 'وقت التواصل المفضل',
      time: { morning: 'صباحًا (9 – 12)', afternoon: 'بعد الظهر (12 – 5)', evening: 'مساءً (5 – 10)', any: 'أي وقت' },
      budgetRanges: {
        a: 'أقل من 2,000 ر.س',
        b: '2,000 – 5,000 ر.س',
        c: '5,000 – 10,000 ر.س',
        d: '10,000 – 20,000 ر.س',
        e: 'أكثر من 20,000 ر.س'
      }
    },

    waMsg: {
      title: 'طلب جديد من موقع يسر',
      greeting: 'السلام عليكم، عندي استفسار عن منتجات يسر.',
      name: 'الاسم',
      city: 'المدينة',
      phone: 'الجوال',
      category: 'القسم',
      product: 'المنتج',
      options: 'الخيارات',
      description: 'الوصف',
      dims: 'الأبعاد (عرض × عمق × ارتفاع)',
      material: 'الخامة / اللون',
      budget: 'الميزانية',
      ref: 'صورة مرجعية',
      contactTime: 'وقت التواصل',
      notSpecified: 'غير محدد'
    },

    how: {
      title: 'كيف نعمل',
      lead: 'من أول رسالة إلى تركيب القطعة، هذه كل خطوة بالتفصيل.',
      deliveryTitle: 'التوصيل والتركيب',
      deliveryText: 'نوصل ونركّب مجانًا في المدن الرئيسية. في بقية المدن نشحن عبر شركة شحن ونضيف رسمًا نوضحه قبل تأكيد الطلب. فريق التركيب يفك الكرتون ويأخذه معه، ويترك المكان نظيفًا.',
      deliveryList: {
        a: 'نتفق على موعد التركيب قبلها بيومين.',
        b: 'التركيب في الأدوار العليا بدون مصعد قد يضاف له رسم رفع.',
        c: 'نحتاج المكان فاضيًا وجاهزًا قبل وصول الفريق.'
      },
      warrantyTitle: 'الضمان',
      warrantyText: 'ضمان سنتين على التصنيع والهيكل، وسنة على الأجزاء المتحركة (مفصلات، مجاري، مكابس). يشمل الضمان عيوب التصنيع والتجميع، ولا يشمل سوء الاستخدام أو الرطوبة الزائدة أو التعديل خارج ورشنا.',
      returnsTitle: 'الاستبدال والإلغاء',
      returnsText: 'القطع المفصّلة على المقاس لا تُستبدل لأنها تُصنع لمكان واحد. لكن:',
      returnsList: {
        a: 'تقدر تلغي الطلب خلال 48 ساعة من التأكيد وتسترد كامل الدفعة.',
        b: 'إذا وصلت القطعة بعيب تصنيع أو مقاس مختلف عن المتفق عليه، نصلحها أو نعيد تصنيعها على حسابنا.',
        c: 'إذا تأخر التسليم أكثر من 7 أيام عن الموعد بسببنا، تختار بين خصم 10% أو إلغاء كامل.'
      },
      paymentTitle: 'الدفع',
      paymentText: 'دفعة أولى 50% عند تأكيد القياسات، والباقي عند التسليم. الدفع بتحويل بنكي أو نقدًا عند الاستلام.'
    },

    about: {
      title: 'عن يسر',
      lead: 'بدأنا بسؤال بسيط: ليش أثاث البيت غالي ومو على المقاس؟',
      storyTitle: 'قصتنا',
      storyP1: 'يسر بدأ بعد تجربة شخصية: غرفة بمساحة غريبة، وخزانة جاهزة ما دخلت فيها. بحثنا عن ورشة تنفذ القياس المطلوب، ولقينا ورشًا سعودية ممتازة لكن ما عندها طريقة واضحة توصل فيها للناس.',
      storyP2: 'اليوم نشتغل وسيطًا واضحًا: نستقبل طلبك، نأخذ القياس، نتفق على السعر، ونسلّم الطلب لورشة تناسب نوع القطعة. نتابع التنفيذ مرحلة بمرحلة ونرسل لك الصور، وتبقى مسؤولية الجودة والضمان علينا لا على الورشة.',
      storyP3: 'ما عندنا معارض ولا مخزون جاهز. كل قطعة تُصنع بعد الطلب، وهذا اللي يخلي السعر أقل والقياس مضبوط.',
      partnersTitle: 'ورش نعمل معها',
      partnersText: 'ورش سعودية مختارة، كل واحدة متخصصة في نوع مختلف من التنفيذ.',
      promiseTitle: 'وعد الجودة',
      promiseList: {
        a: 'نفحص كل قطعة في الورشة قبل الشحن ونرسل لك صور الفحص.',
        b: 'نستخدم خامات مذكورة بالاسم في عرض السعر، لا أوصاف عامة.',
        c: 'أي عيب تصنيع خلال فترة الضمان نصلحه على حسابنا.',
        d: 'السعر الذي نؤكده هو السعر النهائي، بدون رسوم تظهر لاحقًا.'
      },
      statsTitle: 'بالأرقام'
    },

    contact: {
      title: 'تواصل معنا',
      lead: 'أسرع طريقة هي واتساب. نرد خلال ساعات العمل.',
      waTitle: 'واتساب',
      waText: 'للطلبات والاستفسارات والصور.',
      waCta: 'ابدأ محادثة',
      phoneTitle: 'اتصال',
      emailTitle: 'البريد الإلكتروني',
      hoursTitle: 'ساعات العمل',
      coverageTitle: 'المدن التي نغطيها',
      coverageText: 'توصيل وتركيب مجاني في المدن المعلّمة، وشحن لبقية المناطق.',
      installBadge: 'توصيل وتركيب',
      mapTitle: 'موقعنا',
      formTitle: 'تفضّل ترسل نموذجًا؟',
      formText: 'استخدم نموذج الطلب وبيوصلنا كل التفاصيل مرتبة.',
      formCta: 'افتح نموذج الطلب'
    },

    footer: {
      about: 'يسر يصنع أثاث بيتك على مقاسك مع ورش سعودية، ويوصله لباب بيتك.',
      links: 'روابط سريعة',
      contact: 'تواصل',
      social: 'تابعنا',
      rights: 'جميع الحقوق محفوظة.',
      maroof: 'موثوق (معروف)',
      cr: 'السجل التجاري',
      vat: 'الرقم الضريبي',
      instagram: 'إنستقرام', x: 'إكس', tiktok: 'تيك توك', snapchat: 'سناب شات'
    },

    sticky: { cta: 'اطلب عبر واتساب' },

    meta: {
      home: { t: 'يسر | أثاث ومجالس وخزائن ومطابخ على مقاسك في السعودية', d: 'يسر يصنع أثاثك ومجلسك وخزائنك ومطبخك وأبوابك على مقاسك مع ورش سعودية، بسعر مباشر من المصنع وتوصيل لكل المملكة.' },
      products: { t: 'المنتجات | يسر', d: 'تصفّح المجالس والكنب وغرف النوم والمطابخ والأبواب والسفرات التي ننفذها على المقاس، مع أسعار البداية ومدة التنفيذ.' },
      product: { t: 'تفاصيل المنتج | يسر', d: 'مواصفات وخيارات القطعة مع إمكانية طلبها على مقاسك مباشرة عبر واتساب.' },
      custom: { t: 'اطلب على مقاسك | يسر', d: 'أرسل قياساتك وتفاصيل القطعة التي تريدها، ونرد عليك بالسعر خلال 24 ساعة عمل.' },
      how: { t: 'كيف نعمل | يسر', d: 'من الطلب إلى التركيب: الخطوات والتوصيل والضمان وسياسة الإلغاء بوضوح.' },
      about: { t: 'عن يسر | صناعة سعودية على المقاس', d: 'قصة يسر، الورش الشريكة، ووعد الجودة الذي نلتزم به في كل طلب.' },
      contact: { t: 'تواصل معنا | يسر', d: 'واتساب وهاتف وبريد وساعات العمل والمدن التي نغطيها بالتوصيل والتركيب.' }
    }
  },

  en: {
    dir: 'ltr',
    htmlLang: 'en',
    currency: 'SAR',
    brand: { name: 'Yusr', tagline: 'Your home, your way.' },

    nav: {
      home: 'Home',
      products: 'Products',
      custom: 'Custom order',
      how: 'How it works',
      about: 'About',
      contact: 'Contact',
      menu: 'Menu',
      close: 'Close',
      skip: 'Skip to content',
      langToggle: 'عربي',
      langToggleLabel: 'Switch language to Arabic',
      whatsapp: 'WhatsApp',
      search: 'Search'
    },

    common: {
      from: 'From',
      to: 'to',
      orderNow: 'Order now',
      orderThis: 'Order this piece',
      viewAll: 'View all products',
      browse: 'Browse products',
      customCta: 'Order to your size',
      details: 'Details',
      day: 'days',
      years: 'years',
      readyIn: 'Ready in',
      loading: 'Loading…',
      backToProducts: 'Back to products',
      all: 'All',
      clear: 'Clear',
      copy: 'Copy message',
      copied: 'Copied',
      product: 'product',
      products: 'products',
      noResults: 'No results',
      madeIn: 'Made in Saudi Arabia',
      loadError: 'Could not load the content.',
      loadErrorHint: 'If you opened the file directly from disk, run a local server: python3 -m http.server'
    },

    search: {
      title: 'Find a piece',
      placeholder: 'e.g. wardrobe, majlis, dining table…',
      hint: 'Type the name or kind of piece',
      results: 'results',
      noResults: 'Nothing by that name. Try another word, or browse the categories.',
      seeAll: 'See all results',
      quick: 'Quick browse',
      close: 'Close search'
    },

    sort: {
      label: 'Sort',
      newest: 'Newest',
      priceAsc: 'Price: low to high',
      priceDesc: 'Price: high to low',
      fastest: 'Fastest to make'
    },

    filters: {
      category: 'Category',
      subtype: 'Type',
      collection: 'Collection',
      searchLabel: 'Search products',
      searchPh: 'Search by name…',
      clearAll: 'Clear filters'
    },

    products: {
      title: 'Products',
      lead: 'Every piece is built after you order, to the size of your space, in the material and colour you choose.',
      empty: 'No matching piece. Change the filters, or order it to your size and we will build it.',
      emptyCta: 'Order to your size'
    },

    product: {
      notFound: 'This product does not exist or has been hidden.',
      sku: 'Product no.',
      specs: 'Specifications',
      dimensions: 'Dimensions',
      material: 'Material',
      colors: 'Colours',
      leadTime: 'Lead time',
      warranty: 'Warranty',
      options: 'Choose your specification',
      size: 'Size',
      color: 'Colour',
      materialOpt: 'Material',
      priceNote: 'Price varies with final size and material; we confirm it before production starts.',
      gallery: 'Product images',
      thumbAlt: 'Image',
      related: 'You may also like',
      breadcrumb: 'Breadcrumb'
    },

    home: {
      categories: { eyebrow: 'Categories', title: 'Pick a category and start', text: 'Six categories that cover the whole home — every piece built to your size.' },
      values: {
        eyebrow: 'Why Yusr',
        title: 'Furniture made for your home, not a showroom',
        a: { t: 'Made in Saudi Arabia', d: 'Saudi workshops we visit and inspect.' },
        b: { t: 'Built to your size', d: 'We measure your space and build to the centimetre.' },
        c: { t: 'Factory-direct pricing', d: 'No showrooms, no middlemen. You pay for material and craft.' },
        d: { t: 'Delivery and installation', d: 'We deliver and install in major cities, and ship elsewhere.' }
      },
      featured: { eyebrow: 'Selected', title: 'Pieces our customers order most', text: 'Start here, then change the size and material as you like.' },
      /* Wording note: see the Arabic side — illustrative design visuals, not delivered jobs.
         Restore 'Pieces delivered to real homes' / 'Installation photos from our customers’ homes.'
         once assets/gallery/* holds genuine installation photos. */
      gallery: { eyebrow: 'Our work', title: 'Examples of what we build', text: 'Illustrative images of the styles and finishes available.' },
      testimonials: { eyebrow: 'Reviews', title: 'What customers say' },
      process: {
        eyebrow: 'How it works',
        title: 'Four steps from message to installation',
        s1: { t: 'Choose or describe it', d: 'Send a photo or a short description and tell us where it goes.' },
        s2: { t: 'We confirm size and price', d: 'We measure on site or send a measuring guide, then quote in writing.' },
        s3: { t: 'Production', d: 'The workshop starts building and we send progress photos at each stage.' },
        s4: { t: 'Delivery and installation', d: 'We deliver, install, and clean up before we leave.' },
        cta: 'Full details'
      },
      faq: { eyebrow: 'FAQ', title: 'Frequently asked questions' },
      cta: { title: 'Ready to start?', text: 'Send us your piece details and we reply with a price within 24 working hours.' }
    },

    gallery: {
      open: 'Enlarge image',
      close: 'Close image',
      prev: 'Previous image',
      next: 'Next image',
      counter: 'of'
    },

    custom: {
      title: 'Order a piece to your size',
      lead: 'Fill in the form and we send you an indicative price within 24 working hours.',
      prefilled: 'Request prepared for this product:',
      section1: 'Contact details',
      section2: 'Piece details',
      submit: 'Send request on WhatsApp',
      submitMail: 'Send request by e-mail',
      submitCopy: 'Prepare the message',
      successTitle: 'Your message is ready',
      successWa: 'We opened WhatsApp with a prepared message. If it did not open, use one of these:',
      successCopy: 'Copy the message and send it to us however suits you:',
      openWa: 'Open WhatsApp',
      openMail: 'Send by e-mail',
      again: 'Send another request',
      errorSummary: 'Please check the highlighted fields below.'
    },

    form: {
      name: 'Name',
      namePh: 'e.g. Sarah Alotaibi',
      nameErr: 'Please enter your name.',
      city: 'City',
      cityPh: 'Select your city',
      cityOther: 'Another city',
      cityErr: 'Please select a city.',
      phone: 'Mobile number',
      phonePh: '05XXXXXXXX',
      phoneHint: 'Saudi number starting with 05 or +9665.',
      phoneErr: 'Enter a valid Saudi mobile number (05XXXXXXXX).',
      category: 'Category',
      categoryPh: 'Select a category',
      categoryErr: 'Please select a category.',
      description: 'Describe what you want',
      descriptionPh: 'e.g. A four-door sliding wardrobe with a mirror in the middle, for the master bedroom.',
      descriptionErr: 'Please write a short description (at least 10 characters).',
      dims: 'Approximate dimensions (cm)',
      width: 'Width',
      depth: 'Depth',
      height: 'Height',
      dimsHint: 'Rough numbers are fine now; we confirm with a real measurement.',
      materialPref: 'Preferred material or colour',
      materialPh: 'e.g. light oak with beige fabric',
      budget: 'Approximate budget',
      budgetPh: 'Select a range',
      ref: 'Reference image URL (optional)',
      refPh: 'https://…',
      refErr: 'Enter a valid link starting with http or https.',
      contactTime: 'Preferred contact time',
      time: { morning: 'Morning (9am – 12pm)', afternoon: 'Afternoon (12pm – 5pm)', evening: 'Evening (5pm – 10pm)', any: 'Any time' },
      budgetRanges: {
        a: 'Under 2,000 SAR',
        b: '2,000 – 5,000 SAR',
        c: '5,000 – 10,000 SAR',
        d: '10,000 – 20,000 SAR',
        e: 'Over 20,000 SAR'
      }
    },

    waMsg: {
      title: 'New request from the Yusr website',
      greeting: 'Hello Yusr, I have a question about your products.',
      name: 'Name',
      city: 'City',
      phone: 'Mobile',
      category: 'Category',
      product: 'Product',
      options: 'Options',
      description: 'Description',
      dims: 'Dimensions (W × D × H)',
      material: 'Material / colour',
      budget: 'Budget',
      ref: 'Reference image',
      contactTime: 'Contact time',
      notSpecified: 'Not specified'
    },

    how: {
      title: 'How it works',
      lead: 'From the first message to installation day — every step in detail.',
      deliveryTitle: 'Delivery and installation',
      deliveryText: 'Delivery and installation are free in the major cities we serve. Elsewhere we ship through a courier and add a fee that we state before you confirm. The install team removes the packaging and leaves the space clean.',
      deliveryList: {
        a: 'We agree on the installation slot two days in advance.',
        b: 'Upper floors without a lift may carry a carrying fee.',
        c: 'The space needs to be empty and ready before the team arrives.'
      },
      warrantyTitle: 'Warranty',
      warrantyText: 'Two years on build and structure, one year on moving parts (hinges, runners, pistons). It covers manufacturing and assembly defects; it does not cover misuse, excess humidity, or modification outside our workshops.',
      returnsTitle: 'Changes and cancellation',
      returnsText: 'Made-to-measure pieces cannot be resold, because they are built for one specific space. However:',
      returnsList: {
        a: 'You can cancel within 48 hours of confirmation and get the full deposit back.',
        b: 'If a piece arrives with a manufacturing defect or the wrong size, we repair or rebuild it at our cost.',
        c: 'If we deliver more than 7 days late through our own fault, you choose between a 10% discount or a full cancellation.'
      },
      paymentTitle: 'Payment',
      paymentText: '50% deposit once measurements are confirmed, the balance on delivery. Payment by bank transfer or cash on delivery.'
    },

    about: {
      title: 'About Yusr',
      lead: 'We started with a simple question: why is home furniture expensive and never the right size?',
      storyTitle: 'Our story',
      storyP1: 'Yusr began with a personal problem: an oddly shaped room and a ready-made wardrobe that would not fit. We went looking for a workshop that could build to size and found excellent Saudi workshops with no clear way to reach customers.',
      storyP2: 'Today we are a transparent middle layer: we take your request, measure the space, agree a price, and hand the job to the workshop that suits the piece. We follow production stage by stage and send you photos — and quality and warranty stay our responsibility, not the workshop’s.',
      storyP3: 'We hold no showroom and no stock. Every piece is built after it is ordered, which is what keeps the price lower and the fit exact.',
      partnersTitle: 'Workshops we partner with',
      partnersText: 'Selected Saudi workshops, each specialised in a different kind of work.',
      promiseTitle: 'Our quality promise',
      promiseList: {
        a: 'We inspect every piece at the workshop before shipping and send you the inspection photos.',
        b: 'Materials are named explicitly in the quote — no vague descriptions.',
        c: 'Any manufacturing defect within the warranty period is fixed at our cost.',
        d: 'The price we confirm is the final price. No fees appear later.'
      },
      statsTitle: 'By the numbers'
    },

    contact: {
      title: 'Contact us',
      lead: 'WhatsApp is fastest. We reply during working hours.',
      waTitle: 'WhatsApp',
      waText: 'For orders, questions and photos.',
      waCta: 'Start a chat',
      phoneTitle: 'Phone',
      emailTitle: 'E-mail',
      hoursTitle: 'Working hours',
      coverageTitle: 'Cities we cover',
      coverageText: 'Free delivery and installation in the marked cities, shipping everywhere else.',
      installBadge: 'Delivery + installation',
      mapTitle: 'Where we are',
      formTitle: 'Prefer to send a form?',
      formText: 'Use the request form and every detail reaches us in order.',
      formCta: 'Open the request form'
    },

    footer: {
      about: 'Yusr builds your home furniture to measure with Saudi workshops, and delivers it to your door.',
      links: 'Quick links',
      contact: 'Contact',
      social: 'Follow us',
      rights: 'All rights reserved.',
      maroof: 'Maroof verified',
      cr: 'Commercial Registration',
      vat: 'VAT number',
      instagram: 'Instagram', x: 'X', tiktok: 'TikTok', snapchat: 'Snapchat'
    },

    sticky: { cta: 'Order on WhatsApp' },

    meta: {
      home: { t: 'Yusr | Made-to-measure furniture, majlis, wardrobes and kitchens in Saudi Arabia', d: 'Yusr builds your furniture, majlis, wardrobes, kitchen and doors to your measurements with Saudi workshops — factory-direct pricing, nationwide delivery.' },
      products: { t: 'Products | Yusr', d: 'Browse the majlis, sofas, bedrooms, kitchens, doors and dining sets we build to measure, with starting prices and lead times.' },
      product: { t: 'Product details | Yusr', d: 'Specifications and options for the piece, with a direct WhatsApp request for your own measurements.' },
      custom: { t: 'Custom order | Yusr', d: 'Send your measurements and piece details, and we reply with a price within 24 working hours.' },
      how: { t: 'How it works | Yusr', d: 'From order to installation: the steps, delivery, warranty and cancellation policy in plain language.' },
      about: { t: 'About Yusr | Saudi-made, built to measure', d: 'The Yusr story, our partner workshops, and the quality promise we hold to on every order.' },
      contact: { t: 'Contact us | Yusr', d: 'WhatsApp, phone, e-mail, working hours and the cities we cover for delivery and installation.' }
    }
  }
};

export const LANGS = ['ar', 'en'];

/**
 * Resolve the active language: ?lang= wins, then localStorage, then the default.
 */
export function getLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(fromUrl)) return fromUrl;
  let stored = null;
  try { stored = localStorage.getItem(CONFIG.storageKey); } catch (_) { /* private mode */ }
  return LANGS.includes(stored) ? stored : CONFIG.defaultLang;
}

export function storeLang(lang) {
  try { localStorage.setItem(CONFIG.storageKey, lang); } catch (_) { /* private mode */ }
}

/** Look up a dotted key, e.g. t('home.faq.title'). Returns the key if missing. */
export function t(key, lang) {
  const value = key.split('.').reduce((node, part) => (node == null ? node : node[part]), DICT[lang]);
  return value == null ? key : value;
}

/** Pick the active-language value from a { ar, en } object; falls back to the other language. */
export function pick(obj, lang) {
  if (obj == null) return '';
  if (typeof obj !== 'object') return String(obj);
  return obj[lang] ?? obj[lang === 'ar' ? 'en' : 'ar'] ?? '';
}

const FORMATTERS = {
  ar: new Intl.NumberFormat(CONFIG.arabicNumerals ? 'ar-SA-u-nu-arab' : 'en-US'),
  en: new Intl.NumberFormat('en-US')
};

/** Grouped number in the language's numerals: ٢٬٩٠٠ / 2,900. */
export function formatNumber(n, lang) {
  return (FORMATTERS[lang] || FORMATTERS.en).format(n);
}

/** "٢٬٩٠٠ ر.س" / "2,900 SAR" */
export function formatPrice(amount, lang) {
  return `${formatNumber(amount, lang)} ${DICT[lang].currency}`;
}

/** "١٢ يوم" / "12 days" */
export function formatDays(days, lang) {
  return `${formatNumber(days, lang)} ${t('common.day', lang)}`;
}

/** "١٢ منتج" / "12 products" */
export function formatCount(n, lang) {
  const noun = lang === 'en' && n === 1 ? t('common.product', lang) : t('common.products', lang);
  return `${formatNumber(n, lang)} ${noun}`;
}
