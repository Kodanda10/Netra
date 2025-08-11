import { describe, it, expect } from "vitest";
import { processorFactory } from "../src/processing/processor.js";
import { limitsFromEnv } from "../src/cost/limits.js";

const limits = limitsFromEnv({ AMOGH_MAX_SUMMARY_CHARS: "200" });

describe("Processor", () => {
  it("rejects old/future items, accepts finance, rejects civic", async () => {
    const p = await processorFactory(limits);
    const old = await p({ title: "RBI update", url: "x", publishedAt: "2000-01-01T00:00:00Z", source: "rss" });
    expect(old).toBeNull();
    const civic = await p({ title: "court judgement on market theft", url:"y", publishedAt: new Date().toISOString(), source:"rss" });
    expect(civic).toBeNull();
    const ok = await p({ title: "RBI policy boosts NSE market and FDI prospects", url:"z", publishedAt: new Date().toISOString(), source:"rss" });
    expect(ok?.category).toBeDefined();
    expect(ok?.summaryHi).toMatch(/^हिंदी:/);
  });

  it("dedupes same (title+url) and caches translation", async () => {
    const p = await processorFactory(limits);
    const base = { title: "RBI policy boosts NSE market and FDI prospects", url:"dup", publishedAt: new Date().toISOString(), source:"rss" };
    const a = await p(base);
    const b = await p(base);
    expect(a).toBeTruthy();
    expect(b).toBeNull(); // dedup worked
  });
});