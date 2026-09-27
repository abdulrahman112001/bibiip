import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/requireAdmin";
import * as staticContent from "@/lib/content";
import { contentSchemas } from "@/lib/contentSchemas";
import { normalizeSection } from "@/lib/normalizeContent";

type Params = { params: Promise<{ key: string }> };

/** بيرجّع القيمة الحالية للسكشن من قاعدة البيانات (أو النسخة الثابتة لو لسه مخزّنش) */
export async function GET(_req: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { key } = await params;

  if (!(key in staticContent)) {
    return NextResponse.json({ error: `سكشن غير معروف: ${key}` }, { status: 404 });
  }

  const row = await prisma.contentSection.findUnique({ where: { key } });
  const raw = row ? (row.data as Record<string, unknown>) : staticContent[key as keyof typeof staticContent];
  const schema = contentSchemas[key];
  return NextResponse.json({
    key,
    data: schema ? normalizeSection(schema, raw as Record<string, unknown>) : raw,
    updatedAt: row?.updatedAt ?? null,
  });
}

/** بيحفظ نسخة جديدة من محتوى السكشن (upsert) */
export async function PUT(req: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { key } = await params;

  if (!(key in staticContent)) {
    return NextResponse.json({ error: `سكشن غير معروف: ${key}` }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON غير صالح" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "المحتوى لازم يكون object" }, { status: 400 });
  }

  const row = await prisma.contentSection.upsert({
    where: { key },
    create: { key, data: body },
    update: { data: body },
  });

  // نحدّث الصفحة الرئيسية فورًا عشان الزوار يشوفوا التعديل من غير ما ينتظروا
  revalidatePath("/");

  return NextResponse.json({ key, data: row.data, updatedAt: row.updatedAt });
}
