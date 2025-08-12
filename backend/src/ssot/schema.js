const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false, // Suppress logging
  dialectOptions: {}
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

// Define other models (StockData, FDIMetric, SocialMetric) as needed
const StockData = sequelize.define('StockData', {
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  change: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  exchange: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const FDIMetric = sequelize.define('FDIMetric', {
  sector: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  growth: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const SocialMetric = sequelize.define('SocialMetric', {
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  sentiment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mentions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = {
  sequelize,
  NewsArticle,
  StockData,
  FDIMetric,
  SocialMetric,
  Op, // Export Op for use in queries
};
