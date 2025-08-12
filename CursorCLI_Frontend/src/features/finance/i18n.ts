export const t = {
  hi: {
    titleBharat: "भारत 🇮🇳",
    filters: { finance: "वित्त", industry: "उद्योग", investment: "निवेश", policy: "नीति" },
    viewAllSources: "सभी स्रोत",
    more: "और देखें",
    updated: (m: number) => `${m} मिनट पूर्व अपडेटेड`,
  },
  en: {
    titleBharat: "Bharat 🇮🇳",
    filters: { finance: "Finance", industry: "Industry", investment: "Investment", policy: "Policy" },
    viewAllSources: "View All Sources",
    more: "More",
    updated: (m: number) => `Updated ${m}m ago`,
  },
} as const;

export type Dict = typeof t;

