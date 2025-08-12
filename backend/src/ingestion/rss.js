import { request } from "undici";
import { XMLParser } from "fast-xml-parser";
import pRetry from "p-retry";
import dayjs from "dayjs";
import { getMetrics } from "../cost/metrics.js";

const RSS_FEEDS = [
  "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
  "https://www.livemint.com/rss/markets",
  "https://www.financialexpress.com/market/feed/",
  "https://www.business-standard.com/rss/markets.xml",
  "https://www.bhaskar.com/rss?category=business",
  "https://www.anandabazar.com/rss/business"
];

export async function getRssItems() {
  const { counters } = getMetrics();
  let allItems = [];
  for (const url of RSS_FEEDS) {
    counters.rssRequests.inc();
    try {
      const res = await pRetry(async () => {
        const { body, statusCode } = await request(url, { method: "GET" });
        if (statusCode >= 400) throw new Error("Bad status " + statusCode);
        const text = await body.text();
        const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: true });
        const xml = parser.parse(text);
        const items = xml?.rss?.channel?.item || xml?.feed?.entry || [];
        return Array.isArray(items) ? items : [items];
      }, { retries: 2 });

      const mappedItems = res.map((it) => {
        const title = it.title?._text || it.title || "";
        const link = it.link?._text || it.link?.["@_href"] || it.link || "";
        const pub = it.pubDate || it.published || it.updated || "";
        return {
          title: String(title).trim(),
          url: String(link).trim(),
          publishedAt: pub ? dayjs(pub).toISOString() : null,
          source: "rss"
        };
      });
      allItems.push(...mappedItems);
    } catch (e) {
      counters.fetchErr.inc({ code: e.code || 'UNKNOWN' });
    }
  }
  return allItems;
}