import { incDailyCounter, getDailyCounter } from "./src/cost/counters.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(utc);

// Mock Redis
const mockRedisStore = new Map();
const mockRedis = {
  incrby: (key, by) => {
    const val = (Number(mockRedisStore.get(key) || 0) + by).toString();
    mockRedisStore.set(key, val);
    return Promise.resolve(val);
  },
  get: key => Promise.resolve(mockRedisStore.get(key)),
  flushall: () => {
    mockRedisStore.clear();
    return Promise.resolve("OK");
  },
};

// Mock Postgres Pool
const mockPgPool = {
  query: () => Promise.resolve(),
};

const stores = {
  redis: mockRedis,
  pool: mockPgPool,
};

async function runTest() {
  await stores.redis.flushall();

  console.log("Initial article count:", await getDailyCounter(stores.redis, "articles"));
  await incDailyCounter(stores.redis, stores.pool, "articles");
  console.log("Article count after increment:", await getDailyCounter(stores.redis, "articles"));

  console.log("Initial gnews count:", await getDailyCounter(stores.redis, "gnews"));
  await incDailyCounter(stores.redis, stores.pool, "gnews");
  console.log("Gnews count after increment:", await getDailyCounter(stores.redis, "gnews"));

  // Test with specific date
  const specificDate = dayjs().utc().subtract(1, "day").format("YYYY-MM-DD");
  await incDailyCounter(stores.redis, stores.pool, "articles", 1, specificDate);
  console.log(`Article count for ${specificDate}:`, await getDailyCounter(stores.redis, "articles", specificDate));
}

runTest();