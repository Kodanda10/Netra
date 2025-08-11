import { setBurstActive, evaluateBurstAuto, quotaGate, recordArticleIngest, overrideAction } from "./src/cost/enforcer.js";
import { limitsFromEnv } from "./src/cost/limits.js";
import { makeStores, incDailyCounter, getDailyCounter } from "./src/cost/counters.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

// Mock Redis
const mockRedisStore = new Map();
const mockRedis = {
  incrby: (key, by) => {
    const val = (Number(mockRedisStore.get(key) || 0) + by).toString();
    mockRedisStore.set(key, val);
    return Promise.resolve(val);
  },
  get: key => Promise.resolve(mockRedisStore.get(key)),
  set: (key, value) => Promise.resolve(mockRedisStore.set(key, value)),
  incr: (key) => {
    const val = (Number(mockRedisStore.get(key) || 0) + 1).toString();
    mockRedisStore.set(key, val);
    return Promise.resolve(val);
  },
  flushall: () => {
    mockRedisStore.clear();
    return Promise.resolve("OK");
  },
};

// Mock Postgres Pool
const mockPgPool = {
  query: () => Promise.resolve(),
};

const stores = {
  redis: mockRedis,
  pool: mockPgPool,
};

const limits = limitsFromEnv({ AMOGH_MAX_DAILY_ARTICLES: "100", AMOGH_BURST_PERCENT: "20", AMOGH_GNEWS_MAX_DAILY: "50", AMOGH_COOLDOWN_AT_PCT: "0.9", AMOGH_QUOTA_WARN_PCT: "0.8" });

async function runTest() {
  await stores.redis.flushall();
  console.log("--- Initial State ---");
  console.log("Burst active:", false);

  console.log("\n--- Test 1: Burst Mode Activation ---");
  evaluateBurstAuto(25, false, limits); // VIX > threshold
  console.log("Burst active after VIX spike:", true);
  let gate = await quotaGate(stores, limits);
  console.log("Effective quota after burst:", gate.effectiveArticleQuota); // Should be 120

  console.log("\n--- Test 2: Cooldown Staggering ---");
  await stores.redis.flushall();
  setBurstActive(false); // Reset burst for this test
  for (let i = 0; i < 90; i++) {
    await incDailyCounter(stores.redis, stores.pool, "articles");
  }
  gate = await quotaGate(stores, limits);
  console.log("Can fetch after 90 articles (cooldown active):");
  console.log("Can fetch:", gate.canFetch);

  console.log("\n--- Test 3: GNews Quota and Near Cap ---");
  await stores.redis.flushall();
  for (let i = 0; i < 80; i++) {
    await incDailyCounter(stores.redis, stores.pool, "articles");
  }
  gate = await quotaGate(stores, limits);
  console.log("Near cap after 80 articles:", gate.nearCap); // Should be true

  for (let i = 0; i < 50; i++) {
    await incDailyCounter(stores.redis, stores.pool, "gnews");
  }
  gate = await quotaGate(stores, limits);
  console.log("Can use GNews after 50 GNews articles:", gate.canUseGnews); // Should be false

  console.log("\n--- Test 4: Record Article Ingest and Override ---");
  await stores.redis.flushall();
  await recordArticleIngest(stores, { source: "rss" }, limits);
  console.log("Articles ingested (RSS):");
  console.log("Articles:", await getDailyCounter(stores.redis, "articles"));
  console.log("GNews:", await getDailyCounter(stores.redis, "gnews"));

  overrideAction("manual_override");
  console.log("Override action triggered.");
}

runTest();
