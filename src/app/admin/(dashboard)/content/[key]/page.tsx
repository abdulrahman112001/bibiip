import { notFound } from "next/navigation";
import { getContent } from "@/lib/getContent";
import * as staticContent from "@/lib/content";
import { contentSchemas, sectionLabels } from "@/lib/contentSchemas";
import SectionForm from "@/components/admin/SectionForm";

export default async function ContentEditorPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;

  if (!(key in staticContent) || !(key in contentSchemas)) {
    notFound();
  }

  const data = await getContent(key as keyof typeof staticContent);

  return (
    <SectionForm
      sectionKey={key}
      label={sectionLabels[key] ?? { en: key, ar: key }}
      schema={contentSchemas[key]}
      initialData={data as Record<string, unknown>}
    />
  );
}
