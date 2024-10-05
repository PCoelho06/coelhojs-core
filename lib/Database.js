"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Models = void 0;
exports.initDatabase = initDatabase;
exports.sequelize = void 0;
var _sequelize = require("sequelize");
var _Config = require("./Config.js");
var _Utils = require("./Utils.js");
const Models = exports.Models = {};
const sequelize = exports.sequelize = new _sequelize.Sequelize(_Config.Config.sequelize.database, _Config.Config.sequelize.username, _Config.Config.sequelize.password, {
  host: _Config.Config.sequelize.options.host,
  dialect: _Config.Config.sequelize.options.dialect,
  logging: Boolean(_Config.Config.sequelize.options.logging)
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
  try {
    loadModels();
    const {
      associations
    } = require((0, _Utils.getFilePath)("models", "associations.js"));
    defineAssociations(associations);
    await sequelize.sync();
    console.log("Database initiated and synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}