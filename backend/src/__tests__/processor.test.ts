import { describe, it, expect, beforeEach } from 'vitest';
import { processorFactory, translationCache } from '../processing/processor.js';
import { limitsFromEnv } from '../cost/limits.js';
import dayjs from 'dayjs';

const limits = limitsFromEnv({ AMOGH_MAX_SUMMARY_CHARS: "200" });

describe('Processor', () => {
  const existingArticles = new Set();
  let processArticle;

  beforeEach(async () => {
    existingArticles.clear();
    translationCache.clear();
    processArticle = await processorFactory(limits);
  });

  it('Reject old/future articles', async () => {
    const oldArticle = { publishedAt: dayjs().subtract(2, 'day').toISOString(), title: 'Old News', description: 'finance' };
    const futureArticle = { publishedAt: dayjs().add(2, 'day').toISOString(), title: 'Future News', description: 'finance' };
    expect(await processArticle(oldArticle, existingArticles)).toBeNull();
    expect(await processArticle(futureArticle, existingArticles)).toBeNull();
  });

  it('Reject civic articles', async () => {
    const civicArticle = { publishedAt: dayjs().toISOString(), title: 'Civic News', description: 'civic election politics' };
    expect(await processArticle(civicArticle, existingArticles)).toBeNull();
  });

  it('Accept RBI policy articles', async () => {
    const rbiArticle = { publishedAt: dayjs().toISOString(), title: 'RBI Policy', description: 'finance investment stocks market economy' };
    expect(await processArticle(rbiArticle, existingArticles)).not.toBeNull();
  });

  it('Dedup/near-dup collapse', async () => {
    const article = { publishedAt: dayjs().toISOString(), title: 'Article 1', url: 'http://example.com/1', description: 'finance investment stocks market economy' };
    await processArticle(article, existingArticles);
    expect(await processArticle(article, existingArticles)).toBeNull();
  });

  it('Categorization examples hit expected buckets', async () => {
    const allIndiaArticle = { publishedAt: dayjs().toISOString(), title: 'India News', description: 'finance investment stocks market economy' };
    const stateArticle = { publishedAt: dayjs().toISOString(), title: 'State News', description: 'finance investment stocks market economy' };
    const processedAllIndia = await processArticle(allIndiaArticle, existingArticles);
    const processedState = await processArticle(stateArticle, existingArticles);
    expect(processedAllIndia.category).toBe('All-India');
    expect(processedState.category).toBe('State');
  });

  it('Translation cache returns cached=true on repeat', async () => {
    const article = { publishedAt: dayjs().toISOString(), title: 'Cache Test', description: 'finance investment stocks market economy' };
    const firstPass = await processArticle(article, existingArticles);
    const secondPass = await processArticle(article, existingArticles);
    expect(firstPass.translationCached).toBe(false);
    expect(secondPass).toBeNull();
  });
});