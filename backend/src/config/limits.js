export function limitsFromEnv(env = (typeof process !== 'undefined' ? process.env : {})) {
  const num = (v, d) => (v === undefined || v === null || v === '' ? d : Number(v));
  return {
    MAX_DAILY_ARTICLES:      num(env.MAX_DAILY_ARTICLES, 100),
    GNEWS_MAX_DAILY:         num(env.GNEWS_MAX_DAILY, 50),
    GNEWS_BURST_BONUS:       num(env.GNEWS_BURST_BONUS, 0.2),
    AMOGH_MAX_SUMMARY_CHARS: num(env.AMOGH_MAX_SUMMARY_CHARS, 400),
  };
}
const limits = limitsFromEnv();
export default limits;