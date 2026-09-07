import { prisma } from "@/lib/prisma";
import * as staticContent from "@/lib/content";
import AdminHomeContent, { type SectionInfo } from "@/components/admin/AdminHomeContent";

export default async function AdminHomePage() {
  const keys = Object.keys(staticContent) as (keyof typeof staticContent)[];
  const rows = await prisma.contentSection.findMany({
    where: { key: { in: keys } },
    select: { key: true, updatedAt: true },
  });
  const updatedMap = new Map(rows.map((r) => [r.key, r.updatedAt]));

  const sections: SectionInfo[] = keys.map((key) => ({
    key,
    updatedAt: updatedMap.get(key)?.toISOString() ?? null,
  }));

  return <AdminHomeContent sections={sections} />;
}
