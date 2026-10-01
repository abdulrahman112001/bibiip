/**
 * ⚠️ محتوى مؤقت (Placeholder) لموقع "بيب بيب".
 * الأرقام والآراء تقريبية — استبدلها بالمحتوى الحقيقي لاحقًا.
 * كل النصوص ثنائية اللغة: { en, ar }.
 */

import type { L } from "./i18n";

/** نفس مسار الصورة لعربي وإنجليزي كقيمة افتراضية - يتغير من لوحة التحكم لكل لغة لوحدها */
const img = (path: string): L => ({ en: path, ar: path });

export const brand = {
  name: { en: "Beep Beep", ar: "بيب بيب" } as L,
  tagline: {
    en: "Rides, freight, delivery & groceries — all in one app.",
    ar: "مشاوير، نقل، توصيل، وسوبر ماركت — كله بين ايديك.",
  } as L,
};

export const nav = {
  links: [
    { href: "#services", label: { en: "Services", ar: "خدماتنا" } as L },
    { href: "#how", label: { en: "How It Works", ar: "إزاي تطلب" } as L },
    { href: "#features", label: { en: "Features", ar: "المميزات" } as L },
    { href: "#calculator", label: { en: "Fare Calculator", ar: "احسب رحلتك" } as L },
    { href: "#plans", label: { en: "Plans", ar: "الاشتراكات" } as L },
    { href: "#faq", label: { en: "FAQ", ar: "الأسئلة" } as L },
  ],
  cta: { en: "Download the App", ar: "حمّل التطبيق" } as L,
};

export const hero = {
  eyebrow: { en: "100% EGYPTIAN APP", ar: "تطبيق مصري 100%" } as L,
  title: {
    en: "Order, move, deliver — all in your hand.",
    ar: "انقل، اطلب، اوصل... كله بين ايديك.",
  } as L,
  subtitle: {
    en: "Beep Beep brings everything you need into one app: rides, freight, parcel delivery and grocery shopping — with clear prices and live tracking.",
    ar: "بيب بيب يجمعلك كل حاجة محتاجها في يومك: مشاوير، نقل بضايع، توصيل طرود، وتسوق من السوبر ماركت — في تطبيق واحد بس، بأسعار واضحة وتتبع لحظي.",
  } as L,
  ctaPrimary: { en: "Download the App", ar: "حمّل التطبيق" } as L,
  ctaSecondary: { en: "Explore Services", ar: "اعرف خدماتنا" } as L,
  mockup: { en: "/brand/hero-mockup.png", ar: "/brand/hero-mockup.png" } as L,
  video: img("/brand/action-reel.mp4"),
  stats: [
    { value: "+50", label: { en: "Coverage areas", ar: "منطقة تغطية" } as L },
    { value: "24/7", label: { en: "Live support", ar: "دعم على مدار الساعة" } as L },
    { value: "4", label: { en: "Services, one app", ar: "خدمات في تطبيق واحد" } as L },
  ],
};

export const ourStory = {
  eyebrow: { en: "OUR STORY", ar: "قصتنا" } as L,
  manifesto: {
    en: "We built Beep Beep for the streets you actually live on. Every ride, every parcel, every grocery run — carried by real people, tracked live, at a price you see before you say yes.",
    ar: "بنينا بيب بيب عشان الشارع اللي انت عايش فيه فعلاً. كل مشوار، وكل طرد، وكل طلبية سوبر ماركت — بيوصلها ناس حقيقية، وانت شايف كل حاجة أول بأول، وعارف السعر قبل ما توافق.",
  } as L,
  photos: [
    { src: img("/brand/service-rides-hero.jpg"), left: "6%", top: "4%", size: 150 },
    { src: img("/brand/service-transport-hero.jpg"), left: "82%", top: "6%", size: 160 },
    { src: img("/brand/source-assets/rides-booking.jpg"), left: "44%", top: "1%", size: 110 },
    { src: img("/brand/service-delivery-hero.jpg"), left: "2%", top: "32%", size: 130 },
    { src: img("/brand/service-market-hero.jpg"), left: "88%", top: "34%", size: 150 },
    { src: img("/brand/source-assets/transport-warehouse.jpg"), left: "6%", top: "57%", size: 140 },
    { src: img("/brand/source-assets/rides-door.jpg"), left: "88%", top: "60%", size: 130 },
    { src: img("/brand/source-assets/market-scooter.jpg"), left: "4%", top: "80%", size: 120 },
    { src: img("/brand/source-assets/delivery-groceries-handoff.jpg"), left: "86%", top: "82%", size: 140 },
  ],
};

export const services = {
  eyebrow: { en: "OUR SERVICES", ar: "خدماتنا" } as L,
  title: {
    en: "Everything you need, in one place.",
    ar: "كل اللي محتاجه في مكان واحد.",
  } as L,
  body: {
    en: "From a quick ride to moving heavy cargo — pick a service and go.",
    ar: "من مشوار سريع لحد نقل حمولة تقيلة — اختار خدمتك وانطلق.",
  } as L,
  items: [
    {
      key: "rides",
      title: { en: "Rides", ar: "مشاوير" } as L,
      desc: {
        en: "Book a car in one tap, track your driver live, and travel at a clear price with no surprises.",
        ar: "اطلب عربيتك بنقرة واحدة، تابع مكان السائق لحظة بلحظة، وسافر بسعر واضح من غير مفاجآت.",
      } as L,
      image: img("/brand/service-rides-hero.jpg"),
      icon: "🚗",
    },
    {
      key: "transport",
      title: { en: "Freight", ar: "نقل" } as L,
      desc: {
        en: "Moving heavy items? Choose a half-ton, quarter-ton or tuk-tuk and set your pickup and drop-off.",
        ar: "محتاج تنقل أغراض تقيلة؟ اختار نص نقل أو ربع نقل أو تروسيكل، وحدد مكان التحميل والتفريغ.",
      } as L,
      image: img("/brand/service-transport-hero.jpg"),
      icon: "🚚",
    },
    {
      key: "delivery",
      title: { en: "Parcel Delivery", ar: "توصيل" } as L,
      desc: {
        en: "Send a parcel to anyone in the city and follow its journey on the map until it arrives safely.",
        ar: "ابعت طرد لأي حد في المدينة وتابع رحلته على الخريطة أول بأول لحد ما يوصل بالسلامة.",
      } as L,
      image: img("/brand/service-delivery-hero.jpg"),
      icon: "📦",
    },
    {
      key: "market",
      title: { en: "Groceries", ar: "سوبر ماركت" } as L,
      desc: {
        en: "Order from the nearest supermarket and get it delivered to your door without leaving home.",
        ar: "اطلب احتياجاتك من أقرب سوبر ماركت وهيوصلك للباب من غير ما تتحرك من مكانك.",
      } as L,
      image: img("/brand/service-market-hero.jpg"),
      icon: "🛒",
    },
  ],
};

export const howItWorks = {
  eyebrow: { en: "HOW IT WORKS", ar: "إزاي تطلب" } as L,
  title: {
    en: "From order to arrival — in a few taps.",
    ar: "من الطلب للوصول — في كام نقرة.",
  } as L,
  steps: [
    {
      no: "01",
      title: { en: "Choose a service", ar: "اختار خدمتك" } as L,
      desc: {
        en: "Pick a ride, freight, delivery or groceries and set your location.",
        ar: "اختار مشوار أو نقل أو توصيل أو سوبر ماركت وحدد مكانك.",
      } as L,
    },
    {
      no: "02",
      title: { en: "See a clear price", ar: "شوف السعر واضح" } as L,
      desc: {
        en: "Know your fare upfront before you confirm — no hidden fees.",
        ar: "اعرف السعر قبل ما تأكد الطلب — من غير رسوم مفاجئة.",
      } as L,
    },
    {
      no: "03",
      title: { en: "Track live", ar: "تابع لحظة بلحظة" } as L,
      desc: {
        en: "Follow your driver or courier on the map in real time.",
        ar: "تابع السائق أو المندوب على الخريطة أول بأول.",
      } as L,
    },
    {
      no: "04",
      title: { en: "Arrive & pay", ar: "استلم وادفع" } as L,
      desc: {
        en: "Get there safely and pay cash or with your in-app wallet.",
        ar: "توصل بالسلامة وتدفع كاش أو من المحفظة جوا التطبيق.",
      } as L,
    },
  ],
};

export const features = {
  eyebrow: { en: "WHY BEEP BEEP", ar: "ليه بيب بيب" } as L,
  title: {
    en: "Built to make your day easier.",
    ar: "معمول عشان يسهّل يومك.",
  } as L,
  items: [
    {
      title: { en: "Live map tracking", ar: "تتبع لحظي بالخريطة" } as L,
      desc: {
        en: "See your driver or courier from order to delivery.",
        ar: "شوف مكان المندوب أو السائق من لحظة الطلب لحد التسليم.",
      } as L,
    },
    {
      title: { en: "Clear prices upfront", ar: "أسعار واضحة من الأول" } as L,
      desc: {
        en: "Know the price before you confirm — no hidden fees.",
        ar: "تعرف السعر قبل ما تأكد الطلب، من غير رسوم مفاجئة.",
      } as L,
    },
    {
      title: { en: "Cash or wallet", ar: "دفع كاش أو محفظة" } as L,
      desc: {
        en: "Pay the way you like — cash, wallet or card.",
        ar: "ادفع بالطريقة اللي تريحك، كاش أو محفظة أو بطاقة.",
      } as L,
    },
    {
      title: { en: "Safe in-app contact", ar: "تواصل آمن جوا التطبيق" } as L,
      desc: {
        en: "Chat or call your driver without sharing your number.",
        ar: "كلم السائق أو المندوب من غير ما تشارك رقمك.",
      } as L,
    },
  ],
};

export const calculator = {
  eyebrow: { en: "FARE CALCULATOR", ar: "احسب رحلتك" } as L,
  title: {
    en: "Know your fare before you order.",
    ar: "اعرف تكلفة رحلتك قبل ما تطلب.",
  } as L,
  body: {
    en: "Adjust the details below to see an estimated price — the real price always shows before you confirm.",
    ar: "عدّل التفاصيل بالأسفل عشان تشوف السعر التقديري — السعر الحقيقي دايمًا بيظهر قبل التأكيد.",
  } as L,
  serviceLabel: { en: "Service", ar: "الخدمة" } as L,
  serviceOptions: [
    { key: "rides", label: { en: "Ride", ar: "مشوار" } as L, perKm: 5 },
    { key: "transport", label: { en: "Freight", ar: "نقل" } as L, perKm: 9 },
    { key: "delivery", label: { en: "Delivery", ar: "توصيل" } as L, perKm: 6 },
  ],
  inputs: {
    distance: { en: "Distance (km)", ar: "المسافة (كم)" } as L,
    timing: { en: "Peak time", ar: "وقت الذروة" } as L,
  },
  peakLabel: { en: "Add peak-hour surcharge (+25%)", ar: "أضف زيادة وقت الذروة (+25%)" } as L,
  resultLabel: { en: "Estimated fare", ar: "التكلفة التقديرية" } as L,
  note: {
    en: "* Estimate only. Final price is confirmed in the app.",
    ar: "* تقدير فقط. السعر النهائي بيتأكد جوا التطبيق.",
  } as L,
};

export const walkthrough = {
  eyebrow: { en: "INSIDE THE APP", ar: "جوا التطبيق" } as L,
  title: {
    en: "A closer look at Beep Beep.",
    ar: "نظرة أقرب على بيب بيب.",
  } as L,
  tabs: [
    {
      key: "tracking",
      label: { en: "Parcel tracking", ar: "تتبع الطرد" } as L,
      image: img("/brand/service-tracking.png"),
      desc: {
        en: "Follow your parcel step by step on the map until it arrives safely.",
        ar: "تابع رحلة طردك على الخريطة خطوة بخطوة لحد ما يوصل بالسلامة.",
      } as L,
    },
    {
      key: "driver",
      label: { en: "Driver info", ar: "معلومات السائق" } as L,
      image: img("/brand/driver-info.png"),
      desc: {
        en: "Relax before the trip: driver name, rating and full car details.",
        ar: "اطمن قبل الرحلة: اسم السائق، تقييمه، وبيانات العربية كاملة.",
      } as L,
    },
    {
      key: "chat",
      label: { en: "Contact", ar: "التواصل" } as L,
      image: img("/brand/service-chat.png"),
      desc: {
        en: "Chat with your driver or courier from inside the app, no number shared.",
        ar: "كلم السائق أو المندوب مباشرة من جوا التطبيق من غير ما تشارك رقمك.",
      } as L,
    },
    {
      key: "rewards",
      label: { en: "Rewards & offers", ar: "المكافآت والعروض" } as L,
      image: img("/brand/rewards.png"),
      desc: {
        en: "Earn points with every order and redeem them for exclusive discounts.",
        ar: "اجمع نقاط مع كل طلب واستخدمها في خصومات وعروض حصرية.",
      } as L,
    },
  ],
};

export const plans = {
  eyebrow: { en: "PLANS", ar: "الاشتراكات" } as L,
  title: {
    en: "Subscribe and save more.",
    ar: "اشترك ووفّر أكتر.",
  } as L,
  body: {
    en: "Pick the plan that fits your rhythm. Prices are placeholders.",
    ar: "اختار الباقة اللي تناسب إيقاعك. الأسعار مبدئية.",
  } as L,
  perWeek: { en: "/ week", ar: "/ أسبوع" } as L,
  currency: { en: "EGP", ar: "ج.م" } as L,
  ctaLabel: { en: "Subscribe", ar: "اشتراك" } as L,
  items: [
    {
      name: { en: "Smart Saver", ar: "موفر ذكي" } as L,
      price: "99",
      highlighted: false,
      features: [
        { en: "5% off every ride", ar: "خصم 5% على كل الرحلات" } as L,
        { en: "Free cancellation", ar: "إلغاء مجاني" } as L,
        { en: "First offer alerts", ar: "تنبيهات العروض أول بأول" } as L,
      ],
    },
    {
      name: { en: "Traveler", ar: "مسافر" } as L,
      price: "199",
      highlighted: true,
      features: [
        { en: "Fixed prices all week", ar: "أسعار ثابتة طول الأسبوع" } as L,
        { en: "Double reward points", ar: "نقاط مضاعفة" } as L,
        { en: "Priority matching", ar: "أولوية في الرحلات" } as L,
      ],
    },
    {
      name: { en: "VIP", ar: "VIP" } as L,
      price: "399",
      highlighted: false,
      features: [
        { en: "Top priority rides", ar: "أولوية قصوى في الرحلات" } as L,
        { en: "24/7 dedicated support", ar: "دعم مخصص 24/7" } as L,
        { en: "Family controls", ar: "رقابة أبوية" } as L,
      ],
    },
  ],
};

export const testimonials = {
  eyebrow: { en: "OUR CUSTOMERS", ar: "عملاؤنا" } as L,
  title: {
    en: "Loved across Egypt.",
    ar: "محبوب في كل مصر.",
  } as L,
  items: [
    {
      quote: {
        en: "I use Beep Beep every day for work — clear pricing, respectful drivers, and tracking gives me peace of mind.",
        ar: "بستخدم بيب بيب يوميًا للشغل، السعر واضح والسواق محترم والتتبع بيريّحني.",
      } as L,
      name: { en: "Ahmed", ar: "أحمد" } as L,
      city: { en: "Cairo", ar: "القاهرة" } as L,
    },
    {
      quote: {
        en: "Moving furniture was so easy — I picked a half-ton truck and tracked everything to the door.",
        ar: "نقل العفش كان سهل جدًا — اخترت نص نقل وتابعت كل حاجة لحد الباب.",
      } as L,
      name: { en: "Mona", ar: "منى" } as L,
      city: { en: "Giza", ar: "الجيزة" } as L,
    },
    {
      quote: {
        en: "Sent a parcel across town and the courier arrived faster than I expected. Great app.",
        ar: "بعت طرد لناحية تانية والمندوب وصل أسرع مما توقعت. تطبيق ممتاز.",
      } as L,
      name: { en: "Karim", ar: "كريم" } as L,
      city: { en: "Alexandria", ar: "الإسكندرية" } as L,
    },
  ],
};

export const download = {
  eyebrow: { en: "GET THE APP", ar: "حمّل التطبيق" } as L,
  title: {
    en: "Your whole day, one tap away.",
    ar: "يومك كله على بُعد نقرة.",
  } as L,
  body: {
    en: "Download Beep Beep and start ordering rides, freight, delivery and groceries in minutes.",
    ar: "حمّل بيب بيب وابدأ تطلب مشاوير ونقل وتوصيل وسوبر ماركت في دقايق.",
  } as L,
  image: img("/brand/onboarding-1.png"),
  appStore: { en: "Download on the App Store", ar: "حمّل من App Store" } as L,
  googlePlay: { en: "Get it on Google Play", ar: "حمّل من Google Play" } as L,
  soon: { en: "Coming soon", ar: "قريبًا" } as L,
};

export const faq = {
  eyebrow: { en: "FAQ", ar: "الأسئلة الشائعة" } as L,
  title: {
    en: "Questions? We've got answers.",
    ar: "عندك سؤال؟ عندنا الإجابة.",
  } as L,
  items: [
    {
      q: { en: "Which areas is the app available in?", ar: "التطبيق شغال في أنهي مناطق؟" } as L,
      a: {
        en: "Beep Beep currently covers selected areas and we're expanding continuously.",
        ar: "بيب بيب بيغطي حاليًا مناطق مختارة، وبنوسّع التغطية أول بأول.",
      } as L,
    },
    {
      q: { en: "Can I pay cash?", ar: "أقدر أدفع كاش؟" } as L,
      a: {
        en: "Yes, you can pay cash or through the in-app wallet.",
        ar: "أيوه، تقدر تدفع كاش أو من خلال المحفظة الإلكترونية جوا التطبيق.",
      } as L,
    },
    {
      q: { en: "How do I track my order?", ar: "إزاي أتابع طلبي؟" } as L,
      a: {
        en: "From the moment you confirm, you can track your driver or courier live on the map.",
        ar: "من لحظة تأكيد الطلب هتقدر تتابع مكان السائق أو المندوب لحظة بلحظة على الخريطة.",
      } as L,
    },
    {
      q: { en: "What freight types are available?", ar: "أنواع النقل المتاحة إيه؟" } as L,
      a: {
        en: "Half-ton, quarter-ton and tuk-tuk — choose based on your load.",
        ar: "نص نقل، ربع نقل، وتروسيكل — اختار حسب حمولتك.",
      } as L,
    },
    {
      q: { en: "When will the app be available?", ar: "إمتى التطبيق هيبقى متاح؟" } as L,
      a: {
        en: "The app is in preparation and we'll announce the launch date soon.",
        ar: "التطبيق تحت التجهيز حاليًا، وهنعلن عن موعد الإطلاق قريبًا.",
      } as L,
    },
  ],
};

export const footer = {
  columns: [
    {
      title: { en: "Services", ar: "الخدمات" } as L,
      links: [
        { en: "Rides", ar: "مشاوير" } as L,
        { en: "Freight", ar: "نقل" } as L,
        { en: "Delivery", ar: "توصيل" } as L,
        { en: "Groceries", ar: "سوبر ماركت" } as L,
      ],
    },
    {
      title: { en: "Company", ar: "الشركة" } as L,
      links: [
        { en: "About", ar: "عن بيب بيب" } as L,
        { en: "Careers", ar: "الوظائف" } as L,
        { en: "Contact", ar: "تواصل معنا" } as L,
      ],
    },
  ],
  rights: { en: "All rights reserved.", ar: "كل الحقوق محفوظة." } as L,
};

export const seo = {
  metaTitle: {
    en: "Beep Beep | Rides, Freight, Delivery — all in your hand.",
    ar: "بيب بيب | مشاوير، نقل، توصيل... كله بين ايديك",
  } as L,
  metaDescription: {
    en: "Beep Beep is Egypt's all-in-one delivery and transport app. Book rides, move freight, send parcels and shop groceries — with clear prices and live tracking.",
    ar: "بيب بيب - تطبيق التوصيل والنقل المصري. اطلب مشوارك، انقل شحنتك، وتابع طلبك لحظة بلحظة. مشاوير، نقل، توصيل، وسوبر ماركت في تطبيق واحد.",
  } as L,
  keywords: {
    en: "ride hailing app Egypt, delivery app Egypt, freight transport app, parcel delivery, grocery delivery, Beep Beep app",
    ar: "تطبيق مشاوير مصر, تطبيق توصيل مصر, تطبيق نقل بضائع, توصيل طرود, توصيل سوبر ماركت, تطبيق بيب بيب",
  } as L,
  siteName: { en: "Beep Beep", ar: "بيب بيب" } as L,
  ogImage: img("/brand/logo.png"),
  canonicalUrl: "https://www.bibiip.online",
  twitterHandle: "",
  noIndex: false,
  googleSiteVerification: "",
  contactEmail: "",
  contactPhone: "",
  social: {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    linkedin: "",
    whatsapp: "",
  },
};
