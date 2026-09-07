import { NextResponse } from "next/server";
import { getContent } from "@/lib/getContent";
import * as staticContent from "@/lib/content";

type Params = { params: Promise<{ key: string }> };

/** GET عام (من غير تسجيل دخول) - بيرجّع محتوى سكشن واحد بصيغة JSON */
export async function GET(_req: Request, { params }: Params) {
  const { key } = await params;

  if (!(key in staticContent)) {
    return NextResponse.json({ error: `سكشن غير معروف: ${key}` }, { status: 404 });
  }

  const data = await getContent(key as keyof typeof staticContent);
  return NextResponse.json({ key, data });
}
