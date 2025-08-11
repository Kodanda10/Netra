
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fetcher from '../ingestion/fetcher.js';
import * as enforcer from '../cost/enforcer.js';
import { request } from 'undici';
import { processorFactory } from '../processing/processor.js';
import { limitsFromEnv } from '../cost/limits.js';

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

  beforeEach(async () => {
    vi.resetAllMocks();
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
    request.mockResolvedValue({ body: { text: () => Promise.resolve(toRss(mockRssArticles)) } });
    const fetchGNews = vi.spyOn(fetcher, 'fetchGNews').mockResolvedValue([]);

    await fetcher.ingestCycle(mockRedis, fetchGNews, processFn);

    expect(fetchGNews).not.toHaveBeenCalled();
  });

  it('RSS 20, GNews available -> pulls <= 20 (and never exceed 50 total pre-cap)', async () => {
    const mockQuotaGate = {
      canFetch: true,
      effectiveArticleQuota: 100,
      canUseGnews: true,
    };
    enforcer.quotaGate.mockResolvedValue(mockQuotaGate);

    const mockRssArticles = Array.from({ length: 20 }, (_, i) => ({ title: `RSS Article ${i}` }));
    const mockGnewsArticles = Array.from({ length: 30 }, (_, i) => ({ title: `GNews Article ${i}` }));
    request.mockResolvedValueOnce({ body: { text: () => Promise.resolve(toRss(mockRssArticles)) } });
    for (let i = 1; i < 6; i++) {
      request.mockResolvedValueOnce({ body: { text: () => Promise.resolve(toRss([])) } });
    }
    const fetchGNews = vi.fn().mockResolvedValue(mockGnewsArticles);

    const result = await fetcher.ingestCycle(mockRedis, fetchGNews, processFn);

    expect(fetchGNews).toHaveBeenCalled();
    expect(result.ingested).toBe(40); // 20 from RSS + 20 from GNews
  });

  it('Failures retry; still respect caps', async () => {
    const mockQuotaGate = {
      canFetch: true,
      effectiveArticleQuota: 10,
      canUseGnews: true,
    };
    enforcer.quotaGate.mockResolvedValue(mockQuotaGate);

    request.mockRejectedValue(new Error('Fetch failed'));

    const result = await fetcher.ingestCycle(mockRedis, vi.fn().mockResolvedValue([]), processFn);

    expect(request).toHaveBeenCalledTimes(6); // 6 feeds, 1 try each
    expect(result.ingested).toBe(0);
  });
});

function toRss(articles) {
  const items = articles.map(a => `<item><title>${a.title}</title><description>${a.description}</description><link>http://example.com</link><pubDate>${a.publishedAt}</pubDate></item>`).join('');
  return `<rss><channel>${items}</channel></rss>`;
}
