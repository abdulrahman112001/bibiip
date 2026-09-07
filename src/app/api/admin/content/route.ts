import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as staticContent from "@/lib/content";

/** قايمة كل السكاشن + آخر تحديث (لصفحة الداشبورد الرئيسية) */
export async function GET() {
  const keys = Object.keys(staticContent) as (keyof typeof staticContent)[];
  const rows = await prisma.contentSection.findMany({
    where: { key: { in: keys } },
    select: { key: true, updatedAt: true },
  });
  const updatedMap = new Map(rows.map((r) => [r.key, r.updatedAt]));

  const sections = keys.map((key) => ({
    key,
    updatedAt: updatedMap.get(key) ?? null,
    customized: updatedMap.has(key),
  }));

  return NextResponse.json({ sections });
}
