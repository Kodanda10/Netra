const env = process.env;
const n = (k, d) => (env[k] ? Number(env[k]) : d);

const MAX = n("AMOGH_MAX_DAILY_ARTICLES", 100);
const COST_SUM = n("AMOGH_COST_SUMMARY_INR", 0.17);
const COST_TR = n("AMOGH_COST_TRANSLATION_INR", 0.35);
const RATIO = n("AMOGH_EXPECTED_TRANSLATION_RATIO", 1.0);
const LIMIT = n("AMOGH_CI_DAILY_SPEND_LIMIT_INR", 55);

const proj = MAX * (COST_SUM + RATIO * COST_TR);
console.log(JSON.stringify({ projectedINR: proj, limit: LIMIT }, null, 2));
if (proj > LIMIT) {
  console.error("Projected daily spend exceeds limit.");
  process.exit(2);
}