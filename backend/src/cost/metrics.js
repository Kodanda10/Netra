import client from "prom-client";
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const g = (name, help, labelNames = []) =>
  new client.Gauge({ name, help, labelNames });
const c = (name, help, labelNames = []) =>
  new client.Counter({ name, help, labelNames });

export const gauges = {
  dailyArticles: g("amogh_daily_article_count", "Articles ingested today"),
  dailyQuota: g("amogh_daily_article_quota", "Effective article quota today"),
  gnewsDaily: g("amogh_gnews_daily_count", "GNews items used today"),
  gnewsQuota: g("amogh_gnews_daily_quota", "GNews daily cap"),
  costSummaryINR: g("amogh_article_cost_inr_hourly", "Hourly summary cost INR"),
  costTransINR: g("amogh_translation_cost_inr_hourly", "Hourly translation cost INR"),
  itemsPerHour: g("amogh_items_per_hour", "Items per hour"),
  queueDepth: g("amogh_queue_depth", "Queue depth"),
  backlog: g("amogh_processor_backlog", "Processor backlog"),
  burstActive: g("amogh_burst_mode_active", "Burst mode active (0/1)"),
  freshnessP95m: g("amogh_freshness_age_minutes_p95", "Freshness age p95 minutes"),
  sourceToday: g("amogh_source_items_today", "Items by source today", ["source"])
};

export const counters = {
  fetchReq: c("amogh_fetch_requests_total", "Fetch requests total"),
  fetchErr: c("amogh_fetch_errors_total", "Fetch errors total"),
  circuitOpen: c("amogh_circuit_open_total", "Circuit open total"),
  dbTxFail: c("amogh_db_tx_failures_total", "DB tx failures"),
  overrides: c("amogh_override_events_total", "Override events total", ["reason"])
};

for (const m of [...Object.values(gauges), ...Object.values(counters)]) {
  register.registerMetric(m);
}

export { register };