// src/ingestion/fetcher.js
import limits from '../config/limits.js';
import { getGate } from './gate.js';
import { getMetrics } from '../cost/metrics.js';
import { getRssItems as realRssSupplier } from './rss.js';

export async function ingestCycle(redis, fetchGNews, processFn, opts = {}) {
  const { gauges } = getMetrics();                 // metrics singleton
  const rssSupplier = opts.rssSupplier || realRssSupplier;

  const gate = await getGate(redis);
  if (!gate || gate.canFetch === false) {
    return { usedCache: true, ingested: 0, from: [] };
  }

  const preCap = Math.min(50, gate.effectiveArticleQuota || 0);

  const rssItems = (await rssSupplier(opts)) || [];
  const rssTake = Math.min(rssItems.length, preCap);
  const pickedRss = rssItems.slice(0, rssTake);

  let gnews = [];
  if (gate.canUseGnews && rssTake < preCap) {
    const remaining = Math.min(20, preCap - rssTake);
    if (remaining > 0) {
      gnews = (await fetchGNews({ limit: remaining })) || [];
    }
  }

  const toProcess = [...pickedRss, ...gnews];
  if (gauges && gauges.itemsPerHour && typeof gauges.itemsPerHour.set === 'function') {
    gauges.itemsPerHour.set(toProcess.length);
  }

  const ingested = await processFn(toProcess);
  return {
    ingested: Number(ingested) || 0,
    gate,
    used: toProcess.length,
    from: { rss: pickedRss.length, gnews: gnews.length },
  };
}

export default { ingestCycle };