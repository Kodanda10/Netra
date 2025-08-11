
import 'dotenv/config';

const MAX_DAILY_ARTICLES = parseInt(process.env.AMOGH_MAX_DAILY_ARTICLES || '100', 10);
const COST_SUMMARY_INR = parseFloat(process.env.AMOGH_COST_SUMMARY_INR || '0.17');
const COST_TRANSLATION_INR = parseFloat(process.env.AMOGH_COST_TRANSLATION_INR || '0.35');
const EXPECTED_TRANSLATION_RATIO = parseFloat(process.env.AMOGH_EXPECTED_TRANSLATION_RATIO || '1.0');
const CI_DAILY_SPEND_LIMIT_INR = parseFloat(process.env.AMOGH_CI_DAILY_SPEND_LIMIT_INR || '55');

const projectedSummaryCost = MAX_DAILY_ARTICLES * COST_SUMMARY_INR;
const projectedTranslationCost = MAX_DAILY_ARTICLES * EXPECTED_TRANSLATION_RATIO * COST_TRANSLATION_INR;
const projectedTotalCost = projectedSummaryCost + projectedTranslationCost;

console.log(`Projected daily spend: ₹${projectedTotalCost.toFixed(2)}`);

if (projectedTotalCost > CI_DAILY_SPEND_LIMIT_INR) {
  console.error(`Projected daily spend exceeds the limit of ₹${CI_DAILY_SPEND_LIMIT_INR}`);
  process.exit(2);
}
