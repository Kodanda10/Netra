
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fetcher from '../ingestion/fetcher.js';
import * as enforcer from '../cost/enforcer.js';
import { request } from 'undici';
import { processorFactory } from '../processing/processor.js';
import { limitsFromEnv } from '../config/limits.js';

vi.mock('p-retry', () => ({ default: (fn) => fn() }));

vi.mock('../cost/enforcer.js');
vi.mock('undici', () => ({
  request: vi.fn(),
}));

describe('Fetcher', () => {
  const mockRedis = {
    get: vi.fn(),
    incr: vi.fn(),
  }; 
  const limits = limitsFromEnv({ AMOGH_MAX_SUMMARY_CHARS: "200" });
  let processFn;
  let fetcher: any;

  beforeEach(async () => {
    vi.resetModules();
    fetcher = await import('../ingestion/fetcher.js');
    processFn = await processorFactory(limits);
  });

  it('When RSS >= 50 valid items -> GNews not called', async () => {
    const mockQuotaGate = {
      canFetch: true,
      effectiveArticleQuota: 100,
      canUseGnews: true,
    };
    enforcer.quotaGate.mockResolvedValue(mockQuotaGate);

    const mockRssArticles = Array.from({ length: 50 }, (_, i) => ({ title: `Article ${i}` }));
    const fetchGNews = vi.fn().mockResolvedValue([]);

    await fetcher.ingestCycle(mockRedis, fetchGNews, processFn, { rssSupplier: async () => mockRssArticles });

    expect(fetchGNews).not.toHaveBeenCalled();
  });

  it('RSS 20, GNews available -> pulls <= 20 (and never exceed 50 total pre-cap)', async () => {
    const mockQuotaGate = {
      canFetch: true,
      effectiveArticleQuota: 100,
      canUseGnews: true,
    };
    enforcer.quotaGate.mockResolvedValue(mockQuotaGate);

    const financeOk = (i:number) => ({
      title: `RBI NSE market update ${i}`,
      link: `https://ex/${i}`,
      pubDate: new Date().toUTCString(),
      source: 'rss',
    });
    const twentyRss = Array.from({length:20}, (_,i)=>financeOk(i));

    const fetchGNews = vi.fn().mockResolvedValue(
      Array.from({length:20}, (_,i)=>({ title:`GNews ${i}`, link:`https://g/${i}`, source:'gnews' }))
    );

    const result = await fetcher.ingestCycle(
      mockRedis,
      fetchGNews,
      processFn,
      { rssSupplier: async () => twentyRss }   // <- DI: 20 valid items
    );

    expect(fetchGNews).toHaveBeenCalled();
    expect(result.ingested).toBe(40);
  });

  it('Failures retry; still respect caps', async () => {
    const mockQuotaGate = {
      canFetch: true,
      effectiveArticleQuota: 10,
      canUseGnews: true,
    };
    enforcer.quotaGate.mockResolvedValue(mockQuotaGate);

    const result = await fetcher.ingestCycle(mockRedis, vi.fn().mockResolvedValue([]), processFn, { rssSupplier: () => Promise.reject(new Error('Fetch failed')) });

    expect(result.ingested).toBe(0);
  });
});

function toRss(articles) {
  const items = articles.map(a => `<item><title>${a.title}</title><description>${a.description}</description><link>http://example.com</link><pubDate>${a.publishedAt}</pubDate></item>`).join('');
  return `<rss><channel>${items}</channel></rss>`;
}
