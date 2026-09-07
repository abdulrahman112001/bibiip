import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

/** بيعرض الصورة المرفوعة - عام (من غير تسجيل دخول) عشان الموقع نفسه يقدر يعرضها */
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) {
    return NextResponse.json({ error: "الصورة مش موجودة" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(asset.data), {
    headers: {
      "Content-Type": asset.mimeType,
      // الرابط ده مرتبط بـ id ثابت لملف معين، فمينفعش يتغيّر - كاش طويل آمن
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
