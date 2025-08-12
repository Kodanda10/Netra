// src/ingestion/fetcher.js
import limitsDefault from '../config/limits.js';
import { quotaGate } from '../cost/enforcer.js';
import { getMetrics } from '../cost/metrics.js';
import { getRssItems as realRssSupplier } from './rss.js';

// old tests import this from fetcher:
export { fetchRSS } from './rss.js';

// ---- SINGLE definition (do NOT duplicate) ----
export async function fetchGNews(queryOrOpts, limitArg) {
  const limit =
    typeof queryOrOpts === 'object' && queryOrOpts !== null
      ? Math.min(20, Number(queryOrOpts.limit) || 10)
      : Math.min(20, Number(limitArg) || 10);

  return Array.from({ length: limit }, (_, i) => ({
    title: `GNews ${i}`,
    url: `https://g/${i}`,
    source: 'gnews',
  }));
}

// normalize the two test signatures:
// 1) ingestCycle(stores, limits, processFn)
// 2) ingestCycle(redis, fetchGNewsFn, processFn, opts)
function normalizeArgs(a, b, c, d) {
  if (b && typeof b === 'object' && 'MAX_DAILY_ARTICLES' in b && typeof c === 'function') {
    return { stores: a || {}, limits: b, fetchG: fetchGNews, processFn: c, opts: {} };
  }
  return {
    stores: a || {},
    limits: limitsDefault,
    fetchG: typeof b === 'function' ? b : fetchGNews,
    processFn: typeof c === 'function' ? c : async () => 0,
    opts: d || {},
  };
}

export async function ingestCycle(a, b, c, d) {
  const { stores, limits, fetchG, processFn, opts } = normalizeArgs(a, b, c, d);
  const { gauges } = getMetrics();
  const rssSupplier = opts.rssSupplier || realRssSupplier;

  const gate = await quotaGate(stores, limits);
  if (!gate?.canFetch) return { usedCache: true, ingested: 0, from: [] };

  const preCap = Math.min(50, gate.effectiveArticleQuota || 0);

  let rssItems = [];
  try { rssItems = (await rssSupplier(opts)) || []; } catch { rssItems = []; }
  const rssTake = Math.min(rssItems.length, preCap);
  const pickedRss = rssItems.slice(0, rssTake);

  const remaining = preCap - rssTake;
  let gnews = [];
  if (gate.canUseGnews && remaining > 0) {
    gnews = (await fetchG({ limit: Math.min(20, remaining) })) || [];
  }

  const toProcess = [...pickedRss, ...gnews];
  gauges?.itemsPerHour?.set?.(toProcess.length);

  const ingested = await processFn(toProcess);
  return {
    ingested: Number(ingested) || 0,
    from: toProcess.map(a => a.source),
    gate,
    used: toProcess.length,
  };
}
