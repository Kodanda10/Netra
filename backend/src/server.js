require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const pino = require('pino');
const { register } = require('./cost/metrics');
const { ingestCycle } = require('./ingestion/fetcher');
const { evaluateBurstAuto } = require('./cost/enforcer');
const { sequelize, NewsArticle } = require('./ssot/schema');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); // Middleware to parse JSON request bodies

// Middleware for logging requests
app.use((req, res, next) => {
  logger.info({ req: { method: req.method, url: req.url } }, 'Incoming request');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Route for stock data
app.get('/stocks', (req, res) => {
  // Dummy stock data for now
  const dummyStocks = [
    { symbol: 'TCS', price: 3500, change: +50, exchange: 'NSE' },
    { symbol: 'RELIANCE', price: 2500, change: -20, exchange: 'BSE' },
    { symbol: 'INFY', price: 1500, change: +10, exchange: 'NSE' },
  ];
  res.status(200).json(dummyStocks);
});

// Route for historical news data
app.get('/news/history', async (req, res) => {
  const { date, state } = req.query;
  // Dummy historical news data for now
  const dummyHistoricalNews = [
    { title: 'Dummy Historical News 1', summary: 'Summary 1', publicationDate: '2025-08-12', state: 'National' },
    { title: 'Dummy Historical News 2', summary: 'Summary 2', publicationDate: '2025-08-11', state: 'Maharashtra' },
  ];
  res.status(200).json(dummyHistoricalNews);
});

// Route for AI summarization
app.post('/ai/summarize', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required for summarization.' });
  }
  // Dummy summarization for now
  const summarizedText = `Summary of: "${text.substring(0, 50)}..."`;
  res.status(200).json({ summary: summarizedText });
});

// Route for AI translation
app.post('/ai/translate', (req, res) => {
  const { text, targetLanguage } = req.body;
  if (!text || !targetLanguage) {
    return res.status(400).json({ error: 'Text and targetLanguage are required for translation.' });
  }
  // Dummy translation for now
  const translatedText = `Translated "${text.substring(0, 50)}..." to ${targetLanguage}`; 
  res.status(200).json({ translation: translatedText });
});

// Cron job for hourly ingestion
// Runs every hour
cron.schedule('0 * * * *', async () => {
  logger.info('Running hourly ingestion cycle...');
  // TODO: Get VIX and semanticSpike via provider stub
  const vix = 17; // Placeholder
  const semanticSpike = false; // Placeholder
  evaluateBurstAuto(vix, semanticSpike);
  await ingestCycle();
  logger.info('Hourly ingestion cycle completed.');
});

// Initialize database and start server
const startServer = async () => {
  try {
    await sequelize.sync({ force: false }); // Do not force sync here, worker handles it
    logger.info('Database synchronized for server.');
    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
