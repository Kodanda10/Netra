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
const { processItemsV2 } = require('../processing/processor.v2');
const winston = require('winston');
const { sendToQueue } = require('../../src/queue/producer');
const { createCircuitBreaker } = require('../utils/circuitBreaker');

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
  'https://www.bhaskar.com/rss?category=business',
  'https://www.anandabazar.com/rss/business',
];

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNameProcessors: [(name) => name.replace('dc:', '')],
});

const fetchRSS = async (url) => {
  const startTime = process.hrtime.bigint();
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

    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    logger.info(`Fetched RSS from ${url} in ${durationMs.toFixed(2)} ms.`);

    return items.map(item => ({
      title: item.title,
      summary: item.description,
      content: item.content || item.description,
      source: item.source || item.link, // Use source if available, otherwise link
      publicationDate: new Date(item.pubDate || item.pubdate || dayjs().utc().toDate()),
      state: item.state || (item.title.includes('Chhattisgarh') ? 'Chhattisgarh' : 'National'), // Simulate state inference
      category: 'Business', // Assuming business category for these feeds
    }));
  } catch (error) {
    amogh_fetch_errors_total.labels({ namespace: 'default', service: 'ingestion', source_type: 'rss' }).inc();
    logger.error(`Error fetching RSS from ${url}:`, error);
    return [];
  }
};

const fetchRSSBreaker = createCircuitBreaker(fetchRSS, { name: 'fetchRSS' });

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
      state: article.state || (article.title.includes('Chhattisgarh') ? 'Chhattisgarh' : 'National'), // Simulate state inference
      category: 'Business', // GNews topic is business
    }));
  } catch (error) {
    amogh_fetch_errors_total.labels({ namespace: 'default', service: 'ingestion', source_type: 'gnews' }).inc();
    logger.error('Error fetching news from GNews.io:', error);
    return [];
  }
};

const fetchGNewsBreaker = createCircuitBreaker(fetchGNews, { name: 'fetchGNews' });

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
    const rssArticles = await fetchRSSBreaker.fire(feedUrl);
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
    const gnewsArticles = await fetchGNewsBreaker.fire(gnewsQuery);
    const newGnewsArticles = gnewsArticles.filter(art => {
      return dayjs(art.publicationDate).utc().isSame(dayjs().utc(), 'day');
    });
    articles = articles.concat(newGnewsArticles);
    ingestedCount += newGnewsArticles.length;
  }

  // Process and add to queue
  const processedItems = await processItemsV2(articles);
  for (const item of processedItems) {
    await sendToQueue(item); // Send item to RabbitMQ
    await recordArticleIngest(item.source === 'gnews' ? 'gnews' : 'rss');
  }

  // Fetch other data
  const stockData = await fetchStockData('RELIANCE', 'NSE');
  logger.info('Fetched stock data:', stockData);

  const socialData = await fetchSocialMediaData('Twitter', 'elonmusk');
  logger.info('Fetched social media data:', socialData);

  const fdiData = await fetchFDIData();
  logger.info('Fetched FDI data:', fdiData);

  return { usedCache: false, ingested: processedItems.length };
};

const fetchStockData = async (symbol, exchange) => {
  logger.info(`Fetching dummy stock data for ${symbol} from ${exchange}`);
  // In a real scenario, this would call an external stock API
  return {
    symbol: symbol,
    exchange: exchange,
    price: Math.random() * 1000 + 100, // Random price
    change: Math.random() * 10 - 5, // Random change
    timestamp: new Date(),
  };
};

const fetchSocialMediaData = async (platform, username) => {
  logger.info(`Fetching dummy social media data for ${username} on ${platform}`);
  // In a real scenario, this would call an external social media API
  return {
    platform: platform,
    username: username,
    followers: Math.floor(Math.random() * 100000) + 1000,
    postsToday: Math.floor(Math.random() * 5),
    engagementRate: (Math.random() * 0.1).toFixed(4),
    timestamp: new Date(),
  };
};

const fetchFDIData = async () => {
  logger.info(`Fetching dummy FDI data`);
  // In a real scenario, this would call an external API or scrape data
  return {
    totalFDI: `USD ${(Math.random() * 100 + 50).toFixed(2)} Billion`,
    imports: `USD ${(Math.random() * 800 + 400).toFixed(2)} Billion`,
    exports: `USD ${(Math.random() * 600 + 300).toFixed(2)} Billion`,
    trends: [
      { year: 2022, value: (Math.random() * 30 + 50).toFixed(2) },
      { year: 2023, value: (Math.random() * 30 + 50).toFixed(2) },
      { year: 2024, value: (Math.random() * 30 + 50).toFixed(2) },
    ],
    timestamp: new Date(),
  };
};

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const fetchWeatherData = async (city) => {
  if (!WEATHER_API_KEY) {
    logger.warn('WEATHER_API_KEY is not set. Skipping weather fetch.');
    return null;
  }
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Error fetching weather data:', error);
    return null;
  }
};

const NLP_CLOUD_API_KEY = process.env.NLP_CLOUD_API_KEY;
const NLP_CLOUD_API_URL = 'https://api.nlpcloud.io/v1/gpu/finetuned-gpt-neox-20b/question';

const fetchAIResponse = async (question) => {
  if (!NLP_CLOUD_API_KEY) {
    logger.warn('NLP_CLOUD_API_KEY is not set. Skipping AI response fetch.');
    return null;
  }
  try {
    const response = await axios.post(NLP_CLOUD_API_URL, {
      question: question,
    }, {
      headers: {
        'Authorization': `Token ${NLP_CLOUD_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Error fetching AI response:', error);
    return null;
  }
};

module.exports = { ingestCycle, fetchStockData, fetchSocialMediaData, fetchFDIData, fetchWeatherData, fetchAIResponse };
