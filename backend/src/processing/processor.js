import crypto from "node:crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

// naive in-memory caches for demo/testing
export const translationCache = new Map();

const FINANCE_POS = ["RBI", "FDI", "investment", "market", "NSE", "BSE", "SEBI", "rupee", "inflation", "policy"];
const CIVIC_NEG = ["crime", "rape", "murder", "theft", "court", "judgement", "accident"];

function score(text, terms) {
  const lc = text.toLowerCase();
  return terms.reduce((s, t) => s + (lc.includes(t.toLowerCase()) ? 1 : 0), 0);
}

function isTodayISO(iso) {
  if (!iso) return false;
  const d = dayjs(iso).utc();
  const today = dayjs().utc();
  return d.isSame(today, "day");
}

function hashKey(title, url) {
  return crypto.createHash("sha256").update(`${title}|${url}`).digest("hex");
}

export async function processorFactory(limits) {
  const seenHashes = new Set();
  return async function process(item) {
    // Date filter
    if (!isTodayISO(item.publishedAt)) return null;
    // Relevance filter
    const pos = score(item.title, FINANCE_POS);
    const neg = score(item.title, CIVIC_NEG);
    if (pos < 2 || neg > 0) return null;

    // Dedup
    const key = hashKey(item.title || "", item.url || "");
    if (seenHashes.has(key)) return null;
    seenHashes.add(key);

    // Categorize (very simple heuristic)
    const isState = /\b(UP|Delhi|Maharashtra|Chhattisgarh|Odisha|Bengal|Tamil Nadu)\b/i.test(item.title);
    const category = isState ? "state" : "all-india";
    const confidence = isState ? 0.9 : 0.8;

    // Summarize (placeholder clamp) then translate; cache by hash
    const summaryEn = (item.title || "").slice(0, limits.MAX_SUMMARY_CHARS);
    let textHi = translationCache.get(key);
    let cached = true;
    if (!textHi) {
      // Your translator here; we simulate
      textHi = `हिंदी: ${summaryEn}`;
      translationCache.set(key, textHi);
      cached = false;
    }

    // Fact-check stub
    const factScore = 0.9;

    return {
      ...item,
      category,
      confidence,
      summaryEn,
      summaryHi: textHi,
      translationCached: cached,
      factScore
    };
  };
}