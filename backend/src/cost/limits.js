require('dotenv').config();

const limits = {
  AMOGH_MAX_DAILY_ARTICLES: parseInt(process.env.AMOGH_MAX_DAILY_ARTICLES || '100', 10),
  AMOGH_GNEWS_MAX_DAILY: parseInt(process.env.AMOGH_GNEWS_MAX_DAILY || '50', 10),
  AMOGH_MAX_SUMMARY_CHARS: parseInt(process.env.AMOGH_MAX_SUMMARY_CHARS || '200', 10),
  AMOGH_BURST_PERCENT: parseInt(process.env.AMOGH_BURST_PERCENT || '20', 10),
  AMOGH_QUOTA_WARN_PCT: parseFloat(process.env.AMOGH_QUOTA_WARN_PCT || '0.8'),
  AMOGH_COOLDOWN_AT_PCT: parseFloat(process.env.AMOGH_COOLDOWN_AT_PCT || '0.9'),
  AMOGH_VIX_THRESHOLD: parseFloat(process.env.AMOGH_VIX_THRESHOLD || '18'),
  AMOGH_COST_SUMMARY_INR: parseFloat(process.env.AMOGH_COST_SUMMARY_INR || '0.17'),
  AMOGH_COST_TRANSLATION_INR: parseFloat(process.env.AMOGH_COST_TRANSLATION_INR || '0.35'),
  AMOGH_CI_DAILY_SPEND_LIMIT_INR: parseFloat(process.env.AMOGH_CI_DAILY_SPEND_LIMIT_INR || '55'),
  AMOGH_EXPECTED_TRANSLATION_RATIO: parseFloat(process.env.AMOGH_EXPECTED_TRANSLATION_RATIO || '1.0'),
};

module.exports = limits;
