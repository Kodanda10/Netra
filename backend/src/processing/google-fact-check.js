const googleFactCheck = async (article) => {
  console.log(`Google Fact-checking article: ${article.title}`);
  // Mock implementation
  return {
    ...article,
    googleFactCheck: {
      score: Math.random(),
      summary: 'This is a mock fact-check summary.',
    },
  };
};

module.exports = { googleFactCheck };
