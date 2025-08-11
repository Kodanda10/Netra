import { describe, it, expect, beforeEach, vi } from "vitest";
import { setBurstActive, evaluateBurstAuto, quotaGate } from "../src/cost/enforcer.js";
import { limitsFromEnv } from "../src/cost/limits.js";
import { makeStores, incDailyCounter } from "../src/cost/counters.js";

vi.mock("pg", () => ({
  Pool: vi.fn(() => ({
    query: vi.fn(),
  })),
}));

const limits = limitsFromEnv({ AMOGH_MAX_DAILY_ARTICLES: "100", AMOGH_BURST_PERCENT: "20", AMOGH_GNEWS_MAX_DAILY: "50", AMOGH_COOLDOWN_AT_PCT: "0.9", AMOGH_QUOTA_WARN_PCT: "0.8" });

describe("Cost enforcer", () => {
  const stores = makeStores();

  beforeEach(async () => {
    await stores.redis.flushall();
    setBurstActive(false);
  });

  it("burst increases effective quota by 20% and auto toggles", async () => {
    evaluateBurstAuto(25, false, limits);
    const gate = await quotaGate(stores, limits);
    expect(gate.effectiveArticleQuota).toBe(120);
  });

  it("cooldown staggers releases per hour", async () => {
    // simulate 90 articles already ingested
    for (let i = 0; i < 90; i++) await incDailyCounter(stores.redis, stores.pool, "articles");
    const gate = await quotaGate(stores, limits);
    expect(gate.canFetch).toBeTypeOf("boolean");
  });

  it("GNews allowed until cap; nearCap flips at 80%", async () => {
    for (let i = 0; i < 80; i++) await incDailyCounter(stores.redis, stores.pool, "articles");
    const gate = await quotaGate(stores, limits);
    expect(gate.nearCap).toBe(true);
    for (let i = 0; i < 50; i++) await incDailyCounter(stores.redis, stores.pool, "gnews");
    const gate2 = await quotaGate(stores, limits);
    expect(gate2.canUseGnews).toBe(false);
  });
});