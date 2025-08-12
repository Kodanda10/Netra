import { vi } from 'vitest';

// Minimal in-memory Redis fake
class FakeRedis {
  store = new Map<string, string>();
  async flushall() { this.store.clear(); }
  async keys(pattern='*') { return [...this.store.keys()]; }
  async del(keys: string[] | string) {
    const arr = Array.isArray(keys) ? keys : [keys];
    for (const k of arr) this.store.delete(k);
  }
  async get(k: string) { return this.store.has(k) ? this.store.get(k)! : null; }
  async set(k: string, v: string) { this.store.set(k, v); return 'OK'; }
  async incrby(k: string, n: number) {
    const v = parseInt(this.store.get(k) ?? '0', 10) + n;
    this.store.set(k, String(v)); return v;
  }
}

vi.mock('../src/stores', () => {
  const redis = new FakeRedis();
  const stores = { redis };
  return { __esModule: true, default: stores, stores };
});