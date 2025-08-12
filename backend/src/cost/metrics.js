// src/cost/metrics.js
import client from 'prom-client';
const register = client.register;

let gauges;
let counters;

function g(name, help) {
  return register.getSingleMetric(name) || new client.Gauge({ name, help, registers: [register] });
}
function c(name, help, labelNames = []) {
  return register.getSingleMetric(name) || new client.Counter({ name, help, labelNames, registers: [register] });
}

export function getMetrics() {
  if (!gauges || !counters) {
    gauges = {
      itemsPerHour: g('amogh_items_per_hour', 'Items per hour'),
      dailyArticleCount: g('amogh_daily_article_count', 'Articles ingested today'),
      burstActive: g('amogh_burst_active', 'Burst mode active (0/1)'),                 // <-- for enforcer
      nearCap: g('amogh_near_cap', 'Near daily cap (0/1)'),                            // <-- likely used too
    };
    counters = {
      rssRequests: c('amogh_rss_requests_total', 'RSS requests total'),
      fetchErr: c('amogh_fetch_errors_total', 'Fetch errors', ['code']),
    };
  }
  return { gauges, counters, register };
}

export function resetMetrics() {
  gauges = undefined;
  counters = undefined;
  register.clear();
}

export default { getMetrics, resetMetrics };