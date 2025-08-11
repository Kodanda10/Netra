import { describe, it, expect, vi, beforeEach } from "vitest";
import * as undici from "undici";
vi.mock("undici", () => ({
  request: vi.fn(),
}));
import { XMLParser } from "fast-xml-parser";
import { ingestCycle, fetchRSS, fetchGNews } from "../src/ingestion/fetcher.js";
import { processorFactory } from "../src/processing/processor.js";
import { makeStores } from "../src/cost/counters.js";
import { limitsFromEnv } from "../src/cost/limits.js";

const limits = limitsFromEnv({ AMOGH_MAX_DAILY_ARTICLES: "100", AMOGH_GNEWS_MAX_DAILY: "50" });

describe("Fetcher", () => {
  const stores = makeStores();

  beforeEach(async () => {
    await stores.redis.flushall();
  });

  it("parses a simple RSS feed", async () => {
    const xml = `
      <rss><channel>
        <item><title>RBI raises policy rate, markets react</title><link>https://a</link><pubDate>${new Date().toUTCString()}</pubDate></item>
      </channel></rss>`;
    vi.spyOn(undici, "request").mockResolvedValueOnce({
      statusCode: 200,
      body: { text: async () => xml }
    } as any);

    const items = await fetchRSS("https://example.com/rss");
    expect(items.length).toBe(1);
    expect(items[0].title).toMatch(/RBI/);
  });

  it("RSS≥50 blocks GNews fallback; else uses up to 20", async () => {
    // Mock 20 items only (forces fallback)
    vi.spyOn(undici, "request").mockResolvedValue({
      statusCode: 200,
      body: { text: async () => `<rss><channel>${ 
        Array.from({length:20}).map((_,i)=>`<item><title>RBI ${i} market update</title><link>https://a/${i}</link><pubDate>${new Date().toUTCString()}</pubDate></item>`).join("")
      }</channel></rss>` }
    } as any);

    const processFn = await processorFactory(limits);
    const stats = await ingestCycle(stores, limits, processFn);
    expect(stats.ingested).toBeGreaterThan(20);
    expect(stats.from.includes("gnews")).toBe(true);
  });

  it("GNews stub returns deterministic items", async () => {
    const g = await fetchGNews("india finance investment -civic", 5);
    expect(g).toHaveLength(5);
    expect(g[0].source).toBe("gnews");
  });
});

function toRss(articles) {
  const items = articles.map(a => `<item><title>${a.title}</title><description>${a.description}</description><link>http://example.com</link><pubDate>${a.publishedAt}</pubDate></item>`).join('');
  return `<rss version="2.0"><channel><title>Mock Feed</title><link>http://mock.com</link>${items}</channel></rss>`;
}