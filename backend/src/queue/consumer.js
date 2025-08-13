const amqp = require('amqplib');
const winston = require('winston');
const { NewsArticle } = require('../ssot/schema'); // Import NewsArticle model

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

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = 'news_articles';

const startConsumer = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    logger.info('RabbitMQ consumer started. Waiting for messages...');

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          const articleData = JSON.parse(msg.content.toString());
          logger.info(`Received message: ${articleData.title}`);

          // Persist the article to the database
          await NewsArticle.upsert(articleData); // Use upsert to insert or update
          logger.info(`Article "${articleData.title}" saved to database.`);

          channel.ack(msg); // Acknowledge the message
        } catch (error) {
          logger.error('Error processing message:', error);
          channel.reject(msg, false); // Reject the message, do not requeue
        }
      }
    }, {
      noAck: false // Ensure messages are acknowledged
    });

  } catch (error) {
    logger.error('Failed to start RabbitMQ consumer:', error);
    process.exit(1); // Exit if consumer cannot start
  }
};

module.exports = {
  startConsumer,
};