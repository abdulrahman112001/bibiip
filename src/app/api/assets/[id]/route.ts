import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const CACHE_HEADERS = {
  // الرابط ده مرتبط بـ id ثابت لملف معين، فمينفعش يتغيّر - كاش طويل آمن
  "Cache-Control": "public, max-age=31536000, immutable",
};

/**
 * بيعرض الصورة/الفيديو المرفوع - عام (من غير تسجيل دخول) عشان الموقع نفسه
 * يقدر يعرضه. بيدعم Range requests (جزء من الملف بس) عشان الفيديوهات
 * تقدر تتـ"سيك" (seek) بسرعة من غير ما تحمّل الملف كله الأول - ده أساسي
 * لفيديو الهيرو اللي بيتحرك مع السكرول.
 */
export async function GET(req: Request, { params }: Params) {
  const { id } = await params;

  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) {
    return NextResponse.json({ error: "الملف مش موجود" }, { status: 404 });
  }

  const data = asset.data;
  const total = data.length;
  const range = req.headers.get("range");

  if (!range) {
    return new NextResponse(new Uint8Array(data), {
      headers: { "Content-Type": asset.mimeType, "Accept-Ranges": "bytes", ...CACHE_HEADERS },
    });
  }

  const match = /bytes=(\d*)-(\d*)/.exec(range);
  if (!match) {
    return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } });
  }

  const start = match[1] ? parseInt(match[1], 10) : 0;
  const end = match[2] ? parseInt(match[2], 10) : total - 1;

  if (start >= total || end >= total || start > end) {
    return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } });
  }

  const chunk = data.subarray(start, end + 1);

  return new NextResponse(new Uint8Array(chunk), {
    status: 206,
    headers: {
      "Content-Type": asset.mimeType,
      "Accept-Ranges": "bytes",
      "Content-Range": `bytes ${start}-${end}/${total}`,
      "Content-Length": String(chunk.length),
      ...CACHE_HEADERS,
    },
  });
}
