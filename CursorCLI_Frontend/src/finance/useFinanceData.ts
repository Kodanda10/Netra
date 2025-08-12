import useSWR from 'swr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching data.');
    // Attach extra info to the error object.
    // error.info = await res.json();
    // error.status = res.status;
    throw error;
  }
  return res.json();
};

export function useFinanceData(scope: 'bharat' | 'state', stateId?: string, lang: 'hi' | 'en' = 'en') {
  const url = API_BASE_URL ? `${API_BASE_URL}/news?scope=${scope}&stateId=${stateId || ''}&lang=${lang}` : null;
  const { data, error, isLoading } = useSWR(url, fetcher);

  if (error) console.error("Error fetching finance data:", error);

  // Adapt the backend response to the frontend format
  const items = Array.isArray(data?.articles) ? data.articles : [
    { id:'b1', title: lang==='hi'?'भारत: बाजार स्थिर रहे':'Bharat: Markets steady', summary: lang==='hi'?'आज के मुख्य वित्तीय समाचार':'Top financial headlines today', url:'#' },
    { id:'b2', title: lang==='hi'?'रुपया हल्का मजबूत':'Rupee slightly stronger', summary: lang==='hi'?'एफएक्स में सीमित उतार-चढ़ाव':'Limited FX volatility', url:'#' },
  ];
  const sourcesOrdered: { source: string; count: number }[] = [];
  for (const it of items) {
    const src = (it as any)?.source;
    if (!src) continue;
    if (!sourcesOrdered.some(s => s.source === src)) {
      sourcesOrdered.push({ source: src, count: items.filter(i => (i as any)?.source === src).length });
    }
  }

  return {
    items,
    sourcesOrdered,
    updatedAt: data?.updatedAt || new Date().toISOString(),
    isLoading,
    error,
  };
}

