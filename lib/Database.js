"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Models = exports.Database = void 0;
exports.initDatabase = initDatabase;
var _sequelize = require("sequelize");
var _Config = require("./Config.js");
var _Utils = require("./Utils.js");
const Models = exports.Models = {};
const Database = exports.Database = new _sequelize.Sequelize(_Config.Config.database.database, _Config.Config.database.username, _Config.Config.database.password, {
  host: _Config.Config.database.options.host,
  dialect: _Config.Config.database.options.dialect,
  logging: Boolean(_Config.Config.database.options.logging)
});
function loadModels() {
  (0, _Utils.getFileNames)("models").forEach(model => {
    Models[(0, _Utils.capitalize)(model)] = require((0, _Utils.getModelPath)(model));
  });
}
const defineAssociations = associations => {
  associations.forEach(([source, target, type, options]) => {
    switch (type) {
      case "OneToOne":
        source.hasOne(target, options);
        target.belongsTo(source, options);
        break;
      case "OneToMany":
        source.hasMany(target, options);
        target.belongsTo(source, options);
        break;
      case "ManyToOne":
        source.belongsTo(target, options);
        target.hasMany(source, options);
        break;
      case "ManyToMany":
        source.belongsToMany(target, {
          through: options.through,
          ...options
        });
        target.belongsToMany(source, {
          through: options.through,
          ...options
        });
        break;
      default:
        throw new Error(`Unknown association type: ${type}`);
    }
  });
};
async function initDatabase() {
  const {
    associations
  } = require((0, _Utils.getFilePath)("models", "associations.js"));
  try {
    loadModels();
    defineAssociations(associations);
    await Database.sync();
    console.log("Database initiated and synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}