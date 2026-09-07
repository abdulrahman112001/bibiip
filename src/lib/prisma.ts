import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

/**
 * نسخة واحدة بس من PrismaClient طول عمر السيرفر (singleton) - عشان في وضع
 * التطوير (hot-reload) ميتعملش instance جديد كل مرة الملف يتحمّل تاني.
 *
 * بنستخدم libsql كـ "driver adapter" (مطلوب في Prisma 7) - شغال محليًا مع
 * ملف SQLite (file:./dev.db)، ولما نحوّل للإنتاج على Postgres هنستبدله بـ
 * @prisma/adapter-pg بس (سطر واحد هنا، مفيش تغيير في باقي الكود).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
