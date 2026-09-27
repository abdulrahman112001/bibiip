import "server-only";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * بيتأكد إن فيه جلسة أدمن مسجّل دخول قبل ما نكمّل في أي API route حساس.
 * لو مفيش، بيرجّع 401 جاهز نرجّعه على طول من الـ route نفسه:
 *
 *   const unauthorized = await requireAdmin();
 *   if (unauthorized) return unauthorized;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "غير مصرّح - سجّل دخولك الأول" }, { status: 401 });
  }
  return null;
}
