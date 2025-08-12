import { useSWR } from 'swr';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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
  const url = `${API_BASE_URL}/news?scope=${scope}&stateId=${stateId || ''}&lang=${lang}`;
  const { data, error, isLoading } = useSWR(url, fetcher);

  if (error) console.error("Error fetching finance data:", error);

  // Adapt the backend response to the frontend format
  const items = data?.articles || [];
  const sourcesOrdered: { source: string; count: number }[] = [];
  for (const it of items) {
    if (!sourcesOrdered.some(s => s.source === it.source)) {
      sourcesOrdered.push({ source: it.source, count: items.filter(i => i.source === it.source).length });
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

