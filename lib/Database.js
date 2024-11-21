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
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const Models = exports.Models = {};
const sequelize = exports.sequelize = new _sequelize.Sequelize(_Config.Config.db.sequelize.database, _Config.Config.db.sequelize.username, _Config.Config.db.sequelize.password, {
  host: _Config.Config.db.sequelize.options.host,
  dialect: _Config.Config.db.sequelize.options.dialect,
  logging: Boolean(_Config.Config.db.sequelize.options.logging)
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
    const associationsPath = (0, _Utils.getFilePath)("models", "associations.js");
    if (!_fs.default.existsSync(associationsPath)) {
      _fs.default.writeFileSync(associationsPath, "module.exports = { associations: [] };");
    } else {
      const {
        associations
      } = require(associationsPath);
      defineAssociations(associations);
    }
    await sequelize.sync();
    console.log("Database initiated and synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}