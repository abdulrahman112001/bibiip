import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

type Params = { params: Promise<{ id: string }> };

/** تعليم رسالة كمقروءة/غير مقروءة */
export async function PATCH(req: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON غير صالح" }, { status: 400 });
  }

  const { read } = (body ?? {}) as { read?: unknown };
  if (typeof read !== "boolean") {
    return NextResponse.json({ error: "لازم تبعت read كـ boolean" }, { status: 400 });
  }

  const updated = await prisma.contactMessage.update({ where: { id }, data: { read } });
  return NextResponse.json({ message: updated });
}

/** حذف رسالة */
export async function DELETE(_req: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
