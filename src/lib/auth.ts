import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/** مفتاح الصف الثابت لبيانات الأدمن في جدول AdminUser - أدمن واحد بس */
export const ADMIN_ROW_ID = "admin";

export type AdminCredentials = { email: string; passwordHash: string };

/**
 * بيانات دخول الأدمن الحالية: من قاعدة البيانات لو موجودة (يعني اتغيّرت
 * من صفحة الإعدادات في الداشبورد)، وإلا من متغيرات البيئة كـ fallback
 * (زي ما كان الوضع قبل ما نضيف جدول AdminUser - عشان النشرات القديمة
 * تفضل شغالة من غير ما تحتاج أي migration يدوي فورًا).
 */
export async function getAdminCredentials(): Promise<AdminCredentials | null> {
  try {
    const row = await prisma.adminUser.findUnique({ where: { id: ADMIN_ROW_ID } });
    if (row) return { email: row.email, passwordHash: row.passwordHash };
  } catch {
    // الجدول ممكن يكون لسه مش موجود لو الـ migration ما اتشغّلش - نتجاهل ونرجع للـ env
  }

  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!email || !passwordHash) return null;
  return { email, passwordHash };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "الإيميل", type: "text" },
        password: { label: "كلمة السر", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const admin = await getAdminCredentials();
        if (!admin) return null;

        if (email !== admin.email) return null;

        const valid = bcrypt.compareSync(password, admin.passwordHash);
        if (!valid) return null;

        return { id: ADMIN_ROW_ID, email: admin.email, name: "Admin" };
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth }) => !!auth?.user,
  },
});
