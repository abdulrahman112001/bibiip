import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { getContent } from "@/lib/getContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContent("about");
  return {
    title: `${page.title.ar} | بيب بيب`,
    description: page.description.ar,
  };
}

export default function Page() {
  return <InfoPage pageKey="about" />;
}
