export const tMarket = {
  hi: {
    title: 'शेयर बाजार',
    bse: 'बीएसई सेंसेक्स',
    nse: 'एनएसई निफ्टी',
    usdInr: 'यूएसडी / भारतीय रुपया',
    verified: 'लाइव सत्यापित',
    lastUpdated: (m:number)=> `${m} मिनट पहले`
  },
  en: {
    title: 'Share Market',
    bse: 'BSE Sensex',
    nse: 'NSE Nifty',
    usdInr: 'USD / INR',
    verified: 'Live Verified',
    lastUpdated: (m:number)=> `${m}m ago`
  }
} as const

export type MarketLocale = keyof typeof tMarket

