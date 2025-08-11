
import 'dotenv/config';

export const MAX_DAILY_ARTICLES = parseInt(process.env.AMOGH_MAX_DAILY_ARTICLES || '100', 10);
export const GNEWS_MAX_DAILY = parseInt(process.env.AMOGH_GNEWS_MAX_DAILY || '50', 10);
export const MAX_SUMMARY_CHARS = parseInt(process.env.AMOGH_MAX_SUMMARY_CHARS || '200', 10);
export const BURST_PERCENT = parseInt(process.env.AMOGH_BURST_PERCENT || '20', 10);
export const QUOTA_WARN_PCT = parseFloat(process.env.AMOGH_QUOTA_WARN_PCT || '0.8');
export const COOLDOWN_AT_PCT = parseFloat(process.env.AMOGH_COOLDOWN_AT_PCT || '0.9');
export const VIX_THRESHOLD = parseInt(process.env.AMOGH_VIX_THRESHOLD || '18', 10);
export const COST_SUMMARY_INR = parseFloat(process.env.AMOGH_COST_SUMMARY_INR || '0.17');
export const COST_TRANSLATION_INR = parseFloat(process.env.AMOGH_COST_TRANSLATION_INR || '0.35');
