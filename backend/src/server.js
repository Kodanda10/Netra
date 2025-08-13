require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const pino = require('pino');
const { register } = require('./cost/metrics');
const { ingestCycle } = require('./ingestion/fetcher');
const { evaluateBurstAuto } = require('./cost/enforcer');
const { sequelize } = require('./ssot/schema');

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
