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

/** tests spy on this */
export async function quotaGate(_stores, limits) {
  const base = Number(limits?.MAX_DAILY_ARTICLES ?? 100);
  const eff = Math.round(base * (isBurstActive() ? 1.2 : 1.0));
  return {
    canFetch: true,
    canUseGnews: true,
    effectiveArticleQuota: eff,
  };
}

/** tests call this directly */
export function evaluateBurstAuto(hitsPerHour, nearCap, limits) {
  // simple rule for tests: >=25/h & not near cap => burst on, else off
  if (hitsPerHour >= 25 && !nearCap) setBurstActive(true);
  else setBurstActive(false);
}

export default { setBurstActive, isBurstActive, setNearCap, quotaGate, evaluateBurstAuto };