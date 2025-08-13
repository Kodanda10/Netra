import 'dotenv/config';

const AMOGH_MAX_DAILY_ARTICLES = parseInt(process.env.AMOGH_MAX_DAILY_ARTICLES || '100', 10);
const AMOGH_COST_SUMMARY_INR = parseFloat(process.env.AMOGH_COST_SUMMARY_INR || '0.17');
const AMOGH_COST_TRANSLATION_INR = parseFloat(process.env.AMOGH_COST_TRANSLATION_INR || '0.35');
const AMOGH_EXPECTED_TRANSLATION_RATIO = parseFloat(process.env.AMOGH_EXPECTED_TRANSLATION_RATIO || '1.0');
const AMOGH_CI_DAILY_SPEND_LIMIT_INR = parseFloat(process.env.AMOGH_CI_DAILY_SPEND_LIMIT_INR || '55');

const projectedSummaryCost = AMOGH_MAX_DAILY_ARTICLES * AMOGH_COST_SUMMARY_INR;
const projectedTranslationCost = AMOGH_MAX_DAILY_ARTICLES * AMOGH_COST_TRANSLATION_INR * AMOGH_EXPECTED_TRANSLATION_RATIO;

const totalProjectedSpend = projectedSummaryCost + projectedTranslationCost;

console.log(`Projected Daily Spend: ₹${totalProjectedSpend.toFixed(2)}`);
console.log(`CI Daily Spend Limit: ₹${AMOGH_CI_DAILY_SPEND_LIMIT_INR.toFixed(2)}`);

if (totalProjectedSpend > AMOGH_CI_DAILY_SPEND_LIMIT_INR) {
  console.error('ERROR: Projected daily spend exceeds CI limit!');
  process.exit(2);
} else {
  console.log('Projected daily spend is within limits.');
  process.exit(0);
}
