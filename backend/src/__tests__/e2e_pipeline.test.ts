import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fetcher from '../ingestion/fetcher.js';
import { processorFactory } from '../processing/processor.js';
import * as enforcer from '../cost/enforcer.js';
import * as limits from '../cost/limits.js';
import dayjs from 'dayjs';
import { request } from 'undici';

vi.mock('../cost/enforcer.js');
vi.mock('undici', () => ({
  request: vi.fn(),
}));

describe('E2E Pipeline', () => {
  const existingArticles = new Set();
  let processFn;

  beforeEach(async () => {
    existingArticles.clear();
    vi.resetAllMocks();
    processFn = await processorFactory(limits);
  });

  it('Full pipeline test', async () => {
    const mockQuotaGate = {
      canFetch: true,
      effectiveArticleQuota: 100,
      canUseGnews: true,
    };
    enforcer.quotaGate.mockResolvedValue(mockQuotaGate);

    const feedA = Array.from({ length: 30 }, (_, i) => ({ title: `Feed A Article ${i}`, publishedAt: dayjs().toISOString(), description: 'finance investment stocks market economy' }));
    const feedB = Array.from({ length: 40 }, (_, i) => ({ title: `Feed B Article ${i}`, publishedAt: i < 25 ? dayjs().toISOString() : dayjs().subtract(2, 'day').toISOString(), description: 'finance investment stocks market economy' }));
    const feedC = new Error('Fetch failed');
    const gnewsFeed = Array.from({ length: 30 }, (_, i) => ({ title: `GNews Article ${i}`, publishedAt: dayjs().toISOString(), description: i < 25 ? 'finance investment stocks market economy' : 'civic' }));

    request
      .mockResolvedValueOnce({ body: { text: () => Promise.resolve(toRss(feedA)) } })
      .mockResolvedValueOnce({ body: { text: () => Promise.resolve(toRss(feedB)) } })
      .mockRejectedValueOnce(feedC);
    vi.spyOn(fetcher, 'fetchGNews').mockResolvedValue(gnewsFeed);

    const result = await fetcher.ingestCycle({}, fetcher.fetchGNews, processFn);
    const ingestedArticles = result.articles || [];

    let processedCount = 0;
    for (const article of ingestedArticles) {
      if (await processFn(article)) {
        processedCount++;
      }
    }

    expect(processedCount).toBeLessThanOrEqual(limits.MAX_DAILY_ARTICLES || 0);
    const gnewsArticles = (ingestedArticles || []).filter(a => a.source === 'gnews');
    expect(gnewsArticles.length).toBeLessThanOrEqual(limits.GNEWS_MAX_DAILY);
  });
});

function toRss(articles) {
  const items = articles.map(a => `<item><title>${a.title}</title><description>${a.description}</description><link>http://example.com</link><pubDate>${a.publishedAt}</pubDate></item>`).join('');
  return `<rss><channel>${items}</channel></rss>`;
}