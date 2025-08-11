
import { Registry, Gauge, Counter } from 'prom-client';

export const register = new Registry();

export const dailyArticleCount = new Gauge({
  name: 'amogh_daily_article_count',
  help: 'Number of articles ingested today',
  registers: [register],
});

export const dailyArticleQuota = new Gauge({
  name: 'amogh_daily_article_quota',
  help: 'Total daily article quota',
  registers: [register],
});

export const gnewsDailyCount = new Gauge({
  name: 'amogh_gnews_daily_count',
  help: 'Number of GNews articles ingested today',
  registers: [register],
});

export const gnewsDailyQuota = new Gauge({
  name: 'amogh_gnews_daily_quota',
  help: 'Total daily GNews article quota',
  registers: [register],
});

export const articleCostInrHourly = new Gauge({
  name: 'amogh_article_cost_inr_hourly',
  help: 'Hourly cost of article ingestion in INR',
  registers: [register],
});

export const translationCostInrHourly = new Gauge({
  name: 'amogh_translation_cost_inr_hourly',
  help: 'Hourly cost of translation in INR',
  registers: [register],
});

export const itemsPerHour = new Gauge({
  name: 'amogh_items_per_hour',
  help: 'Number of items processed per hour',
  registers: [register],
});

export const queueDepth = new Gauge({
  name: 'amogh_queue_depth',
  help: 'Number of items in the processing queue',
  registers: [register],
});

export const processorBacklog = new Gauge({
  name: 'amogh_processor_backlog',
  help: 'Number of items in the processor backlog',
  registers: [register],
});

export const burstModeActive = new Gauge({
  name: 'amogh_burst_mode_active',
  help: 'Whether burst mode is currently active',
  registers: [register],
});

export const freshnessAgeMinutesP95 = new Gauge({
  name: 'amogh_freshness_age_minutes_p95',
  help: '95th percentile of article freshness in minutes',
  registers: [register],
});

export const sourceItemsToday = new Gauge({
  name: 'amogh_source_items_today',
  help: 'Number of items ingested today by source',
  labelNames: ['source'],
  registers: [register],
});

export const fetchRequestsTotal = new Counter({
  name: 'amogh_fetch_requests_total',
  help: 'Total number of fetch requests',
  registers: [register],
});

export const fetchErrorsTotal = new Counter({
  name: 'amogh_fetch_errors_total',
  help: 'Total number of fetch errors',
  registers: [register],
});

export const circuitOpenTotal = new Counter({
  name: 'amogh_circuit_open_total',
  help: 'Total number of times the circuit breaker has opened',
  registers: [register],
});

export const dbTxFailuresTotal = new Counter({
  name: 'amogh_db_tx_failures_total',
  help: 'Total number of database transaction failures',
  registers: [register],
});

export const overrideEventsTotal = new Counter({
  name: 'amogh_override_events_total',
  help: 'Total number of override events',
  labelNames: ['reason'],
  registers: [register],
});
