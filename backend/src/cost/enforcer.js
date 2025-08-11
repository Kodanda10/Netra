
import * as limits from './limits.js';

// Stubs for metrics, replace with actual implementation from metrics.js
const metrics = {
  amogh_burst_mode_active: { set: () => {} },
  amogh_daily_article_quota: { set: () => {} },
  amogh_override_events_total: { inc: () => {} },
};

let burstActive = false;
let burstExpiry = null;

export function setBurstActive(active, ttlMinutes = 120) {
  burstActive = active;
  metrics.amogh_burst_mode_active.set(active ? 1 : 0);
  if (active) {
    burstExpiry = Date.now() + ttlMinutes * 60 * 1000;
  } else {
    burstExpiry = null;
  }
}

export function evaluateBurstAuto(vix, semanticSpike) {
  if (vix >= limits.VIX_THRESHOLD || semanticSpike) {
    setBurstActive(true);
  } else if (burstActive && burstExpiry && Date.now() > burstExpiry) {
    setBurstActive(false);
  }
}

export async function quotaGate(redis, pool) {
  const today = new Date().toISOString().split('T')[0];
  const currentArticles = parseInt((await redis.get(`articles:${today}`)) || '0', 10);
  const currentGnews = parseInt((await redis.get(`gnews:${today}`)) || '0', 10);

  if (burstActive && burstExpiry && Date.now() > burstExpiry) {
    setBurstActive(false);
  }

  const baseQuota = limits.MAX_DAILY_ARTICLES;
  const effectiveArticleQuota = burstActive ? baseQuota * (1 + limits.BURST_PERCENT / 100) : baseQuota;

  metrics.amogh_daily_article_quota.set(effectiveArticleQuota);

  const nearCap = currentArticles / effectiveArticleQuota >= limits.QUOTA_WARN_PCT;
  const canUseGnews = currentGnews < limits.GNEWS_MAX_DAILY;

  if (currentArticles >= effectiveArticleQuota) {
    return { canFetch: false, nearCap, canUseGnews, effectiveArticleQuota };
  }

  if (currentArticles / baseQuota >= limits.COOLDOWN_AT_PCT) {
    const remaining = effectiveArticleQuota - currentArticles;
    const hoursLeft = Math.max(1, 24 - new Date().getUTCHours());
    const releasePerHour = Math.ceil(remaining / hoursLeft);
    const attemptsThisHour = parseInt((await redis.get(`cooldown_attempts:${today}:${new Date().getUTCHours()}`)) || '0', 10);
    if (attemptsThisHour >= releasePerHour) {
      return { canFetch: false, nearCap, canUseGnews, effectiveArticleQuota };
    }
  }

  return { canFetch: true, nearCap, canUseGnews, effectiveArticleQuota };
}

export async function recordArticleIngest(redis, source) {
    const today = new Date().toISOString().split('T')[0];
    await redis.incr(`articles:${today}`);
    if (source === 'gnews') {
        await redis.incr(`gnews:${today}`);
    }
    const attemptsThisHourKey = `cooldown_attempts:${today}:${new Date().getUTCHours()}`;
    await redis.incr(attemptsThisHourKey);
}

export function overrideAction(reason) {
  metrics.amogh_override_events_total.inc({ reason });
}
