/**
 * بيهاجر كل المحتوى الثابت اللي في src/lib/content.ts لقاعدة البيانات،
 * صف واحد لكل سكشن (نفس المفتاح=اسم الـ export). لو الصف موجود بالفعل
 * (upsert) مش بيدّوس عليه - عشان نقدر نشغّل السكريبت أكتر من مرة بأمان
 * من غير ما نمسح تعديلات اتعملت من الداشبورد.
 */
import { prisma } from "../src/lib/prisma";
import * as content from "../src/lib/content";

async function main() {
  const sections = Object.entries(content) as [string, unknown][];

  for (const [key, data] of sections) {
    const existing = await prisma.contentSection.findUnique({ where: { key } });
    if (existing) {
      console.log(`↷ ${key} موجود بالفعل - اتخطّاه`);
      continue;
    }
    await prisma.contentSection.create({
      data: { key, data: data as object },
    });
    console.log(`✓ ${key}`);
  }

  console.log(`\nخلص. عدد السكاشن في قاعدة البيانات: ${await prisma.contentSection.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
