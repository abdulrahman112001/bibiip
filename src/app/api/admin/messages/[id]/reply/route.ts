import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { sendReplyEmail } from "@/lib/mailer";

type Params = { params: Promise<{ id: string }> };

/** بعت رد على رسالة تواصل من إيميل الشركة مباشرة */
export async function POST(req: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON غير صالح" }, { status: 400 });
  }

  const { body } = (json ?? {}) as { body?: unknown };
  if (typeof body !== "string" || !body.trim()) {
    return NextResponse.json({ error: "نص الرد مطلوب" }, { status: 400 });
  }

  const original = await prisma.contactMessage.findUnique({ where: { id } });
  if (!original) {
    return NextResponse.json({ error: "الرسالة مش موجودة" }, { status: 404 });
  }

  try {
    await sendReplyEmail({
      to: original.email,
      subject: `رد على رسالتك - بيب بيب`,
      body: body.trim(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "فشل إرسال الرد";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  await prisma.contactMessage.update({ where: { id }, data: { read: true } });

  return NextResponse.json({ ok: true });
}
