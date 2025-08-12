require('dotenv').config();
const processItems = require('../processing/processor');
const { NewsArticle } = require('../ssot/schema');
const winston = require('winston');
const axios = require('axios');
const Queue = require('bull');

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

const NEWS_API_KEY = process.env.NEWSDATA_API_KEY;
const NEWS_API_URL = 'https://newsdata.io/api/1/news';

// Bull Queue for news processing
const newsQueue = new Queue('news processing', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

// Define a list of trusted news sources (NewsData.io source_id values)
// In a production environment, this list should be configurable (e.g., via environment variables or a dedicated config file).
const TRUSTED_SOURCES = [
  'the-economic-times',
  'livemint',
  'business-standard',
  'ndtv-profit',
  'moneycontrol',
  'zeebiz',
  'financial-express',
  'business-today',
  'cnbc-tv18',
  'bloombergquint',
];

const fetchAndProcessNews = async () => {
  logger.info('Fetching real news items from NewsData.io...');
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        apikey: NEWS_API_KEY,
        q: 'finance OR stock market OR economy', // Broad query for financial news
        language: 'en',
        country: 'in', // Focus on India
      },
    });

    const articles = response.data.results;
    if (!articles || articles.length === 0) {
      logger.info('No new articles fetched from NewsData.io.');
      return [];
    }

    // Filter articles by trusted sources
    const filteredArticles = articles.filter(article =>
      TRUSTED_SOURCES.includes(article.source_id)
    );

    if (filteredArticles.length === 0) {
      logger.info('No articles found from trusted sources.');
      return [];
    }

    const mappedArticles = filteredArticles.map(article => ({
      title: article.title,
      summary: article.description || article.content,
      content: article.content,
      source: article.source_id,
      publicationDate: new Date(article.pubDate),
      state: 'National', // NewsData.io doesn't provide state-level data directly, default to National
      category: article.category ? article.category.join(', ') : 'General',
    }));

    const processedItems = await processItems(mappedArticles);

    // Add each processed item to the queue
    for (const item of processedItems) {
      await newsQueue.add(item);
    }
    logger.info(`Added ${processedItems.length} news items to the queue.`);

    return processedItems;
  } catch (error) {
    logger.error('Error fetching news from NewsData.io:', error);
    return [];
  }
};

module.exports = { fetchAndProcessNews };
