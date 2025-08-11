
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

// Stubs for external services
const manualReviewQueue = {
  add: () => {},
};
const factCheck = async () => 0.9;

export const translationCache = new Map();

function isTodayUTC(date) {
  if (!date) return false;
  const today = dayjs.utc().startOf('day');
  const articleDate = dayjs.utc(date).startOf('day');
  return today.isSame(articleDate);
}

function relevanceCheck(text) {
  // Simplified relevance check
  const financeKeywords = ['finance', 'investment', 'stocks', 'market', 'economy'];
  const civicKeywords = ['civic', 'election', 'politics'];
  let financeScore = 0;
  let civicScore = 0;
  for (const keyword of financeKeywords) {
    if (text.toLowerCase().includes(keyword)) {
      financeScore++;
    }
  }
  for (const keyword of civicKeywords) {
    if (text.toLowerCase().includes(keyword)) {
      civicScore++;
    }
  }
  return financeScore >= 3 && civicScore === 0;
}

function deduplicate(article, existingArticles) {
  const hash = `${article.title}:${article.url}`;
  if (existingArticles.has(hash)) {
    return true;
  }
  existingArticles.add(hash);
  return false;
}

function categorize(article) {
  // Simplified categorization
  if (article.title.toLowerCase().includes('india')) {
    return { category: 'All-India', confidence: 0.9 };
  }
  return { category: 'State', confidence: 0.8 };
}

async function summarizeAndTranslate(text) {
  const hash = text; // In a real implementation, use a proper hash function
  if (translationCache.has(hash)) {
    return { summary: text.slice(0, 200), translatedSummary: translationCache.get(hash), cached: true };
  }

  const summary = text.slice(0, 200);
  const translatedSummary = `Hindi translation of: ${summary}`;
  translationCache.set(hash, translatedSummary);
  return { summary, translatedSummary, cached: false };
}

export async function processArticle(article, existingArticles) {
  if (!isTodayUTC(article.publishedAt)) {
    return null;
  }

  if (!relevanceCheck(article.title + ' ' + article.description)) {
    return null;
  }

  if (deduplicate(article, existingArticles)) {
    return null;
  }

  const { category, confidence } = categorize(article);
  if (confidence < 0.7) {
    manualReviewQueue.add(article);
    return null;
  }

  const translationResult = await summarizeAndTranslate(article.description || '');

  const factCheckScore = await factCheck();
  if (factCheckScore < 0.8) {
    return null;
  }

  return {
    ...article,
    category,
    summary: translationResult.summary,
    translatedSummary: translationResult.translatedSummary,
    translationCached: translationResult.cached,
    factCheckScore,
  };
}
