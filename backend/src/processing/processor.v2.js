const { factCheck } = require('./fact-checker');
const { summarize } = require('./summarizer');
const { translate } = require('./translator');

const processArticleV2 = async (article) => {
  console.log(`Processing article: ${article.title}`);
  let processedArticle = article;
  processedArticle = await factCheck(processedArticle);
  processedArticle = await summarize(processedArticle);
  processedArticle = await translate(processedArticle);
  return processedArticle;
};

const processItemsV2 = async (items) => {
  const processed = [];
  for (const item of items) {
    const result = await processArticleV2(item);
    if (result) {
      processed.push(result);
    }
  }
  return processed;
};

module.exports = { processItemsV2 };
