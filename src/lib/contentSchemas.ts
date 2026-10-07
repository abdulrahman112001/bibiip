/**
 * وصف شكل كل سكشن (مش القيم نفسها) - بيستخدمه محرّك الفورم العام في لوحة
 * التحكم عشان يعرف يرسم إيه لكل حقل، من غير ما نكتب فورم مخصص لكل سكشن
 * لوحده. أي سكشن جديد نضيفه في content.ts، بنضيفله وصف هنا بس وخلاص.
 */

import type { L as Bilingual } from "./i18n";

export type HelpLink = { label: string; url: string };

export type Field =
  | { kind: "bilingual"; label: string; multiline?: boolean }
  | { kind: "text"; label: string; helpLink?: HelpLink }
  | { kind: "number"; label: string }
  | { kind: "boolean"; label: string }
  | { kind: "image"; label: string }
  | { kind: "video"; label: string }
  | { kind: "object"; label: string; fields: FieldMap }
  | { kind: "array"; label: string; of: ArrayItemSchema };

export type ArrayItemSchema =
  | { kind: "bilingual" }
  | { kind: "text" }
  | { kind: "object"; fields: FieldMap; titleField?: string };

export type FieldMap = Record<string, Field>;

const L = (label: string, multiline = false): Field => ({ kind: "bilingual", label, multiline });
const T = (label: string, helpLink?: HelpLink): Field => ({ kind: "text", label, helpLink });
const N = (label: string): Field => ({ kind: "number", label });
const B = (label: string): Field => ({ kind: "boolean", label });
const IMG = (label: string): Field => ({ kind: "image", label });
const VID = (label: string): Field => ({ kind: "video", label });

export const contentSchemas: Record<string, FieldMap> = {
  brand: {
    name: L("اسم البراند"),
    tagline: L("الشعار الترويجي (Tagline)"),
  },

  nav: {
    links: {
      kind: "array",
      label: "روابط القائمة",
      of: {
        kind: "object",
        titleField: "href",
        fields: { href: T("الرابط (#anchor)"), label: L("النص") },
      },
    },
    cta: L("زرار التحميل في الهيدر"),
  },

  hero: {
    eyebrow: L("الشارة الصغيرة فوق العنوان"),
    title: L("العنوان الرئيسي"),
    subtitle: L("الوصف", true),
    ctaPrimary: L("زرار أساسي"),
    ctaSecondary: L("زرار ثانوي"),
    video: VID("فيديو الهيرو (الخلفية المتحركة فوق الصفحة)"),
    stats: {
      kind: "array",
      label: "الإحصائيات (تحت الأزرار)",
      of: {
        kind: "object",
        titleField: "value",
        fields: { value: T("الرقم"), label: L("الوصف") },
      },
    },
  },

  ourStory: {
    eyebrow: L("الشارة الصغيرة"),
    manifesto: L("النص الرئيسي (قصتنا)", true),
    photos: {
      kind: "array",
      label: "الصور المتبعترة",
      of: {
        kind: "object",
        titleField: "src",
        fields: {
          src: IMG("الصورة"),
          left: T("المسافة من اليسار (%)"),
          top: T("المسافة من فوق (%)"),
          size: N("الحجم (بكسل)"),
        },
      },
    },
  },

  services: {
    eyebrow: L("الشارة الصغيرة"),
    title: L("العنوان"),
    body: L("الوصف"),
    items: {
      kind: "array",
      label: "الخدمات",
      of: {
        kind: "object",
        titleField: "key",
        fields: {
          key: T("مفتاح الخدمة (rides, transport...)"),
          title: L("الاسم"),
          desc: L("الوصف", true),
          image: IMG("الصورة"),
          icon: T("الإيموجي"),
        },
      },
    },
  },

  howItWorks: {
    eyebrow: L("الشارة الصغيرة"),
    title: L("العنوان"),
    steps: {
      kind: "array",
      label: "الخطوات",
      of: {
        kind: "object",
        titleField: "no",
        fields: { no: T("الرقم (01, 02...)"), title: L("العنوان"), desc: L("الوصف", true) },
      },
    },
  },

  features: {
    eyebrow: L("الشارة الصغيرة"),
    title: L("العنوان"),
    items: {
      kind: "array",
      label: "المميزات",
      of: { kind: "object", fields: { title: L("العنوان"), desc: L("الوصف", true) } },
    },
  },

  calculator: {
    eyebrow: L("الشارة الصغيرة"),
    title: L("العنوان"),
    body: L("الوصف"),
    serviceLabel: L("عنوان اختيار الخدمة"),
    serviceOptions: {
      kind: "array",
      label: "خيارات الخدمة",
      of: {
        kind: "object",
        titleField: "key",
        fields: {
          key: T("المفتاح"),
          label: L("الاسم"),
          perKm: N("السعر لكل كيلومتر"),
        },
      },
    },
    inputs: {
      kind: "object",
      label: "تسميات الحقول",
      fields: { distance: L("المسافة"), timing: L("وقت الذروة") },
    },
    peakLabel: L("نص إضافة رسوم الذروة"),
    resultLabel: L("عنوان النتيجة"),
    note: L("ملاحظة أسفل الحاسبة"),
  },

  walkthrough: {
    eyebrow: L("الشارة الصغيرة"),
    title: L("العنوان"),
    tabs: {
      kind: "array",
      label: "التابات",
      of: {
        kind: "object",
        titleField: "key",
        fields: {
          key: T("المفتاح"),
          label: L("اسم التاب"),
          image: IMG("صورة الشاشة"),
          desc: L("الوصف", true),
        },
      },
    },
  },

  plans: {
    eyebrow: L("الشارة الصغيرة"),
    title: L("العنوان"),
    body: L("الوصف"),
    perWeek: L("نص (/ أسبوع)"),
    currency: L("العملة"),
    ctaLabel: L("نص زرار الاشتراك (تحت كل باقة)"),
    items: {
      kind: "array",
      label: "الاشتراكات",
      of: {
        kind: "object",
        titleField: "price",
        fields: {
          name: L("اسم الباقة"),
          price: T("السعر"),
          highlighted: B("مميّزة (تتحط في النص بخط أكبر)"),
          features: { kind: "array", label: "مميزات الباقة", of: { kind: "bilingual" } },
        },
      },
    },
  },

  testimonials: {
    eyebrow: L("الشارة الصغيرة"),
    title: L("العنوان"),
    items: {
      kind: "array",
      label: "الآراء",
      of: {
        kind: "object",
        titleField: "name",
        fields: { quote: L("رأي العميل", true), name: L("الاسم"), city: L("المدينة") },
      },
    },
  },

  download: {
    eyebrow: L("الشارة الصغيرة"),
    title: L("العنوان"),
    body: L("الوصف"),
    image: IMG("الصورة"),
    appStore: L("نص App Store"),
    googlePlay: L("نص Google Play"),
    soon: L("نص 'قريبًا'"),
  },

  faq: {
    eyebrow: L("الشارة الصغيرة"),
    title: L("العنوان"),
    items: {
      kind: "array",
      label: "الأسئلة",
      of: {
        kind: "object",
        titleField: "q",
        fields: { q: L("السؤال"), a: L("الإجابة", true) },
      },
    },
  },

  footer: {
    columns: {
      kind: "array",
      label: "أعمدة الفوتر",
      of: {
        kind: "object",
        titleField: "title",
        fields: {
          title: L("عنوان العمود"),
          links: {
            kind: "array",
            label: "الروابط",
            of: {
              kind: "object",
              titleField: "href",
              fields: {
                href: T("الرابط (#anchor أو #contact لفتح نافذة تواصل)"),
                label: L("النص"),
              },
            },
          },
        },
      },
    },
    rights: L("نص حقوق النشر"),
  },

  seo: {
    metaTitle: L("عنوان الصفحة (Title Tag)"),
    metaDescription: L("وصف الصفحة (Meta Description)", true),
    keywords: L("الكلمات المفتاحية (افصل بينهم بفاصلة)", true),
    siteName: L("اسم الموقع (Site Name)"),
    ogImage: IMG("صورة المشاركة (Open Graph / Twitter Card)"),
    canonicalUrl: T("الرابط الأساسي للموقع (Canonical URL)"),
    twitterHandle: T("حساب X / تويتر (اختياري، مثال: @beepbeep)"),
    noIndex: B("إخفاء الموقع من نتائج البحث (Noindex) - استخدمها وقت التطوير بس"),
    googleSiteVerification: T("كود تاكيد ملكية الموقع Google Search Console", {
      label: "افتح لوحة Google Search Console",
      url: "https://search.google.com/search-console?resource_id=https%3A%2F%2Fwww.bibiip.online%2F",
    }),
    contactEmail: T("إيميل التواصل (يظهر في نتائج البحث وبيانات الشركة)"),
    contactPhone: T("رقم الهاتف/واتساب للتواصل (اختياري)"),
    social: {
      kind: "object",
      label: "روابط السوشيال ميديا",
      fields: {
        facebook: T("فيسبوك"),
        instagram: T("انستجرام"),
        tiktok: T("تيك توك"),
        youtube: T("يوتيوب"),
        linkedin: T("لينكدإن"),
        whatsapp: T("رابط واتساب (مثال: https://wa.me/2010...)"),
      },
    },
  },
};

export const sectionLabels: Record<string, Bilingual> = {
  brand: { en: "Brand Identity", ar: "هوية البراند" },
  nav: { en: "Navigation Menu", ar: "قائمة التنقل" },
  hero: { en: "Hero", ar: "الهيرو" },
  ourStory: { en: "Our Story", ar: "قصتنا" },
  services: { en: "Services", ar: "الخدمات" },
  howItWorks: { en: "How It Works", ar: "إزاي تطلب" },
  features: { en: "Features", ar: "المميزات" },
  calculator: { en: "Fare Calculator", ar: "حاسبة الرحلة" },
  walkthrough: { en: "App Walkthrough", ar: "جوا التطبيق" },
  plans: { en: "Plans", ar: "الاشتراكات" },
  testimonials: { en: "Testimonials", ar: "آراء العملاء" },
  download: { en: "Download CTA", ar: "حمّل التطبيق" },
  faq: { en: "FAQ", ar: "الأسئلة الشائعة" },
  footer: { en: "Footer", ar: "الفوتر" },
  seo: { en: "SEO", ar: "تحسين محركات البحث (SEO)" },
};
