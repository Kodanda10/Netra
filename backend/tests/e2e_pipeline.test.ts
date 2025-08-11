import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import * as undici from "undici";
import app, { server } from "../src/server.js";

describe("E2E pipeline", () => {
  beforeAll(async () => {
    // Mock a couple feeds with mixed quality
    vi.spyOn(undici, "request").mockImplementation(async (url: string) => {
      const good = (i:number) => `<item><title>RBI ${i} market investment NSE</title><link>https://g/${i}</link><pubDate>${new Date().toUTCString()}</pubDate></item>`;
      const bad  = `<item><title>court accident civic</title><link>https://b</link><pubDate>${new Date().toUTCString()}</pubDate></item>`;
      const many = Array.from({length:30}).map((_,i)=>good(i)).join("");
      const xml = `<rss><channel>${many}${bad}</channel></rss>`;
      return { statusCode: 200, body: { text: async () => xml } } as any;
    });
  });

  afterAll(async () => {
    server.close();
  });

  it("metrics respond and include core gauges", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.text).toContain("amogh_daily_article_count");
  });
});