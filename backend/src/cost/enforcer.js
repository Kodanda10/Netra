const { AMOGH_MAX_DAILY_ARTICLES, AMOGH_GNEWS_MAX_DAILY, AMOGH_BURST_PERCENT, AMOGH_QUOTA_WARN_PCT, AMOGH_COOLDOWN_AT_PCT, AMOGH_VIX_THRESHOLD, AMOGH_COST_SUMMARY_INR, AMOGH_COST_TRANSLATION_INR } = require('./limits');
const { getCounter, incrementCounter } = require('./counters');
const { amogh_daily_article_count, amogh_daily_article_quota, amogh_gnews_daily_count, amogh_gnews_daily_quota, amogh_article_cost_inr_hourly, amogh_translation_cost_inr_hourly, amogh_burst_mode_active, amogh_override_events_total, amogh_source_items_today } = require('./metrics');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

let burstModeActive = 0; // 0 for inactive, 1 for active
let burstModeExpiry = null;

const setBurstActive = (active, ttlMinutes = 120) => {
  burstModeActive = active ? 1 : 0;
  amogh_burst_mode_active.set(active ? 1 : 0);
  if (active) {
    burstModeExpiry = dayjs().utc().add(ttlMinutes, 'minute');
  } else {
    burstModeExpiry = null;
  }
};

const evaluateBurstAuto = (vix, semanticSpike) => {
  if (vix >= AMOGH_VIX_THRESHOLD || semanticSpike) {
    if (!burstModeActive) {
      setBurstActive(true);
      // Log burst activation
    }
  } else if (burstModeActive && dayjs().utc().isAfter(burstModeExpiry)) {
    setBurstActive(false);
    // Log burst deactivation
  }
};

const quotaGate = async () => {
  const dailyArticleCount = await getCounter('articles');
  const gnewsDailyCount = await getCounter('gnews');

  const effectiveMaxDailyArticles = burstModeActive
    ? Math.ceil(AMOGH_MAX_DAILY_ARTICLES * (1 + AMOGH_BURST_PERCENT / 100))
    : AMOGH_MAX_DAILY_ARTICLES;

  amogh_daily_article_count.set(dailyArticleCount);
  amogh_daily_article_quota.set(effectiveMaxDailyArticles);
  amogh_gnews_daily_count.set(gnewsDailyCount);
  amogh_gnews_daily_quota.set(AMOGH_GNEWS_MAX_DAILY);

  const canFetch = dailyArticleCount < effectiveMaxDailyArticles;
  const nearCap = dailyArticleCount >= effectiveMaxDailyArticles * AMOGH_QUOTA_WARN_PCT;
  const canUseGnews = gnewsDailyCount < AMOGH_GNEWS_MAX_DAILY;

  // Cooldown logic
  let attemptsThisHour = await getCounter(`cooldown_attempts:${dayjs().utc().format('YYYY-MM-DD-HH')}`);
  const hoursLeft = Math.max(1, 24 - dayjs().utc().hour());
  const remainingQuota = effectiveMaxDailyArticles - dailyArticleCount;
  const releasePerHour = Math.ceil(remainingQuota / hoursLeft);

  let canFetchDueToCooldown = true;
  if (dailyArticleCount >= effectiveMaxDailyArticles * AMOGH_COOLDOWN_AT_PCT) {
    if (attemptsThisHour >= releasePerHour) {
      canFetchDueToCooldown = false;
    }
  }

  return {
    canFetch: canFetch && canFetchDueToCooldown,
    nearCap,
    canUseGnews,
    effectiveArticleQuota: effectiveMaxDailyArticles,
  };
};

const recordArticleIngest = async (source) => {
  await incrementCounter('articles');
  amogh_daily_article_count.inc();
  amogh_source_items_today.labels({ namespace: 'default', service: 'ingestion', source }).inc();

  if (source === 'gnews') {
    await incrementCounter('gnews');
    amogh_gnews_daily_count.inc();
  }

  // Update hourly cost gauges (simplified for now, actual cost calculation would be more complex)
  amogh_article_cost_inr_hourly.set(AMOGH_COST_SUMMARY_INR); // Example: cost per article for summary
  amogh_translation_cost_inr_hourly.set(AMOGH_COST_TRANSLATION_INR); // Example: cost per article for translation
};

const overrideAction = async (reason) => {
  amogh_override_events_total.labels({ namespace: 'default', service: 'ingestion', reason }).inc();
};

module.exports = {
  setBurstActive,
  evaluateBurstAuto,
  quotaGate,
  recordArticleIngest,
  overrideAction,
};
