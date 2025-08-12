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

const keyFor = (k, d) => `${k}:${d}`;

export async function incDailyCounter(redis, pool, key, by = 1, d = dayjs().utc().format("YYYY-MM-DD")) {
  const rkey = keyFor(key, d);
  await redis.incrby(rkey, by);
  const val = Number(await redis.get(rkey));
  await pool.query(`
    INSERT INTO daily_counters(day,key,value) VALUES($1,$2,$3)
    ON CONFLICT (day,key) DO UPDATE SET value=EXCLUDED.value
  `, [d, key, val]);
  return val;
}

export async function getDailyCounter(redis, key, d = dayjs().utc().format("YYYY-MM-DD")) {
  const val = await redis.get(keyFor(key, d));
  return Number(val || 0);
}