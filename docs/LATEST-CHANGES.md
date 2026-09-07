# توثيق آخر تحديث — موقع بيب بيب 🐝

> آخر شغل: **لوحة تحكم أدمن كاملة** بتتحكم في كل محتوى الموقع عن طريق APIs
> (قاعدة بيانات + تسجيل دخول + فورم عام لكل سكشن) — التفاصيل الكاملة في
> [ADMIN-DASHBOARD.md](./ADMIN-DASHBOARD.md).
> التاريخ: 2026-09-07

---

## -1) لوحة تحكم الأدمن (2026-09-07)

الموقع بقى بيقرا كل محتواه (نصوص، صور، أرقام) من قاعدة بيانات بدل ملف
`content.ts` الثابت، وفيه لوحة تحكم كاملة (`/admin`) لتعديل أي سكشن من
غير ما تلمس كود. راجع [ADMIN-DASHBOARD.md](./ADMIN-DASHBOARD.md) للتفاصيل
الكاملة (تسجيل الدخول، الـ APIs، إزاي تضيف سكشن جديد، والانتقال لقاعدة
بيانات حقيقية وقت النشر).

`content.ts` نفسه فضل موجود كـ **fallback** (لو قاعدة البيانات مش شغالة)
ومصدر لأول تعبئة (seed) للبيانات — مبقاش هو المصدر الوحيد للمحتوى.

---

## 0) الإضافة الجديدة (2026-08-30) — ميكس waabi.ai + terminal-industries.com

فيديو خلفية سينمائي فوق الصفحة، وسكشن جديد "قصتنا" (`OurStory`) بصور
حقيقية متبعتره حوالين نص بيتلوّن كلمة كلمة مع السكرول (نفس فكرة "We built
our own road" في Waabi) — كل ده بهوية بيب بيب الفاتحة (أصفر/بني)، من غير
أي تحول للأسود زي المرجعين الأصليين.

---

## 0) الإضافة الجديدة (2026-08-30)

| الملف | الوصف |
|---|---|
| [HeroReel.tsx](../src/components/HeroReel.tsx) | فيديو `hero-reel.mp4` (شاحنة → تاكسي → مندوب توصيل) خلفية فوق الصفحة، بيتشغل ويلف لوحده (`autoplay + loop`) — استريمنج مباشر، من غير أي تحكم يدوي في السكرول. **هو اللي بيستخدم دلوقتي.** |
| ~~[ScrollTransportScene.tsx](../src/components/ScrollTransportScene.tsx)~~ | النسخة الأولى: نفس الفيديو بس متثبت بالسكرول (pin + scrub يدوي في `video.currentTime`). اتجرّب النسختين، والفيديو المباشر (`HeroReel`) طلع أنعم وبسيط أكتر فاستبدلناه. الكود لسه موجود لو حبينا نرجعله. |
| [OurStory.tsx](../src/components/OurStory.tsx) | صور حقيقية (9 صور) متوزعة حوالين نص "قصتنا"، والنص بيبان كلمة كلمة (فيد-إن) مع السكرول عن طريق `useScroll`/`useTransform` لكل كلمة لوحدها. البيانات والصور في `ourStory` جوا [content.ts](../src/lib/content.ts). |

**ملاحظة تقنية (باگ اتصلح في نسخة السكرول القديمة):** عند التحكم اليدوي في `video.currentTime` بناءً على السكرول، لازم تستنى الـ `seeked` event يخلص قبل ما تبعت طلب seek جديد — لو غيّرت `currentTime` في كل تحديث سكرول من غير انتظار، المتصفح بيراكم الطلبات والفيديو بيفضل عالق على نفس الفريم تقريبًا. المشكلة دي مبقتش موجودة أصلًا في `HeroReel` لأنه مش بيتحكم في `currentTime` خالص.

---

## 1) نظرة عامة على التغيير

رجّعنا الموقع لهوية بيب بيب الحقيقية:

| العنصر | قبل (Physical AI) | بعد (بيب بيب) |
|---|---|---|
| **الألوان** | أسود + أزرق/سماوي | أبيض دافئ + أصفر `#ffc413` + بني `#532813` |
| **الجمهور** | شركات لوجستية B2B | مستخدمين مصريين |
| **المحتوى** | شاحنات ذاتية/ساحات | مشاوير، نقل، توصيل، سوبر ماركت |
| **اللغة الافتراضية** | إنجليزي (LTR) | عربي (RTL) + تبديل للإنجليزي |

**اتحافظ عليه:** السكرول الناعم (Lenis)، أنيميشن الدخول (Reveal)، الهيدر المتفاعل مع السكرول + قائمة الموبايل، مسار GPS المتحرك في الهيرو، نظام اللغتين الكامل.

---

## 2) نظام الألوان (Design Tokens)

الملف: [src/app/globals.css](../src/app/globals.css)

```
bg / bg-elev / surface / surface-2  → خلفيات فاتحة دافئة
text / text-muted / text-dim        → درجات البني
brand-yellow / -dark / -soft        → الأصفر الذهبي
brand-ink / -soft                   → البني الغامق
```
Helpers: `grid-bg`, `glow-yellow`, `glow-soft`, `text-gradient`.

---

## 3) نظام اللغتين (i18n)

الملف: [src/lib/i18n.tsx](../src/lib/i18n.tsx)

- `LanguageProvider` — يخزّن اللغة في `localStorage` ويضبط `dir`/`lang` تلقائيًا.
- `useLang()` → `{ lang, dir, setLang, toggle, t }`.
- `t(value)` — بيرجّع النص حسب اللغة من كائن `{ en, ar }`.
- الافتراضي: **عربي (RTL)**؛ زر التبديل في الهيدر.

كل النصوص في [src/lib/content.ts](../src/lib/content.ts) بصيغة `{ en, ar }` (placeholder جاهز للاستبدال).

---

## 4) بنية الأقسام

الملف الرئيسي: [src/app/page.tsx](../src/app/page.tsx)

| # | القسم | الملف | ملاحظات |
|---|---|---|---|
| — | الهيدر | [Header.tsx](../src/components/Header.tsx) | متفاعل مع السكرول + قائمة موبايل + زر لغة |
| — | فيديو الخلفية | [HeroReel.tsx](../src/components/HeroReel.tsx) | فيديو خلفية autoplay + loop (قبل الهيرو) |
| 1 | الهيرو | [Hero.tsx](../src/components/Hero.tsx) | mockup التطبيق + مسار GPS متحرك |
| 1.5 | قصتنا | [OurStory.tsx](../src/components/OurStory.tsx) | صور حقيقية متبعتره + نص بيتلوّن مع السكرول |
| 2 | الخدمات | [Services.tsx](../src/components/Services.tsx) | 4 كروت بصور حقيقية |
| 3 | إزاي تطلب | [HowItWorks.tsx](../src/components/HowItWorks.tsx) | 4 خطوات |
| 4 | المميزات | [Features.tsx](../src/components/Features.tsx) | 4 مميزات |
| 5 | حاسبة الرحلة | [Calculator.tsx](../src/components/Calculator.tsx) | تفاعلية (نوع/مسافة/ذروة) |
| 6 | جوا التطبيق | [Walkthrough.tsx](../src/components/Walkthrough.tsx) | تابات بشاشات التطبيق |
| 7 | الباقات | [Plans.tsx](../src/components/Plans.tsx) | 3 باقات |
| 8 | آراء العملاء | [Testimonials.tsx](../src/components/Testimonials.tsx) | 3 آراء |
| 9 | حمّل التطبيق | [Download.tsx](../src/components/Download.tsx) | خلفية داكنة + أزرار المتاجر |
| 10 | الأسئلة الشائعة | [FAQ.tsx](../src/components/FAQ.tsx) | أكورديون |
| — | الفوتر | [Footer.tsx](../src/components/Footer.tsx) | روابط + سوشيال |

مكوّنات مساعدة: `SectionHeading`, `Reveal`, `SmoothScroll`.

---

## 5) إصلاح خطأ (Runtime)

**الخطأ:** `Cannot read properties of undefined (reading 'ar')` في الفوتر.
**السبب:** الفوتر كان بيقرأ `footer.tagline` بعد ما اتنقلت لـ `brand.tagline`.
**الحل:** تعديل [Footer.tsx](../src/components/Footer.tsx) ليستخدم `brand.tagline`.

---

## 6) اللي محتاج استبدال لاحقًا (Placeholders)

- **الأسعار** في الباقات وحاسبة الرحلة ([content.ts](../src/lib/content.ts)).
- **آراء العملاء** الحقيقية.
- **لينكات السوشيال ومتاجر التطبيقات**.
- ~~(اختياري) فيديو سينمائي للهيرو بدل مسار الـ SVG~~ ← **تم** (`ScrollTransportScene.tsx`).

---

## 7) تشغيل المشروع

```bash
npm run dev     # التطوير
npm run build   # بناء للإنتاج
```
