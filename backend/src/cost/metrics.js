import client from 'prom-client';
const register = client.register;

function getOrCreateGauge(name, help, labelNames = []) {
  return register.getSingleMetric(name) ||
    new client.Gauge({ name, help, labelNames, registers: [register] });
}
function getOrCreateCounter(name, help, labelNames = []) {
  return register.getSingleMetric(name) ||
    new client.Counter({ name, help, labelNames, registers: [register] });
}

export const gauges = {
  dailyArticleCount: getOrCreateGauge('amogh_daily_article_count', 'Articles ingested today'),
  // add others as needed...
};
export const counters = {
  // example:
  // rssRequests: getOrCreateCounter('amogh_rss_requests_total', 'RSS requests'),
};

export function resetMetrics() {
  register.clear(); // used in tests to avoid duplicate registrations across suites
}

export default { gauges, counters, resetMetrics, register };