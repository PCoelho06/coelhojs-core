const { Sequelize, DataTypes } = require("sequelize");
// const { Config } = require(process.cwd() +
//   "/node_modules/coelhojsframework/lib/Config.js");
const { Config } = require("./Config.js");

logging = Config.db.sequelize.options.logging === "true" ? true : false;

const sequelize = new Sequelize(
  Config.db.sequelize.database,
  Config.db.sequelize.username,
  Config.db.sequelize.password,
  {
    host: Config.db.sequelize.options.host,
    dialect: Config.db.sequelize.options.dialect,
    logging: logging,
  }
);

module.exports = { sequelize, DataTypes };
