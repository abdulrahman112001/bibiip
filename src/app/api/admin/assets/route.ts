import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 80 * 1024 * 1024; // 80MB

/** رفع صورة أو فيديو جديد - بترجع الرابط اللي تتحط في أي حقل صورة/فيديو */
export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "مفيش ملف مبعوت" }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "لازم يكون ملف صورة أو فيديو" }, { status: 400 });
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "حجم الصورة أكبر من 5 ميجا" }, { status: 400 });
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return NextResponse.json({ error: "حجم الفيديو أكبر من 80 ميجا" }, { status: 400 });
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
