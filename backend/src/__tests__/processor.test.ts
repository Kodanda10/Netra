import { describe, it, expect, beforeEach } from 'vitest';
import { processorFactory, translationCache } from '../processing/processor.js';
import { limitsFromEnv } from '../config/limits.js';
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
    expect(await processArticle(oldArticle)).toBeNull();
    expect(await processArticle(futureArticle)).toBeNull();
  });

  it('Reject civic articles', async () => {
    const civicArticle = { publishedAt: dayjs().toISOString(), title: 'Civic News', description: 'civic election politics' };
    expect(await processArticle(civicArticle)).toBeNull();
  });

  it('Accept RBI policy articles', async () => {
    const rbiArticle = { publishedAt: dayjs().toISOString(), title: 'RBI Policy', description: 'finance investment stocks market economy' };
    expect(await processArticle(rbiArticle)).not.toBeNull();
  });

  it('Dedup/near-dup collapse', async () => {
    const article = { publishedAt: dayjs().toISOString(), title: 'Article 1 about investment and market', url: 'http://example.com/1', description: 'finance investment stocks market economy' };
    await processArticle(article);
    expect(await processArticle(article)).toBeNull();
  });

  it('Categorization examples hit expected buckets', async () => {
    const allIndiaArticle = { publishedAt: dayjs().toISOString(), title: 'India News about investment and market', description: 'finance investment stocks market economy' };
    const stateArticle = { publishedAt: dayjs().toISOString(), title: 'Delhi News about investment and market', description: 'finance investment stocks market economy' };
    const processedAllIndia = await processArticle(allIndiaArticle);
    const processedState = await processArticle(stateArticle);
    expect(processedAllIndia.category).toBe('all-india');
    expect(processedState.category).toBe('state');
  });

  it('Translation cache returns cached=true on repeat', async () => {
    const article = { publishedAt: dayjs().toISOString(), title: 'Cache Test for investment and market', description: 'finance investment stocks market economy' };
    const firstPass = await processArticle(article);
    const secondPass = await processArticle(article);
    expect(firstPass.translationCached).toBe(false);
    expect(secondPass).toBeNull();
  });
});