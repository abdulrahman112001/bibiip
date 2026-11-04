import { getContent } from "@/lib/getContent";
import InfoPageView from "./InfoPageView";

export type InfoPageKey = "about" | "terms" | "privacy" | "replacementPolicy";

export default async function InfoPage({ pageKey }: { pageKey: InfoPageKey }) {
  const [page, about, terms, privacy, replacementPolicy, brand, navData, footer, seo] = await Promise.all([
    getContent(pageKey),
    getContent("about"),
    getContent("terms"),
    getContent("privacy"),
    getContent("replacementPolicy"),
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
      pages={{ about, terms, privacy, replacementPolicy }}
    />
  );
}
