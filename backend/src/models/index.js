import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import config from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const db = {};

let sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, config.database);

const files = fs
  .readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0 && 
    file !== basename && 
    file.slice(-3) === '.js'
  ));

for (const file of files) {
  const { default: modelInit } = await import(path.join(__dirname, file));
  const model = modelInit(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;