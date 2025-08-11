import { request } from "undici";
import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import * as rax from "retry-axios";
import pRetry from "p-retry";
import dayjs from "dayjs";
import { counters, gauges } from "../cost/metrics.js";
import { quotaGate, recordArticleIngest } from "../cost/enforcer.js";

rax.attach();

const RSS_FEEDS = [
  "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
  "https://www.livemint.com/rss/markets",
  "https://www.financialexpress.com/market/feed/",
  "https://www.business-standard.com/rss/markets.xml",
  "https://www.bhaskar.com/rss?category=business",
  "https://www.anandabazar.com/rss/business"
]; // :contentReference[oaicite:4]{index=4}

export async function fetchRSS(url) {
  counters.fetchReq.inc();
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

    return res.map((it) => {
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
  } catch (e) {
    counters.fetchErr.inc();
    return [];
  }
}

// Provider stub for GNews (strict fallback)
export async function fetchGNews(query, limit = 20) {
  // Put your provider here. We simulate deterministic items:
  const now = dayjs().toISOString();
  return Array.from({ length: limit }).map((_, i) => ({
    title: `Finance ${i} — ${query}`,
    url: `https://news.example/${i}`,
    publishedAt: now,
    source: "gnews"
  }));
}

export async function ingestCycle(stores, limits, processFn) {
  const gate = await quotaGate(stores, limits);
  if (!gate.canFetch) return { usedCache: true, ingested: 0, from: [] };

  gauges.itemsPerHour.set(0);
  const effective = gate.effectiveArticleQuota;

  let collected = [];

  for (const url of RSS_FEEDS) {
    if (collected.length >= effective) break;
    const items = await fetchRSS(url);
    collected.push(...items);
  }

  // If less than min(50, effective) and allowed, get GNews fallback
  if (collected.length < Math.min(50, effective) && gate.canUseGnews) {
    const needed = Math.min(20, Math.min(50, effective) - collected.length);
    const g = await fetchGNews("india finance investment -civic", needed);
    collected.push(...g);
  }

  // Process and record
  let ingested = 0;
  const from = [];
  for (const item of collected.slice(0, effective)) {
    const enriched = processFn ? await processFn(item) : item;
    if (!enriched) continue;
    await recordArticleIngest(stores, { source: enriched.source }, limits);
    gauges.sourceToday.set({ source: enriched.source }, 1);
    from.push(enriched.source);
    ingested++;
  }

  return { usedCache: false, ingested, from };
}