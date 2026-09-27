import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/** رفع صورة جديدة - بترجع الرابط اللي تتحط في أي حقل صورة */
export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "مفيش ملف مبعوت" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "لازم يكون ملف صورة" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "حجم الصورة أكبر من 5 ميجا" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const asset = await prisma.asset.create({
    data: {
      filename: file.name,
      mimeType: file.type,
      data: buffer,
    },
  });

  return NextResponse.json({ url: `/api/assets/${asset.id}` });
}
