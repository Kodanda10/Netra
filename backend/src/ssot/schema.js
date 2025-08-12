import { Sequelize, DataTypes } from 'sequelize';
import 'dotenv/config'; // make sure dotenv is installed and loaded

const sequelize = process.env.PG_URL
  ? new Sequelize(process.env.PG_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: { ssl: false },
    })
  : new Sequelize(
      process.env.PG_DATABASE || 'amogh',
      process.env.PG_USER || 'abhijita',
      process.env.PG_PASSWORD || '',
      {
        host: process.env.PG_HOST || 'localhost',
        port: Number(process.env.PG_PORT) || 5432,
        dialect: 'postgres',
        logging: false,
        dialectOptions: { ssl: false },
      }
    );

// example model
export const Item = sequelize.define('Item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'items', timestamps: true });

const NewsArticle = sequelize.define('NewsArticle', {
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
  published_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default sequelize;
export { NewsArticle };