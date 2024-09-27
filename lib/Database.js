const { Sequelize, DataTypes } = require("sequelize");
const { Config } = require("./Config.js");
const { setAssociations } = require(process.cwd() + "/models/associations");
const { getFileNames } = require("./Utils");

const Models = {};

const Database = new Sequelize(
  Config.db.database.name,
  Config.db.database.username,
  Config.db.database.password,
  {
    host: Config.db.database.options.host,
    dialect: Config.db.database.options.dialect,
    logging: Boolean(Config.db.database.options.logging),
  }
);

function loadModels() {
  getFileNames("models").forEach((model) => {
    Models[capitalize(model)] = require(process.cwd() +
      "/models/" +
      model +
      ".model.js");
  });
}

async function initDatabase() {
  try {
    loadModels();
    setAssociations();
    await database.sync();
    console.log("Database initiated and synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

module.exports = { Database, DataTypes, Models, initDatabase };
