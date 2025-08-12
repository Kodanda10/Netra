import "dotenv/config";
import express from 'express';
import cron from "node-cron";
import pino from "pino";
import { register } from "./cost/metrics.js";
import { limitsFromEnv } from "./cost/limits.js";
import { makeStores } from "./cost/counters.js";
import { evaluateBurstAuto } from "./cost/enforcer.js";
import { ingestCycle } from "./ingestion/fetcher.js";
import { processorFactory } from "./processing/processor.js";
import sequelize, { NewsArticle } from './ssot/schema.js';

const app = express();

const start = async () => {
  try {
    await sequelize.authenticate();

    app.get("/metrics", async (_req, res) => {
      res.set("Content-Type", register.contentType);
      res.end(await register.metrics());
    });

    app.get("/health", (_req, res) => res.json({ ok: true }));

    app.get("/news", async (req, res) => {
      const { scope, stateId, lang } = req.query;
      let where = {};

      if (scope === 'bharat') {
        where.category = 'all-india';
      } else if (scope === 'state' && stateId) {
        where.category = 'state';
        where.state = stateId;
      }

      if (lang) {
        where.language = lang;
      }

      const articles = await NewsArticle.findAll({ where });
      res.json({ articles, updatedAt: new Date().toISOString() });
    });

    // optional: await sequelize.sync();  // only if you want auto schema
    const port = Number(process.env.PORT) || 3001;
    app.listen(port, () => console.log(`server up on ${port}`));

    const log = pino({ level: "info" });
    const limits = limitsFromEnv(process.env);
    const stores = makeStores();
    const processFn = await processorFactory(limits);

    cron.schedule("0 * * * *", async () => {
      const vix = await getVIX();
      const spike = await semanticSpike();
      evaluateBurstAuto(vix, spike, limits);
      const stats = await ingestCycle(stores, limits, processFn);
      log.info({ stats }, "ingestCycle complete");
    });

    async function getVIX() { return 19; } // triggers burst by default
    async function semanticSpike() { return false; }
  } catch (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
};

start();

export default app;