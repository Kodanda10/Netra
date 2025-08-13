const { googleFactCheck } = require('./google-fact-check');
const { grokSummarize, openaiSummarize, geminiSummarize } = require('./summarization-services');
const { translate } = require('./translator');

const categorizeArticle = (article) => {
  console.log(`Categorizing article: ${article.title}`);
  // Mock implementation
  const categories = ['Finance', 'Industry', 'FinancePolicy'];
  const cardTypes = ['Bharat Card', 'State Card'];
  return {
    ...article,
    category: categories[Math.floor(Math.random() * categories.length)],
    cardType: cardTypes[Math.floor(Math.random() * cardTypes.length)],
  };
};

const finalChecks = (article) => {
  console.log(`Performing final checks on article: ${article.title}`);
  // Mock implementation
  return {
    ...article,
    contextCheck: 'passed',
    biasCheck: 'passed',
    hallucinationCheck: 'passed',
  };
};

const processArticlePipeline = async (article) => {
  console.log(`Processing article with new pipeline: ${article.title}`);
  let processedArticle = article;

  // Step 1: Fact-Checking
  processedArticle = await googleFactCheck(processedArticle);

  // Step 2: Categorization
  processedArticle = categorizeArticle(processedArticle);

  // Step 3: Summarization with fallback
  try {
    processedArticle = await grokSummarize(processedArticle);
  } catch (error) {
    console.log('Grok summarization failed, trying OpenAI...');
    try {
      processedArticle = await openaiSummarize(processedArticle);
    } catch (error) {
      console.log('OpenAI summarization failed, trying Gemini...');
      processedArticle = await geminiSummarize(processedArticle);
    }
  }

  // Step 4: Translation
  processedArticle = await translate(processedArticle);

  // Step 5: Final Checks
  processedArticle = finalChecks(processedArticle);

  return processedArticle;
};

module.exports = { processArticlePipeline };
