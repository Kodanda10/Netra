
import { request } from 'undici';
import { XMLParser } from 'fast-xml-parser';
import retry from 'p-retry';
import * as enforcer from '../cost/enforcer.js';
import * as metrics from '../cost/metrics.js';

const RSS_FEEDS = [
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  'https://www.livemint.com/rss/markets',
  'https://www.financialexpress.com/market/feed/',
  'https://www.business-standard.com/rss/markets.xml',
  'https://www.bhaskar.com/rss?category=business',
  'https://www.anandabazar.com/rss/business',
];

const parser = new XMLParser();

export async function fetchRSS(url) {
  const response = await request(url);
  const xml = await response.body.text();
  const feed = parser.parse(xml);
  return (feed.rss.channel.item || feed.channel.item || []).map(item => ({
    title: item.title,
    description: item.description,
    url: item.link,
    publishedAt: item.pubDate,
    source: 'rss',
  }));
}

// Stub for GNews provider
export async function fetchGNews(query) {
  console.log(`Fetching GNews with query: ${query}`);
  return [];
}

export async function ingestCycle(redis, gnewsFetcher = fetchGNews) {
  const gate = await enforcer.quotaGate(redis);
  if (!gate.canFetch) {
    return { usedCache: true, ingested: 0 };
  }

  let articles = [];
  for (const url of RSS_FEEDS) {
    try {
      const items = await retry(() => fetchRSS(url), { retries: 3 });
      articles.push(...items);
      if (articles.length >= gate.effectiveArticleQuota) {
        break;
      }
    } catch (error) {
      console.error(`Failed to fetch RSS feed: ${url}`, error);
      metrics.fetchErrorsTotal.inc();
    }
  }

  if (articles.length < Math.min(50, gate.effectiveArticleQuota) && gate.canUseGnews) {
    const gnewsQuery = 'India finance investment -civic';
    const gnewsArticles = await gnewsFetcher(gnewsQuery);
    articles.push(...gnewsArticles.slice(0, Math.min(20, 50 - articles.length)));
  }

  let ingested = 0;
  for (const article of articles) {
    if (ingested >= gate.effectiveArticleQuota) {
      break;
    }
    await enforcer.recordArticleIngest(redis, article.source);
    metrics.sourceItemsToday.inc({ source: article.source });
    ingested++;
  }

  return { usedCache: false, ingested, articles };
}
