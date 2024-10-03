const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize (process.env.DATABASE_URL,{ 
    dialect: 'postgresql', 
    logging:false 
});

const db ={}; 
db.sequelize = sequelize; 
db.Sequelize = Sequelize; 

db.User = require('./user')(sequelize,Sequelize); 
db.Product = require('./product')(sequelize,Sequelize);
db.Order = require('./order')(sequelize,Sequelize);
// Sync models
(async () => {
  try {
    // Sync all models
    await sequelize.sync();
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error syncing models:", error);
  }
})();
// Sync models

module.exports = db; 
