require('dotenv').config();
const express = require('express');
const winston = require('winston');
const { sequelize, NewsArticle, StockData, FDIMetric, SocialMetric } = require('./ssot/schema');
const { fetchAndProcessNews } = require('./ingestion/fetcher');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Configure Winston logger
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

app.use(express.json());

// CORS configuration (to be refined later)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Ingestion cycle (hourly)
const INGEST_INTERVAL_MINUTES = process.env.INGEST_INTERVAL_MINUTES || 60;
const startIngestionCycle = async () => {
  logger.info('Starting ingestion cycle...');
  const newsItems = await fetchAndProcessNews();
  if (newsItems && newsItems.length > 0) {
    logger.info(`Ingested ${newsItems.length} news items.`);
  }
};

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('Backend is healthy');
});

// News endpoint
app.get('/news', async (req, res) => {

  const { state, date } = req.query;
  let whereClause = {};

  if (state) {
    whereClause.state = state;
  }

  if (date) {
    // Assuming date is in YYYY-MM-DD format
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    whereClause.publicationDate = {
      [sequelize.Op.gte]: startOfDay,
      [sequelize.Op.lt]: endOfDay,
    };
  }

  try {
    let articles = await NewsArticle.findAll({
      where: whereClause,
      order: [['publicationDate', 'DESC']],
    });

    if (articles.length === 0) {
      logger.info('No articles found, triggering ingestion.');
      await startIngestionCycle();
      articles = await NewsArticle.findAll({
        where: whereClause,
        order: [['publicationDate', 'DESC']],
      });
    }

    res.json(articles);
  } catch (error) {
    logger.error('Error fetching news articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get distinct states for news
app.get('/news/states', async (req, res) => {
  try {
    const states = await NewsArticle.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('state')), 'state']],
      where: { state: { [sequelize.Op.ne]: null } }, // Exclude null states
    });
    res.json(states.map(s => s.state));
  } catch (error) {
    logger.error('Error fetching distinct states:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dummy stock data endpoint
app.get('/stocks', (req, res) => {
  const { exchange } = req.query;
  let stocks = [
    { symbol: 'TCS', price: 3800, change: 50, exchange: 'NSE' },
    { symbol: 'RELIANCE', price: 2900, change: -20, exchange: 'NSE' },
    { symbol: 'INFY', price: 1600, change: 10, exchange: 'BSE' },
    { symbol: 'HDFC', price: 1500, change: -5, exchange: 'BSE' },
  ];
  if (exchange) {
    stocks = stocks.filter(s => s.exchange.toLowerCase() === exchange.toLowerCase());
  }
  res.json(stocks);
});

// Dummy FDI data endpoint
app.get('/fdi', (req, res) => {
  const fdiData = [
    { sector: 'Manufacturing', value: '120B USD', growth: '8%' },
    { sector: 'Services', value: '90B USD', growth: '6%' },
  ];
  res.json(fdiData);
});

// Dummy social media analytics endpoint
app.get('/social', (req, res) => {
  const socialData = [
    { platform: 'Twitter', sentiment: 'Positive', mentions: 15000 },
    { platform: 'Facebook', sentiment: 'Neutral', mentions: 20000 },
  ];
  res.json(socialData);
});

// Dummy weather and intelligence endpoint
app.get('/weather', (req, res) => {
  const weatherData = {
    location: 'New Delhi',
    temperature: '30°C',
    condition: 'Sunny',
    intelligenceNote: 'Expect moderate air quality today due to urban pollution. No significant weather events expected.',
  };
  res.json(weatherData);
});

// Basic AI assistant endpoint (searches news articles)
app.get('/ai', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter `q` is required.' });
  }

  try {
    const articles = await NewsArticle.findAll({
      where: {
        [sequelize.Op.or]: [
          { title: { [sequelize.Op.like]: `%${query}%` } },
          { summary: { [sequelize.Op.like]: `%${query}%` } },
          { content: { [sequelize.Op.like]: `%${query}%` } },
        ],
      },
      limit: 3,
      order: [['publicationDate', 'DESC']],
    });
    res.json(articles);
  } catch (error) {
    logger.error('Error searching articles for AI query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  logger.info(`Backend server running on port ${PORT}`);
  // Initial ingestion on startup
  startIngestionCycle();
  // Schedule hourly ingestion
  setInterval(startIngestionCycle, INGEST_INTERVAL_MINUTES * 60 * 1000);
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack, path: req.path });
  res.status(500).json({ error: 'Internal Server Error' });
});
