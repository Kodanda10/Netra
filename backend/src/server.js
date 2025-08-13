require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const pino = require('pino');
const { register } = require('./cost/metrics');
const { ingestCycle } = require('./ingestion/fetcher');
const { evaluateBurstAuto } = require('./cost/enforcer');
const { sequelize, NewsArticle, User } = require('./ssot/schema');
const { startConsumer } = require('./queue/consumer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const { logAuditEvent } = require('./utils/auditLogger');

const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
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

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json()); // Middleware to parse JSON request bodies

// Middleware for logging requests
app.use((req, res, next) => {
  logger.info({ req: { method: req.method, url: req.url } }, 'Incoming request');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Route for stock data
app.get('/stocks', authenticateToken, (req, res) => {
  // Dummy stock data for now
  const dummyStocks = [
    { symbol: 'TCS', price: 3500, change: +50, exchange: 'NSE' },
    { symbol: 'RELIANCE', price: 2500, change: -20, exchange: 'BSE' },
    { symbol: 'INFY', price: 1500, change: +10, exchange: 'NSE' },
  ];
  res.status(200).json(dummyStocks);
});

// Route for historical news data
app.get('/news/history', async (req, res) => {
  const { date, state } = req.query;
  // Dummy historical news data for now
  const dummyHistoricalNews = [
    { title: 'Dummy Historical News 1', summary: 'Summary 1', publicationDate: '2025-08-12', state: 'National' },
    { title: 'Dummy Historical News 2', summary: 'Summary 2', publicationDate: '2025-08-11', state: 'Maharashtra' },
  ];
  res.status(200).json(dummyHistoricalNews);
});

// Route for AI summarization
app.post('/ai/summarize', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required for summarization.' });
  }
  // Dummy summarization for now
  const summarizedText = `Summary of: "${text.substring(0, 50)}..."`;
  res.status(200).json({ summary: summarizedText });
});

// Route for AI translation
app.post('/ai/translate', (req, res) => {
  const { text, targetLanguage } = req.body;
  if (!text || !targetLanguage) {
    return res.status(400).json({ error: 'Text and targetLanguage are required for translation.' });
  }
  // Dummy translation for now
  const translatedText = `Translated "${text.substring(0, 50)}..." to ${targetLanguage}`; 
  res.status(200).json({ translation: translatedText });
});

// Route for FDI data
app.get('/fdi', authenticateToken, (req, res) => {
  // Dummy FDI data for now
  const dummyFdiData = {
    totalFDI: 'USD 80 Billion',
    imports: 'USD 600 Billion',
    exports: 'USD 450 Billion',
    trends: [ { year: 2022, value: 70 }, { year: 2023, value: 75 }, { year: 2024, value: 80 } ]
  };
  res.status(200).json(dummyFdiData);
});

// Route for Social Media data
app.get('/social', authenticateToken, (req, res) => {
  // Dummy Social Media data for now
  const dummySocialData = {
    platform: 'X',
    followers: 150000,
    engagementRate: 0.05,
    latestPost: { text: 'Market update is live!', likes: 1200, shares: 300 },
    sentiment: 'positive',
  };
  res.status(200).json(dummySocialData);
});

// User registration endpoint
app.post('/register', authenticateToken, authorizeRoles(['admin']), async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role });
    logAuditEvent('user_registered', user.id, { username: user.username, role: user.role });
    res.status(201).json({ message: 'User registered successfully.', userId: user.id });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    logger.error('Error during user registration:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// User login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'supersecretjwtkey',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Logged in successfully.', token });
  } catch (error) {
    logger.error('Error during user login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Cron job for hourly ingestion
// Runs every hour
cron.schedule('0 * * * *', async () => {
  logger.info('Running hourly ingestion cycle...');
  // TODO: Get VIX and semanticSpike via provider stub
  const vix = 17; // Placeholder
  const semanticSpike = false; // Placeholder
  evaluateBurstAuto(vix, semanticSpike);
  await ingestCycle();
  logger.info('Hourly ingestion cycle completed.');
});

// Initialize database and start server
const startServer = async () => {
  try {
    await sequelize.sync({ force: false }); // Do not force sync here, worker handles it
    logger.info('Database synchronized for server.');
    logger.info('Attempting to connect to database...'); // Log database connection attempt
    startConsumer(); // Start the RabbitMQ consumer
    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
