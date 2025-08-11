import "dotenv/config";
import express from "express";
import cron from "node-cron";
import pino from "pino";
import { register } from "./cost/metrics.js";
import { limitsFromEnv } from "./cost/limits.js";
import { makeStores, ensureDailyTables } from "./cost/counters.js";
import { evaluateBurstAuto } from "./cost/enforcer.js";
import { ingestCycle } from "./ingestion/fetcher.js";
import { processorFactory } from "./processing/processor.js";

const app = express();
const log = pino({ level: "info" });
const limits = limitsFromEnv(process.env);
const stores = makeStores();

await ensureDailyTables(stores.pool);

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.get("/health", (_req, res) => res.json({ ok: true }));

// provider stubs (wire your sources)
async function getVIX() { return 19; } // triggers burst by default
async function semanticSpike() { return false; }

const processFn = await processorFactory(limits);

cron.schedule("0 * * * *", async () => {
  const vix = await getVIX();
  const spike = await semanticSpike();
  evaluateBurstAuto(vix, spike, limits);
  const stats = await ingestCycle(stores, limits, processFn);
  log.info({ stats }, "ingestCycle complete");
});

const port = Number(process.env.PORT || 3001);
export const server = app.listen(port, () => log.info({ port }, "server up"));
export default app;