import { NextResponse } from "next/server";
import { getAllContent } from "@/lib/getContent";

/** GET عام - بيرجّع كل سكاشن الموقع دفعة واحدة */
export async function GET() {
  const data = await getAllContent();
  return NextResponse.json({ data });
}
