require('dotenv').config();
const Queue = require('bull');
const winston = require('winston');
const { NewsArticle, sequelize } = require('../ssot/schema');

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

const newsQueue = new Queue('news processing', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

newsQueue.process(async (job) => {
  const item = job.data;
  try {
    const existingArticle = await NewsArticle.findOne({
      where: {
        title: item.title,
        source: item.source,
      },
    });

    if (existingArticle) {
      // Article exists, update if new publicationDate is newer
      if (new Date(item.publicationDate) > new Date(existingArticle.publicationDate)) {
        await existingArticle.update({
          summary: item.summary,
          content: item.content,
          publicationDate: item.publicationDate,
          translatedTitle: item.translatedTitle,
          translatedSummary: item.translatedSummary,
          summarizedContent: item.summarizedContent,
        });
        logger.info(`Updated existing article: ${item.title}`);
      } else {
        logger.info(`Skipping existing article (older or same date): ${item.title}`);
      }
    } else {
      // Article does not exist, create new
      await NewsArticle.create(item);
      logger.info(`Stored new article: ${item.title}`);
    }
  } catch (error) {
    logger.error(`Error processing news item ${item.title}:`, error);
    throw error; // Re-throw to mark job as failed
  }
});

newsQueue.on('completed', (job) => {
  logger.info(`Job ${job.id} completed for article: ${job.data.title}`);
});

newsQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed for article: ${job.data.title} with error: ${err.message}`);
});

// Initialize database when worker starts
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    logger.info('Database synchronized for news processor.');
  } catch (error) {
    logger.error('Error synchronizing database for news processor:', error);
  }
};

initializeDatabase();

logger.info('News processor worker started.');
