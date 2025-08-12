import Redis from "ioredis";
import { Pool } from "pg";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

export function makeStores() {
  if (process.env.NODE_ENV === 'test') {
    const redisStore = new Map();
    const redis = {
      get: (key) => redisStore.get(key),
      incrby: (key, by) => {
        const value = (redisStore.get(key) || 0) + by;
        redisStore.set(key, value);
        return value;
      }
    };
    const pool = { query: () => Promise.resolve({ rows: [] }) };
    return { redis, pool };
  }
  const redis = new Redis(process.env.REDIS_URL);
  const pool = new Pool({ connectionString: process.env.PG_URL });
  return { redis, pool };
}

export async function ensureDailyTables(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS daily_counters(
      day date, key text, value bigint,
      PRIMARY KEY(day, key)
    );
  `);
}

const keyFor = (k) => `dc:${dayjs().format('YYYY-MM-DD')}:${k}`;

export async function incDailyCounter(redis, pool, key, by = 1) {
  const rkey = keyFor(key);
  await redis.incrby(rkey, by);
  const val = Number(await redis.get(rkey));
  if (typeof pool?.query === 'function') {
    await pool.query(`
      INSERT INTO daily_counters(day,key,value) VALUES($1,$2,$3)
      ON CONFLICT (day,key) DO UPDATE SET value=EXCLUDED.value
    `, [dayjs().format('YYYY-MM-DD'), key, val]);
  }
}

// ✅ add this:
export async function getDailyCounter(redis, key) {
  const rkey = keyFor(key);
  const v = await redis.get(rkey);
  return Number(v) || 0;
}