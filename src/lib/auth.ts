import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * تسجيل دخول أدمن واحد بس، البيانات في متغيرات البيئة (.env):
 * ADMIN_EMAIL و ADMIN_PASSWORD_HASH (باسورد مشفّر بـ bcrypt، مش نص عادي).
 * مفيش قاعدة بيانات مستخدمين هنا - مش محتاجينها لأدمن واحد بس.
 */
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
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        if (
          typeof email !== "string" ||
          typeof password !== "string" ||
          !adminEmail ||
          !adminHash
        ) {
          return null;
        }

        if (email !== adminEmail) return null;

        const valid = bcrypt.compareSync(password, adminHash);
        if (!valid) return null;

        return { id: "admin", email: adminEmail, name: "Admin" };
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth }) => !!auth?.user,
  },
});
