const summarize = async (article) => {
  console.log(`Summarizing article: ${article.title}`);
  // Mock implementation
  return {
    ...article,
    summary: `This is a summary of the article: ${article.title}`,
  };
};

module.exports = { summarize };
