import limits from '../config/limits.js';

export async function getGate(_redis) {
  // Minimal defaults good enough for fetcher tests
  return {
    canFetch: true,
    canUseGnews: true,
    effectiveArticleQuota: limits.MAX_DAILY_ARTICLES,
  };
}

export default { getGate };