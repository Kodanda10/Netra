import client from 'prom-client';
const register = client.register;

let gauges: any | undefined;
let counters: any | undefined;

function getOrCreateGauge(name: string, help: string) {
  return register.getSingleMetric(name) || new client.Gauge({ name, help, registers: [register] });
}
function getOrCreateCounter(name: string, help: string) {
  return register.getSingleMetric(name) || new client.Counter({ name, help, registers: [register] });
}

export function getMetrics() {
  if (!gauges || !counters) {
    gauges = {
      itemsPerHour: getOrCreateGauge('amogh_items_per_hour', 'Items per hour'),
      dailyArticleCount: getOrCreateGauge('amogh_daily_article_count', 'Articles ingested today'),
    };
    counters = {
      rssRequests: getOrCreateCounter('amogh_rss_requests_total', 'RSS requests total'),
    };
  }
  return { gauges, counters, register };
}

export function resetMetrics() {
  gauges = undefined;
  counters = undefined;
  register.clear();
}