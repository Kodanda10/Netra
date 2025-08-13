require('dotenv').config();
const axios = require('axios');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const { TranslationCache } = require('../ssot/schema');
const { AMOGH_MAX_SUMMARY_CHARS } = require('../cost/limits');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Google Cloud Translation API configuration
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

// NLP Cloud Summarization API configuration
const NLP_CLOUD_API_KEY = process.env.NLP_CLOUD_API_KEY;
const NLP_CLOUD_API_URL = 'https://api.nlpcloud.io/v1/bart-large-cnn/summarization';

const translateText = async (text, targetLanguage = 'hi') => {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    logger.warn('GOOGLE_TRANSLATE_API_KEY is not set. Skipping translation.');
    return text; // Return original text if API key is not set
  }
  try {
    // Check cache first
    const cacheKey = `translate:${text}:${targetLanguage}`;
    const cached = await TranslationCache.findOne({ where: { hash: cacheKey } });
    if (cached && dayjs().utc().isBefore(cached.expires_at)) {
      logger.info('Returning translated text from cache.');
      return cached.text_hi;
    }

    const response = await axios.post(GOOGLE_TRANSLATE_API_URL, {
      q: text,
      target: targetLanguage,
      format: 'text',
    }, {
      params: {
        key: GOOGLE_TRANSLATE_API_KEY,
      },
    });
    const translatedText = response.data.data.translations[0].translatedText;

    // Store in cache
    await TranslationCache.upsert({
      hash: cacheKey,
      text_hi: translatedText,
      expires_at: dayjs().utc().add(7, 'day').toDate(), // Cache for 7 days
    });

    return translatedText;
  } catch (error) {
    logger.error('Error translating text:', error.response ? error.response.data : error.message);
    return text; // Return original text on error
  }
};

const summarizeText = async (text) => {
  if (!NLP_CLOUD_API_KEY) {
    logger.warn('NLP_CLOUD_API_KEY is not set. Skipping summarization.');
    return text; // Return original text if API key is not set
  }
  try {
    const response = await axios.post(NLP_CLOUD_API_URL, {
      text: text,
    }, {
      headers: {
        'Authorization': `Token ${NLP_CLOUD_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.summary.substring(0, AMOGH_MAX_SUMMARY_CHARS);
  } catch (error) {
    logger.error('Error summarizing text:', error.response ? error.response.data : error.message);
    return text; // Return original text on error
  }
};

const llmGate = (text) => {
  // Stub for LLM-based relevance check
  logger.info(`LLM Gate stub for: ${text}`);
  return true; // Assume relevant for now
};

const factCheck = (text) => {
  // Simulate calls to multiple fact-checking services
  const service1Score = Math.random() * 0.5 + 0.5; // Score between 0.5 and 1.0
  const service2Score = Math.random() * 0.5 + 0.5; // Score between 0.5 and 1.0
  const service3Score = Math.random() * 0.5 + 0.5; // Score between 0.5 and 1.0

  const averageScore = (service1Score + service2Score + service3Score) / 3;
  logger.info(`Fact Check simulated for: ${text.substring(0, 50)}... Average Score: ${averageScore.toFixed(2)}`);
  return averageScore;
};

const sourceValidation = (sourceUrl) => {
  // Layer 1: Source Validation - Cross-check against a whitelist of official media
  // For now, a simple placeholder. In a real scenario, this would involve a database lookup
  // or a comprehensive list of trusted sources.
  const trustedSources = [
    'economictimes.indiatimes.com',
    'livemint.com',
    'financialexpress.com',
    'business-standard.com',
    'gnews.io',
  ];
  const isValid = trustedSources.some(domain => sourceUrl.includes(domain));
  if (!isValid) {
    logger.warn(`Source validation failed for: ${sourceUrl}`);
  }
  return isValid;
};

const processArticle = async (article) => {
  // Layer 1: Source Validation
  if (!sourceValidation(article.source)) {
    logger.info(`Rejecting article (source validation failed): ${article.title}`);
    return null;
  }

  // 1. Date filter: only UTC “today”; future/missing → reject.
  if (!article.publicationDate || !dayjs(article.publicationDate).utc().isSame(dayjs().utc(), 'day')) {
    logger.info(`Rejecting article (date filter): ${article.title}`);
    return null;
  }

  // 2. Relevance: finance keyword score ≥3 and civic score 0; ambiguous → llmGate() stub.
  // Simplified relevance check for now
  const financeKeywords = ['finance', 'stock', 'economy', 'market', 'investment', 'business', 'RBI', 'NSE', 'BSE'];
  const civicKeywords = ['election', 'politics', 'government scheme', 'civic', 'municipal', 'crime'];

  const textToAnalyze = `${article.title} ${article.summary} ${article.content}`.toLowerCase();
  const financeScore = financeKeywords.filter(keyword => textToAnalyze.includes(keyword)).length;
  const civicScore = civicKeywords.filter(keyword => textToAnalyze.includes(keyword)).length;

  if (financeScore < 3 || civicScore > 0) {
    if (!llmGate(textToAnalyze)) {
      logger.info(`Rejecting article (relevance filter): ${article.title}`);
      return null;
    }
  }

  // 3. Dedup: hash (title+url); near-dup via normalized Levenshtein <10%.
  // This is handled in the worker before processing, but adding a placeholder here.
  // For true near-dup, a more complex algorithm and a database check would be needed.
  const articleHash = dayjs(article.publicationDate).utc().format('YYYY-MM-DD') + article.title + article.source;
  logger.info(`Article hash: ${articleHash}`);

  // 4. Categorize: rules for All-India vs State (multi-state % allowed); confidence; <0.7 → manual review queue (stub).
  // Simplified categorization for now
  article.state = 'National'; // Default to National
  // Add logic here to determine state based on content if needed

  // 5. Summarize English → Translate Hindi; cache by hash (in-memory here; SSOT table in prod).
  const summarizedContent = await summarizeText(article.content || article.summary);
  const translatedSummary = await translateText(summarizedContent); // Translate summarized content

  article.summarizedContent = summarizedContent;
  article.translatedSummary = translatedSummary;

  // 6. Fact-check: Google Fact Check Tools stub; pass if score ≥0.8.
  const factCheckScore = factCheck(article.content || article.summary);
  if (factCheckScore < 0.8) {
    logger.info(`Rejecting article (fact-check score too low): ${article.title}`);
    return null;
  }

  return article;
};

const processItems = async (items) => {
  const processed = [];
  for (const item of items) {
    const result = await processArticle(item);
    if (result) {
      processed.push(result);
    }
  }
  return processed;
};

module.exports = processItems;
