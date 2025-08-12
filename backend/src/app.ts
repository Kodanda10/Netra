import express from 'express';
import client from 'prom-client';

export const app = express();

// Prometheus metrics
const register = client.register;
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// ...other routes

export default app;