import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const basename = path.basename(__filename);
const db = {
  // StateVariable: null,
  // User: null,
  // List: null,
  // UserList: null,
  // Campaign: null,
  // CampaignUser: null,
  // FollowersJob: null,
  // CampaignJobHistory: null
};
export const initDB = (sqliteLocation) => {
  const sequelize = new Sequelize({
    "dialect": "sqlite",
    "storage": sqliteLocation,
    logging: false
  });

  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      const model = sequelize['import'](path.join(__dirname, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
}
export default db;
