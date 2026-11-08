/**
 * قائمة أقسام وصفحات الموقع الفعلية - بتستخدمها لوحة التحكم في أي حقل
 * "رابط" (kind: "link") عشان الأدمن يختار الوجهة بدل ما يكتبها يدويًا
 * ويغلط في الاسم. لو ضفت سكشن أو صفحة جديدة بـ id في الموقع، ضيفها هنا
 * كمان عشان تظهر في القائمة.
 */
export type LinkOption = { value: string; label: string };
export type LinkGroup = { label: string; options: LinkOption[] };

export const linkDestinationGroups: LinkGroup[] = [
  {
    label: "أقسام الصفحة الرئيسية",
    options: [
      { value: "#services", label: "خدماتنا" },
      { value: "#how", label: "إزاي تطلب" },
      { value: "#features", label: "المميزات" },
      { value: "#calculator", label: "احسب رحلتك" },
      { value: "#walkthrough", label: "جوا التطبيق" },
      { value: "#plans", label: "الاشتراكات" },
      { value: "#faq", label: "الأسئلة الشائعة" },
      { value: "#download", label: "حمّل التطبيق" },
    ],
  },
  {
    label: "خدمة بعينها (جوه قسم خدماتنا)",
    options: [
      { value: "#service-rides", label: "مشاوير" },
      { value: "#service-transport", label: "نقل" },
      { value: "#service-delivery", label: "توصيل" },
      { value: "#service-shopping", label: "تسوق" },
    ],
  },
  {
    label: "صفحات الموقع",
    options: [
      { value: "/", label: "الصفحة الرئيسية" },
      { value: "/about", label: "من نحن" },
      { value: "/terms", label: "الشروط والأحكام" },
      { value: "/privacy", label: "سياسة الخصوصية" },
      { value: "/replacement-policy", label: "سياسة الاستبدال" },
    ],
  },
  {
    label: "خاص",
    options: [{ value: "#contact", label: "فتح نافذة تواصل معنا" }],
  },
];

export const allLinkOptions: LinkOption[] = linkDestinationGroups.flatMap((g) => g.options);
