import express from 'express';
import { getMetrics } from './cost/metrics.js';

export const app = express();

// seed metrics so /metrics isn't empty
getMetrics();

app.get('/metrics', async (_req, res) => {
  const { register } = getMetrics();
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default app;