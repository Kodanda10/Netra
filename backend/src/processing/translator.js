const translate = async (article) => {
  console.log(`Translating article: ${article.title}`);
  // Mock implementation
  return {
    ...article,
    translatedTitle: `यह लेख का शीर्षक है: ${article.title}`,
    translatedSummary: `यह लेख का सारांश है: ${article.summary}`,
  };
};

module.exports = { translate };
