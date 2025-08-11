import { ingestCycle, fetchRSS, fetchGNews } from "./src/ingestion/fetcher.js";
import { makeStores } from "./src/cost/counters.js";
import { limitsFromEnv } from "./src/cost/limits.js";
import { processorFactory } from "./src/processing/processor.js";

// Mock undici.request
const mockUndiciRequest = (url, options) => {
  if (url.includes("example.com/rss")) {
    const xml = `
      <rss><channel>
        <item><title>RBI raises policy rate, markets react</title><link>https://a</link><pubDate>${new Date().toUTCString()}</pubDate></item>
      </channel></rss>`;
    return Promise.resolve({
      statusCode: 200,
      body: { text: async () => xml }
    });
  } else if (url.includes("a/")) {
    const items = Array.from({length:20}).map((_,i)=>`<item><title>RBI ${i} market update</title><link>https://a/${i}</link><pubDate>${new Date().toUTCString()}</pubDate></item>`).join("");
    return Promise.resolve({
      statusCode: 200,
      body: { text: async () => `<rss><channel>${items}</channel></rss>` }
    });
  }
  return Promise.resolve({ statusCode: 404, body: { text: async () => "Not Found" } });
};

// Mock fetchGNews
const mockFetchGNews = (query, limit = 20) => {
  const now = new Date().toISOString();
  return Promise.resolve(Array.from({ length: limit }).map((_, i) => ({
    title: `Finance ${i} — ${query}`,
    url: `https://news.example/${i}`,
    publishedAt: now,
    source: "gnews"
  })));
};

const stores = makeStores();
const limits = limitsFromEnv({ AMOGH_MAX_DAILY_ARTICLES: "100", AMOGH_GNEWS_MAX_DAILY: "50" });

async function runTest() {
  await stores.redis.flushall();
  const processFn = await processorFactory(limits);

  console.log("--- Test 1: Parse simple RSS feed ---");
  const items = await fetchRSS("https://example.com/rss", mockUndiciRequest);
  console.log("Parsed RSS items:", items);

  console.log("\n--- Test 2: RSS >= 50 blocks GNews fallback ---");
  await stores.redis.flushall();
  const stats1 = await ingestCycle(stores, limits, processFn, mockFetchGNews, mockUndiciRequest);
  console.log("Stats after RSS >= 50:", stats1);
  console.log("GNews called:", stats1.from.includes("gnews"));

  console.log("\n--- Test 3: RSS 20, GNews available -> pulls <= 20 ---");
  await stores.redis.flushall();
  const stats2 = await ingestCycle(stores, limits, processFn, mockFetchGNews, mockUndiciRequest);
  console.log("Stats after RSS 20 + GNews:", stats2);
  console.log("GNews called:", stats2.from.includes("gnews"));

  console.log("\n--- Test 4: GNews stub returns deterministic items ---");
  const g = await fetchGNews("india finance investment -civic", 5);
  console.log("GNews items:", g);
}

runTest();