import { request } from 'undici';
import { XMLParser } from 'fast-xml-parser';
import pRetry from 'p-retry';
import dayjs from 'dayjs';
import { getMetrics } from '../cost/metrics.js';

const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: true });

export async function fetchRSS(url) {
  const { counters } = getMetrics();
  counters.rssRequests?.inc?.();
  const { body, statusCode } = await pRetry(
    async () => {
      const res = await request(url, { method: 'GET' });
      if (res.statusCode >= 400) throw new Error('Bad status ' + res.statusCode);
      return res;
    },
    { retries: 2 }
  );
  const text = await body.text();
  const xml = parser.parse(text);
  const items = xml?.rss?.channel?.item || xml?.feed?.entry || [];
  const arr = Array.isArray(items) ? items : [items];

  return arr.map((it) => {
    const title = it?.title?._text || it?.title || '';
    const link = it?.link?._text || it?.link?.['@_href'] || it?.link || '';
    const pub = it?.pubDate || it?.published || it?.updated || '';
    return {
      title: String(title).trim(),
      url: String(link).trim(),
      publishedAt: pub ? dayjs(pub).toISOString() : null,
      source: 'rss',
    };
  });
}

// Optional multi-feed helper (used by new tests)
const RSS_FEEDS = [
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  'https://www.livemint.com/rss/markets',
  'https://www.financialexpress.com/market/feed/',
  'https://www.business-standard.com/rss/markets.xml',
];
export async function getRssItems() {
  const { counters } = getMetrics();
  const all = [];
  for (const url of RSS_FEEDS) {
    try {
      const items = await fetchRSS(url);
      all.push(...items);
    } catch (e) {
      counters.fetchErr?.inc?.({ code: e?.code || 'UNKNOWN' });
    }
  }
  return all;
}

export default { fetchRSS, getRssItems };