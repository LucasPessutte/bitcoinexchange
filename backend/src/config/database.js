import { Sequelize } from 'sequelize';
import config from './config.js';

const sequelize = new Sequelize(
  config.database.database,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: config.database.logging,
  }
);

export default sequelize;
