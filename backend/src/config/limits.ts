type Env = Partial<Record<string, string>>;

export function limitsFromEnv(env: Env = process.env) {
  const num = (v: any, def: number) =>
    (v === undefined || v === null || v === '') ? def : Number(v);

  return {
    MAX_DAILY_ARTICLES: num(env.MAX_DAILY_ARTICLES, 100),
    GNEWS_MAX_DAILY:    num(env.GNEWS_MAX_DAILY, 50),
    GNEWS_BURST_BONUS:  num(env.GNEWS_BURST_BONUS, 0.2), // 20%
    AMOGH_MAX_SUMMARY_CHARS: num(env.AMOGH_MAX_SUMMARY_CHARS, 400),
  };
}

const limits = limitsFromEnv();
export default limits;