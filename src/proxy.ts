import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * بيحمي:
 * - كل صفحات لوحة التحكم (/admin/*) عدا صفحة تسجيل الدخول - بيحوّل لصفحة اللوجين.
 * - كل الـ APIs الخاصة بالأدمن (/api/admin/*) - بيرجّع 401 لو مفيش جلسة
 *   (من غير redirect، لأنها API مش صفحة).
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  if (pathname.startsWith("/api/admin")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/admin/login";

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
