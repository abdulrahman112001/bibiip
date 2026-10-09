import { getContent } from "@/lib/getContent";
import InfoPageView from "./InfoPageView";

export type InfoPageKey = "about" | "terms" | "privacy";

export default async function InfoPage({ pageKey }: { pageKey: InfoPageKey }) {
  const [page, brand, navData, footer, seo] = await Promise.all([
    getContent(pageKey),
    getContent("brand"),
    getContent("nav"),
    getContent("footer"),
    getContent("seo"),
  ]);

  return (
    <InfoPageView
      page={page}
      brand={brand}
      navData={navData}
      footer={footer}
      seo={seo}
    />
  );
}
