require('dotenv').config();
const Redis = require('ioredis');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const { DailyCounter, sequelize } = require('../ssot/schema');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

redis.on('error', (err) => logger.error('Redis Client Error', err));

const getTodayKey = (key) => {
  return `${key}:${dayjs().utc().format('YYYY-MM-DD')}`;
};

const incrementCounter = async (key, value = 1) => {
  const redisKey = getTodayKey(key);
  const newValue = await redis.incrby(redisKey, value);
  // Set expiry for Redis key to ensure it's cleaned up after a day
  await redis.expireat(redisKey, dayjs().utc().endOf('day').unix());
  return newValue;
};

const getCounter = async (key) => {
  const redisKey = getTodayKey(key);
  const value = await redis.get(redisKey);
  return parseInt(value || '0', 10);
};

const snapshotCountersToPostgres = async () => {
  const today = dayjs().utc().format('YYYY-MM-DD');
  const keysToSnapshot = ['articles', 'gnews']; // Add other keys as needed

  for (const key of keysToSnapshot) {
    const redisKey = getTodayKey(key);
    const value = await redis.get(redisKey);
    if (value !== null) {
      await DailyCounter.upsert({
        day: today,
        key: key,
        value: parseInt(value, 10),
      });
      logger.info(`Snapshotting counter ${key} for ${today}: ${value}`);
    }
  }
};

// Schedule daily snapshot (e.g., at 23:59 UTC)
// In a real app, this would be a cron job or similar external scheduler
// For now, we'll just export the function to be called manually or by another module

module.exports = {
  incrementCounter,
  getCounter,
  snapshotCountersToPostgres,
  redis, // Export redis client for direct use if needed
};
