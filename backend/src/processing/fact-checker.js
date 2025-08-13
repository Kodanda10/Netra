const factCheck = async (article) => {
  console.log(`Fact-checking article: ${article.title}`);
  // Mock implementation
  return {
    ...article,
    factCheckScore: Math.random(),
    verifiedLinks: ['https://www.factcheck.org/'],
  };
};

module.exports = { factCheck };
