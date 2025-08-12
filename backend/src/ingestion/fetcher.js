// src/ingestion/fetcher.js
import limits from '../config/limits.js';
import { getGate } from './gate.js';
import { getMetrics } from '../cost/metrics.js';
import { getRssItems as realRssSupplier } from './rss.js';

// Deterministic stub (used by tests). Real impl can replace later.
export async function fetchGNews(queryOrOpts, limitArg) {
  const limit = typeof queryOrOpts === 'object' && queryOrOpts !== null
    ? Math.min(20, Number(queryOrOpts.limit) || 10)
    : Math.min(20, Number(limitArg) || 10);

  return Array.from({ length: limit }, (_, i) => ({
    title: `GNews ${i}`,
    url: `https://g/${i}`,
    source: 'gnews',
  }));
}

// src/ingestion/fetcher.js
import limitsDefault from '../config/limits.js';
import { quotaGate } from '../cost/enforcer.js';
import { getMetrics } from '../cost/metrics.js';
import { getRssItems as realRssSupplier } from './rss.js';
export { fetchRSS } from './rss.js'; // old tests import this from fetcher

// deterministic stub (tests spy/override this too)
export async function fetchGNews(queryOrOpts, limitArg) {
  const limit = typeof queryOrOpts === 'object' && queryOrOpts !== null
    ? Math.min(20, Number(queryOrOpts.limit) || 10)
    : Math.min(20, Number(limitArg) || 10);

  return Array.from({ length: limit }, (_, i) => ({
    title: `GNews ${i}`,
    url: `https://g/${i}`,
    source: 'gnews',
  }));
}

// normalize args: (stores, limits, processFn)  OR (redis, fetchGNewsFn, processFn, opts)
function normalizeArgs(a, b, c, d) {
  // old signature: ingestCycle(stores, limits, processFn)
  if (b && typeof b === 'object' && 'MAX_DAILY_ARTICLES' in b && typeof c === 'function') {
    return {
      stores: a || {},
      limits: b,
      fetchG: fetchGNews,
      processFn: c,
      opts: {},
    };
  }
  // new signature
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

  // gate (tests spy on quotaGate)
  const gate = await quotaGate(stores, limits);
  if (!gate?.canFetch) return { usedCache: true, ingested: 0, from: [] };

  const preCap = Math.min(50, gate.effectiveArticleQuota || 0);

  // RSS
  let rssItems = [];
  try { rssItems = (await rssSupplier(opts)) || []; } catch { rssItems = []; }
  const rssTake = Math.min(rssItems.length, preCap);
  const pickedRss = rssItems.slice(0, rssTake);

  // GNews (<=20, only if headroom)
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
    from: toProcess.map(a => a.source), // tests check includes("gnews")
    gate,
    used: toProcess.length,
  };
}

export default { ingestCycle, fetchGNews };

export default { ingestCycle, fetchGNews };