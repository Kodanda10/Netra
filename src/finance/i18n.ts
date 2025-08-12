export const t = {
  hi: {
    bharat: 'भारत',
    filters: { finance: 'वित्त', industry: 'उद्योग', investment: 'निवेश', policy: 'नीति' },
    sources: (n:number)=> `स्रोत (${n})`,
    sourcesLabel: 'स्रोत',
    more: 'और',
  },
  en: {
    bharat: 'Bharat',
    filters: { finance: 'Finance', industry: 'Industry', investment: 'Investment', policy: 'Policy' },
    sources: (n:number)=> `Sources (${n})`,
    sourcesLabel: 'Sources',
    more: 'More',
  }
} as const

export type Locale = keyof typeof t

