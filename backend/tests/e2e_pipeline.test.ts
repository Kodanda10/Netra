import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import * as undici from "undici";
import app from "../src/app.js";
import { Server } from "http";

vi.mock('undici', () => {
  return {
    request: vi.fn(),
  };
});

import { resetMetrics } from "../src/cost/metrics.js";

describe("E2E pipeline", () => {
  let server: Server;
  beforeEach(() => {
    resetMetrics();
  });

  beforeAll(async () => {
    server = app.listen(0);
    // Mock a couple feeds with mixed quality
    (undici as any).request.mockImplementation(async (url: string) => {
      const good = (i:number) => `<item><title>RBI ${i} market investment NSE</title><link>https://g/${i}</link><pubDate>${new Date().toUTCString()}</pubDate></item>`;
      const bad  = `<item><title>court accident civic</title><link>https://b</link><pubDate>${new Date().toUTCString()}</pubDate></item>`;
      const many = Array.from({length:30}).map((_,i)=>good(i)).join("");
      const xml = `<rss><channel>${many}${bad}</channel></rss>`;
      return { statusCode: 200, body: { text: async () => xml } } as any;
    });
  });

  afterAll(async () => {
    await new Promise(res => server.close(res));
  });

  it("metrics respond and include core gauges", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.text).toContain("amogh_daily_article_count");
  });
});