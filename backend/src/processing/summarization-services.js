const grokSummarize = async (article) => {
  console.log(`Summarizing with Grok: ${article.title}`);
  // Mock implementation
  return {
    ...article,
    summary: `[Grok] This is a summary of the article: ${article.title}`,
  };
};

const openaiSummarize = async (article) => {
  console.log(`Summarizing with OpenAI: ${article.title}`);
  // Mock implementation
  return {
    ...article,
    summary: `[OpenAI] This is a summary of the article: ${article.title}`,
  };
};

const geminiSummarize = async (article) => {
  console.log(`Summarizing with Gemini: ${article.title}`);
  // Mock implementation
  return {
    ...article,
    summary: `[Gemini] This is a summary of the article: ${article.title}`,
  };
};

module.exports = { grokSummarize, openaiSummarize, geminiSummarize };
