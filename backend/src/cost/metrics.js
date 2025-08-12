import client from 'prom-client';
const register = client.register;

let gauges;
let counters;

function gauge(name, help) {
  const ex = register.getSingleMetric(name);
  return ex || new client.Gauge({ name, help, registers: [register] });
}
function counter(name, help, labelNames = []) {
  const ex = register.getSingleMetric(name);
  return ex || new client.Counter({ name, help, labelNames, registers: [register] });
}

export function getMetrics() {
  if (!gauges || !counters) {
    gauges = {
      itemsPerHour: gauge('amogh_items_per_hour', 'Items per hour'),
      dailyArticleCount: gauge('amogh_daily_article_count', 'Articles ingested today'),
    };
    counters = {
      rssRequests: counter('amogh_rss_requests_total', 'RSS requests total'),
      fetchErr: counter('amogh_fetch_errors_total', 'Fetch errors', ['code']),
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