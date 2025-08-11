import express from 'express';
import cron from 'node-cron';
import { register } from './cost/metrics.js';
import { ingestCycle } from './ingestion/fetcher.js';
import { quotaGate } from './cost/enforcer.js';
import pino from 'pino';

const logger = pino();
const app = express();
const port = process.env.PORT || 4000;

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// Cron job to run every hour
cron.schedule('0 * * * *', async () => {
  logger.info('Running hourly ingestion cycle');
  const redis = {}; // Replace with actual redis client
  const gate = await quotaGate(redis);
  if (gate.canFetch) {
    await ingestCycle(redis);
  }
});

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});