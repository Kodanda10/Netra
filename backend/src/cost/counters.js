
import Redis from 'ioredis';

// Stub for Postgres connection pool
const pool = {
  query: () => Promise.resolve(),
};

const redis = new Redis();

async function getRedisCount(key) {
  const today = new Date().toISOString().split('T')[0];
  return parseInt(await redis.get(`${key}:${today}`) || '0', 10);
}

async function incrementRedisCount(key) {
  const today = new Date().toISOString().split('T')[0];
  return redis.incr(`${key}:${today}`);
}

async function snapshotToPostgres(key, value) {
  const today = new Date().toISOString().split('T')[0];
  const query = `
    INSERT INTO daily_counters (day, key, value)
    VALUES ($1, $2, $3)
    ON CONFLICT (day, key)
    DO UPDATE SET value = $3;
  `;
  await pool.query(query, [today, key, value]);
}

export async function getArticleCount() {
  return getRedisCount('articles');
}

export async function getGnewsCount() {
  return getRedisCount('gnews');
}

export async function incrementArticleCount() {
  const count = await incrementRedisCount('articles');
  await snapshotToPostgres('articles', count);
  return count;
}

export async function incrementGnewsCount() {
  const count = await incrementRedisCount('gnews');
  await snapshotToPostgres('gnews', count);
  return count;
}
