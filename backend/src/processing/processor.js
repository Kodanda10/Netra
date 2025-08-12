require('dotenv').config();
const axios = require('axios');
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
const NLP_CLOUD_API_URL = 'https://api.nlpcloud.io/v1/bart-large-cnn/summarization'; // Using BART Large CNN for summarization

const translateText = async (text, targetLanguage = 'hi') => {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    logger.warn('GOOGLE_TRANSLATE_API_KEY is not set. Skipping translation.');
    return text; // Return original text if API key is not set
  }
  try {
    const response = await axios.post(GOOGLE_TRANSLATE_API_URL, {
      q: text,
      target: targetLanguage,
      format: 'text',
    }, {
      params: {
        key: GOOGLE_TRANSLATE_API_KEY,
      },
    });
    return response.data.data.translations[0].translatedText;
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
    return response.data.summary;
  } catch (error) {
    logger.error('Error summarizing text:', error.response ? error.response.data : error.message);
    return text; // Return original text on error
  }
};

const processItems = async (items) => {
  const processed = [];
  for (const item of items) {
    const translatedTitle = await translateText(item.title);
    const translatedSummary = await translateText(item.summary);
    const summarizedContent = await summarizeText(item.content || item.summary); // Summarize content or summary

    processed.push({
      ...item,
      translatedTitle,
      translatedSummary,
      summarizedContent,
    });
  }
  return processed;
};

module.exports = processItems;
