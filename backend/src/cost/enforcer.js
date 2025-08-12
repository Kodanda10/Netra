// src/cost/enforcer.js
import { getMetrics } from './metrics.js';

const burst = { active: false, until: 0 };

export function setBurstActive(active, ttlMinutes = 30) {
  const { gauges } = getMetrics();
  burst.active = !!active;
  burst.until = active ? Date.now() + ttlMinutes * 60_000 : 0;
  gauges?.burstActive?.set?.(active ? 1 : 0);
}

export function isBurstActive() {
  return burst.active && Date.now() < burst.until;
}

export function setNearCap(active) {
  const { gauges } = getMetrics();
  gauges?.nearCap?.set?.(active ? 1 : 0);
}

import { getDailyCounter } from './counters.js';
import { getMetrics } from './metrics.js';

export async function quotaGate(stores, limits) {
  const base = Number(limits?.MAX_DAILY_ARTICLES ?? 100);
  const gnewsCap = Number(limits?.GNEWS_MAX_DAILY ?? 50);
  const burst = isBurstActive() ? 1.2 : 1.0;
  const effective = Math.round(base * burst);

  let usedArticles = 0, usedGnews = 0;
  try { usedArticles = await getDailyCounter(stores?.redis, 'articles'); } catch {}
  try { usedGnews = await getDailyCounter(stores?.redis, 'gnews'); } catch {}

  const nearCap = usedArticles >= Math.floor(0.8 * base);
  const canUseGnews = usedGnews < gnewsCap;   // ✅ flip to false at cap

  const { gauges } = getMetrics();
  gauges?.nearCap?.set?.(nearCap ? 1 : 0);
  gauges?.gnewsRemaining?.set?.(Math.max(gnewsCap - usedGnews, 0));

  return {
    canFetch: true,
    canUseGnews,
    effectiveArticleQuota: effective,
    nearCap,
  };
}

/** tests call this directly */
export function evaluateBurstAuto(hitsPerHour, nearCap, limits) {
  // simple rule for tests: >=25/h & not near cap => burst on, else off
  if (hitsPerHour >= 25 && !nearCap) setBurstActive(true);
  else setBurstActive(false);
}

export default { setBurstActive, isBurstActive, setNearCap, quotaGate, evaluateBurstAuto };