import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);
import { gauges, counters } from "./metrics.js";
import { getDailyCounter, incDailyCounter } from "./counters.js";

let burst = { active: false, until: 0 };

export function setBurstActive(active, ttlMinutes = 120) {
  burst.active = !!active;
  burst.until = active ? Date.now() + ttlMinutes * 60_000 : 0;
  gauges.burstActive.set(active ? 1 : 0);
}

export function evaluateBurstAuto(vix, semanticSpike, limits) {
  const should = vix >= limits.VIX_THRESHOLD || !!semanticSpike;
  if (should) setBurstActive(true);
  if (burst.active && burst.until && Date.now() > burst.until) setBurstActive(false);
  return burst.active;
}

// Cooldown release tracking per hour
const hourKey = () => `cooldown_attempts:${dayjs().utc().format("YYYY-MM-DD:HH")}`;

export async function quotaGate({ redis, pool }, limits) {
  const d = dayjs().utc().format("YYYY-MM-DD");
  const base = limits.MAX_DAILY_ARTICLES;
  const eff = burst.active ? Math.ceil(base * (1 + limits.BURST_PERCENT / 100)) : base;

  const current = await getDailyCounter(redis, "articles", d);
  const gnews = await getDailyCounter(redis, "gnews", d);

  const nearCap = current >= Math.floor(base * limits.QUOTA_WARN_PCT);
  const atCooldown = current >= Math.floor(base * limits.COOLDOWN_AT_PCT);
  let canFetch = current < eff;

  if (atCooldown && canFetch) {
    const remaining = eff - current;
    const hoursLeft = Math.max(1, 24 - Number(dayjs().utc().format("H")));
    const releasePerHour = Math.ceil(remaining / hoursLeft);
    const attempts = Number((await redis.get(hourKey())) || 0);
    if (attempts >= releasePerHour) canFetch = false;
  }

  gauges.dailyQuota.set(eff);
  gauges.gnewsQuota.set(limits.GNEWS_MAX_DAILY);

  const canUseGnews = gnews < limits.GNEWS_MAX_DAILY;
  return { canFetch, nearCap, canUseGnews, effectiveArticleQuota: eff };
}

export async function recordArticleIngest({ redis, pool }, { source }, limits) {
  await incDailyCounter(redis, pool, "articles");
  if (source === "gnews") await incDailyCounter(redis, pool, "gnews");
  // simplistic hourly cost signals
  gauges.costSummaryINR.set(limits.COST_SUMMARY_INR);
  gauges.costTransINR.set(limits.COST_TRANSLATION_INR);
  await redis.incr(hourKey());
}

export function overrideAction(reason = "manual") {
  counters.overrides.inc({ reason });
}