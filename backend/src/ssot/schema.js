const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false, // Suppress logging
  dialectOptions: {},
});

// Define NewsArticle Model
const NewsArticle = sequelize.define('NewsArticle', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  publicationDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  translatedTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  translatedSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  summarizedContent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Define DailyCounter Model
const DailyCounter = sequelize.define('DailyCounter', {
  day: {
    type: DataTypes.DATEONLY,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
});

// Define TranslationCache Model
const TranslationCache = sequelize.define('TranslationCache', {
  hash: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  text_hi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Define CostLog Model
const CostLog = sequelize.define('CostLog', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  day: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  metric: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value_inr: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
});

module.exports = {
  sequelize,
  NewsArticle,
  DailyCounter,
  TranslationCache,
  CostLog,
  Op, // Export Op for use in queries
};
