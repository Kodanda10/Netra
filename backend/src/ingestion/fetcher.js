require('dotenv').config();
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const { retry } = require('retry-axios');
const pRetry = require('p-retry');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const { quotaGate, recordArticleIngest } = require('../cost/enforcer');
const { amogh_fetch_requests_total, amogh_fetch_errors_total } = require('../cost/metrics');
const processItems = require('../processing/processor');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_API_URL = 'https://gnews.io/api/v4/top-headlines';

// RSS list
const RSS_FEEDS = [
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  'https://www.livemint.com/rss/markets',
  'https://www.financialexpress.com/market/feed/',
  'https://www.business-standard.com/rss/markets.xml',
  // Note: Bhaskar and Anandabazar RSS feeds might require specific parsing or might not be directly accessible.
  // 'https://www.bhaskar.com/rss?category=business',
  // 'https://www.anandabazar.com/rss/business',
];

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNameProcessors: [(name) => name.replace('dc:', '')],
});

const fetchRSS = async (url) => {
  amogh_fetch_requests_total.labels({ namespace: 'default', service: 'ingestion', source_type: 'rss' }).inc();
  try {
    const response = await pRetry(async () => {
      const res = await axios.get(url, { responseType: 'text' });
      if (res.status !== 200) {
        throw new Error(`Failed to fetch RSS from ${url} with status ${res.status}`);
      }
      return res;
    }, { retries: 3, onFailedAttempt: error => logger.warn(`Attempt failed for ${url}: ${error.message}`) });

    const jsonObj = xmlParser.parse(response.data);
    const items = jsonObj.rss.channel.item || [];

    return items.map(item => ({
      title: item.title,
      summary: item.description,
      content: item.content || item.description,
      source: item.source || item.link, // Use source if available, otherwise link
      publicationDate: new Date(item.pubDate || item.pubdate || dayjs().utc().toDate()),
      state: 'National', // RSS feeds typically don't provide state
      category: 'Business', // Assuming business category for these feeds
    }));
  } catch (error) {
    amogh_fetch_errors_total.labels({ namespace: 'default', service: 'ingestion', source_type: 'rss' }).inc();
    logger.error(`Error fetching RSS from ${url}:`, error);
    return [];
  }
};

const fetchGNews = async (query) => {
  amogh_fetch_requests_total.labels({ namespace: 'default', service: 'ingestion', source_type: 'gnews' }).inc();
  if (!GNEWS_API_KEY) {
    logger.warn('GNEWS_API_KEY is not set. Skipping GNews fetch.');
    return [];
  }
  try {
    const response = await axios.get(GNEWS_API_URL, {
      params: {
        apikey: GNEWS_API_KEY,
        q: query,
        topic: 'business',
        lang: 'en',
        country: 'in',
        max: 100, // Max articles per request for free tier
      },
    });

    const articles = response.data.articles;
    if (!articles || articles.length === 0) {
      logger.info('No new articles fetched from GNews.io.');
      return [];
    }

    return articles.map(article => ({
      title: article.title,
      summary: article.description,
      content: article.content || article.description,
      source: article.source.name,
      publicationDate: new Date(article.publishedAt),
      state: 'National', // GNews doesn't provide state-level data directly, default to National
      category: 'Business', // GNews topic is business
    }));
  } catch (error) {
    amogh_fetch_errors_total.labels({ namespace: 'default', service: 'ingestion', source_type: 'gnews' }).inc();
    logger.error('Error fetching news from GNews.io:', error);
    return [];
  }
};

const ingestCycle = async () => {
  const { canFetch, canUseGnews, effectiveArticleQuota } = await quotaGate();

  if (!canFetch) {
    logger.info('Quota exhausted or cooldown active. Skipping ingestion cycle.');
    return { usedCache: false, ingested: 0 };
  }

  let ingestedCount = 0;
  let articles = [];

  // RSS first
  for (const feedUrl of RSS_FEEDS) {
    if (ingestedCount >= effectiveArticleQuota) break; // Stop if quota reached
    const rssArticles = await fetchRSS(feedUrl);
    // Apply basic filtering here before processing to avoid unnecessary work
    const newRssArticles = rssArticles.filter(art => {
      // Simple check to avoid processing articles that are too old or already processed
      return dayjs(art.publicationDate).utc().isSame(dayjs().utc(), 'day');
    });
    articles = articles.concat(newRssArticles);
    ingestedCount += newRssArticles.length;
  }

  // GNews fallback if RSS didn't yield enough articles and GNews quota allows
  if (ingestedCount < effectiveArticleQuota * 0.5 && canUseGnews) { // If RSS < 50% of quota
    const gnewsQuery = 'finance OR stock market OR economy';
    const gnewsArticles = await fetchGNews(gnewsQuery);
    const newGnewsArticles = gnewsArticles.filter(art => {
      return dayjs(art.publicationDate).utc().isSame(dayjs().utc(), 'day');
    });
    articles = articles.concat(newGnewsArticles);
    ingestedCount += newGnewsArticles.length;
  }

  // Process and add to queue
  const processedItems = await processItems(articles);
  for (const item of processedItems) {
    // This is where the item would be added to a Bull queue for processing by the worker
    // For now, we'll just log it as the queue setup is in the worker file
    // await newsQueue.add(item);
    logger.info(`Simulating adding item to queue: ${item.title}`);
    await recordArticleIngest(item.source === 'gnews' ? 'gnews' : 'rss');
  }

  return { usedCache: false, ingested: processedItems.length };
};

module.exports = { ingestCycle };
