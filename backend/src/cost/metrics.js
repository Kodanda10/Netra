const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Register a default metrics collection
client.collectDefaultMetrics({ register });

// Define Gauges
const amogh_daily_article_count = new client.Gauge({
  name: 'amogh_daily_article_count',
  help: 'Current count of articles ingested today',
  labelNames: ['namespace', 'service'],
});

const amogh_daily_article_quota = new client.Gauge({
  name: 'amogh_daily_article_quota',
  help: 'Daily article quota',
  labelNames: ['namespace', 'service'],
});

const amogh_gnews_daily_count = new client.Gauge({
  name: 'amogh_gnews_daily_count',
  help: 'Current count of GNews articles ingested today',
  labelNames: ['namespace', 'service'],
});

const amogh_gnews_daily_quota = new client.Gauge({
  name: 'amogh_gnews_daily_quota',
  help: 'Daily GNews article quota',
  labelNames: ['namespace', 'service'],
});

const amogh_article_cost_inr_hourly = new client.Gauge({
  name: 'amogh_article_cost_inr_hourly',
  help: 'Hourly cost of articles in INR',
  labelNames: ['namespace', 'service'],
});

const amogh_translation_cost_inr_hourly = new client.Gauge({
  name: 'amogh_translation_cost_inr_hourly',
  help: 'Hourly cost of translations in INR',
  labelNames: ['namespace', 'service'],
});

const amogh_items_per_hour = new client.Gauge({
  name: 'amogh_items_per_hour',
  help: 'Number of items processed per hour',
  labelNames: ['namespace', 'service'],
});

const amogh_queue_depth = new client.Gauge({
  name: 'amogh_queue_depth',
  help: 'Current depth of the processing queue',
  labelNames: ['namespace', 'service'],
});

const amogh_processor_backlog = new client.Gauge({
  name: 'amogh_processor_backlog',
  help: 'Number of items in processor backlog',
  labelNames: ['namespace', 'service'],
});

const amogh_burst_mode_active = new client.Gauge({
  name: 'amogh_burst_mode_active',
  help: 'Indicates if burst mode is active (1 for active, 0 for inactive)',
  labelNames: ['namespace', 'service'],
});

const amogh_freshness_age_minutes_p95 = new client.Gauge({
  name: 'amogh_freshness_age_minutes_p95',
  help: '95th percentile of article freshness age in minutes',
  labelNames: ['namespace', 'service'],
});

const amogh_source_items_today = new client.Gauge({
  name: 'amogh_source_items_today',
  help: 'Number of items ingested from a specific source today',
  labelNames: ['namespace', 'service', 'source'],
});

// Define Counters
const amogh_fetch_requests_total = new client.Counter({
  name: 'amogh_fetch_requests_total',
  help: 'Total number of fetch requests made',
  labelNames: ['namespace', 'service', 'source_type'],
});

const amogh_fetch_errors_total = new client.Counter({
  name: 'amogh_fetch_errors_total',
  help: 'Total number of fetch errors',
  labelNames: ['namespace', 'service', 'source_type'],
});

const amogh_circuit_open_total = new client.Counter({
  name: 'amogh_circuit_open_total',
  help: 'Total number of times the circuit breaker opened',
  labelNames: ['namespace', 'service'],
});

const amogh_db_tx_failures_total = new client.Counter({
  name: 'amogh_db_tx_failures_total',
  help: 'Total number of database transaction failures',
  labelNames: ['namespace', 'service'],
});

const amogh_override_events_total = new client.Counter({
  name: 'amogh_override_events_total',
  help: 'Total number of override events',
  labelNames: ['namespace', 'service', 'reason'],
});

// Register all metrics
register.registerMetric(amogh_daily_article_count);
register.registerMetric(amogh_daily_article_quota);
register.registerMetric(amogh_gnews_daily_count);
register.registerMetric(amogh_gnews_daily_quota);
register.registerMetric(amogh_article_cost_inr_hourly);
register.registerMetric(amogh_translation_cost_inr_hourly);
register.registerMetric(amogh_items_per_hour);
register.registerMetric(amogh_queue_depth);
register.registerMetric(amogh_processor_backlog);
register.registerMetric(amogh_burst_mode_active);
register.registerMetric(amogh_freshness_age_minutes_p95);
register.registerMetric(amogh_source_items_today);
register.registerMetric(amogh_fetch_requests_total);
register.registerMetric(amogh_fetch_errors_total);
register.registerMetric(amogh_circuit_open_total);
register.registerMetric(amogh_db_tx_failures_total);
register.registerMetric(amogh_override_events_total);

module.exports = {
  register,
  amogh_daily_article_count,
  amogh_daily_article_quota,
  amogh_gnews_daily_count,
  amogh_gnews_daily_quota,
  amogh_article_cost_inr_hourly,
  amogh_translation_cost_inr_hourly,
  amogh_items_per_hour,
  amogh_queue_depth,
  amogh_processor_backlog,
  amogh_burst_mode_active,
  amogh_freshness_age_minutes_p95,
  amogh_source_items_today,
  amogh_fetch_requests_total,
  amogh_fetch_errors_total,
  amogh_circuit_open_total,
  amogh_db_tx_failures_total,
  amogh_override_events_total,
};
