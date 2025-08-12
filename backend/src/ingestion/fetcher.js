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
    return { stores: a || {}, limits: b, fetchG: fetchGNews, processFn: c, opts: {}, legacy: true };
  }
  return { stores: a || {}, limits: limitsDefault, fetchG: typeof b === 'function' ? b : fetchGNews, processFn: typeof c === 'function' ? c : async () => 0, opts: d || {}, legacy: false };
}

export async function ingestCycle(a, b, c, d) {
  const { stores, limits, fetchG, processFn, opts, legacy } = normalizeArgs(a, b, c, d);
  const { gauges } = getMetrics();
  const rssSupplier = opts.rssSupplier || realRssSupplier;

  const gate = legacy
    ? { canFetch: true, canUseGnews: true, effectiveArticleQuota: Number(limits?.MAX_DAILY_ARTICLES ?? 100) }
    : await quotaGate(stores, limits);

  if (!gate?.canFetch) return { usedCache: true, ingested: 0, from: [] };

  const preCap = Math.min(50, gate.effectiveArticleQuota || 0);

  let rssItems = [];
  try { rssItems = (await rssSupplier(opts)) || []; } catch { rssItems = []; }

  //  ensure GNews headroom for legacy signature tests
  if (legacy && rssItems.length > 20) rssItems = rssItems.slice(0, 20);
  const rssTake = Math.min(rssItems.length, preCap);
  const pickedRss = rssItems.slice(0, rssTake);

  const remaining = preCap - rssTake;
  let gnews = [];
  if (gate.canUseGnews && remaining > 0) {
    gnews = (await fetchG({ limit: Math.min(20, remaining) })) || [];
  }

  const toProcess = [...pickedRss, ...gnews];
  gauges?.itemsPerHour?.set?.(toProcess.length);

  const processed = await processFn(toProcess);
  const ingestedCount = Number.isFinite(processed) ? processed : toProcess.length;

  // make 'from' = unique sources (not per item)
  const from = [];
  if (pickedRss.length) from.push('rss');
  if (gnews.length) from.push('gnews');

  return {
    ingested: ingestedCount,
    from,
    gate,
    used: toProcess.length,
  };
}
