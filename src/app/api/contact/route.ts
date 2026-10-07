import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** استقبال رسالة من فورم "تواصل معنا" - عام (من غير تسجيل دخول) */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON غير صالح" }, { status: 400 });
  }

  const { name, email, message } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "إيميل غير صالح" }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "الرسالة مطلوبة" }, { status: 400 });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "البيانات طويلة أوي" }, { status: 400 });
  }

  const saved = await prisma.contactMessage.create({
    data: { name: name.trim(), email: email.trim(), message: message.trim() },
  });

  // إرسال الإيميل مش لازم ينجح عشان الرسالة تتحفظ - الحفظ في الداشبورد هو الأساسي
  sendContactNotification(saved).catch((err) => {
    console.error("[contact] فشل إرسال إيميل التنبيه:", err);
  });

  return NextResponse.json({ ok: true });
}
