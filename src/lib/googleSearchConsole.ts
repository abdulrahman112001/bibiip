import "server-only";
import { JWT } from "google-auth-library";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const API_BASE = "https://www.googleapis.com/webmasters/v3/sites";
const CACHE_TTL_MS = 15 * 60 * 1000;

type Credentials = { client_email: string; private_key: string };

type Totals = { clicks: number; impressions: number; ctr: number; position: number };
type DailyPoint = { date: string; clicks: number; impressions: number };
type QueryRow = { query: string; clicks: number; impressions: number; ctr: number; position: number };

export type SearchConsoleSummary =
  | { ok: true; totals: Totals; daily: DailyPoint[]; topQueries: QueryRow[] }
  | { ok: false; reason: "not_configured" | "api_error"; message: string };

let cache: { at: number; siteUrl: string; data: SearchConsoleSummary } | null = null;

function getCredentials(): Credentials | null {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!b64) return null;
  try {
    const json = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    if (!json.client_email || !json.private_key) return null;
    return { client_email: json.client_email, private_key: json.private_key };
  } catch {
    return null;
  }
}

async function query(client: JWT, siteUrl: string, body: Record<string, unknown>) {
  const res = await client.request<{
    rows?: Array<{ keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }>;
  }>({
    url: `${API_BASE}/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    method: "POST",
    data: body,
  });
  return res.data.rows ?? [];
}

function dateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/**
 * بيانات أداء الموقع في نتائج بحث جوجل (آخر 28 يوم) - عن طريق Service
 * Account مش تسجيل دخول شخصي. لازم يكون الحساب ده مضاف كـ user في
 * Search Console للموقع، وإلا هترجع حالة "not_configured".
 */
export async function getSearchConsoleSummary(siteUrl: string): Promise<SearchConsoleSummary> {
  if (cache && cache.siteUrl === siteUrl && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }

  const creds = getCredentials();
  if (!creds) {
    return {
      ok: false,
      reason: "not_configured",
      message: "معملتش ربط مع Google Search Console لسه",
    };
  }

  try {
    const client = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: [SCOPE],
    });

    const startDate = dateNDaysAgo(28);
    const endDate = dateNDaysAgo(1);

    const [totalsRows, dailyRows, queryRows] = await Promise.all([
      query(client, siteUrl, { startDate, endDate }),
      query(client, siteUrl, { startDate, endDate, dimensions: ["date"] }),
      query(client, siteUrl, { startDate, endDate, dimensions: ["query"], rowLimit: 10 }),
    ]);

    const totals: Totals = totalsRows[0]
      ? {
          clicks: totalsRows[0].clicks,
          impressions: totalsRows[0].impressions,
          ctr: totalsRows[0].ctr,
          position: totalsRows[0].position,
        }
      : { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    const daily: DailyPoint[] = dailyRows.map((r) => ({
      date: r.keys?.[0] ?? "",
      clicks: r.clicks,
      impressions: r.impressions,
    }));

    const topQueries: QueryRow[] = queryRows.map((r) => ({
      query: r.keys?.[0] ?? "",
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }));

    const data: SearchConsoleSummary = { ok: true, totals, daily, topQueries };
    cache = { at: Date.now(), siteUrl, data };
    return data;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "حصل خطأ غير متوقع في الاتصال بـ Google";
    console.error("[getSearchConsoleSummary]", message);
    return { ok: false, reason: "api_error", message };
  }
}
