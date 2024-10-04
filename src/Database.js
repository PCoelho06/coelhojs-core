import { Sequelize } from "sequelize";
import { Config } from "./Config.js";
import {
  getFileNames,
  getModelPath,
  getFilePath,
  capitalize,
} from "./Utils.js";

export const Models = {};

export const Database = new Sequelize(
  Config.database.database,
  Config.database.username,
  Config.database.password,
  {
    host: Config.database.options.host,
    dialect: Config.database.options.dialect,
    logging: Boolean(Config.database.options.logging),
  }
);

function loadModels() {
  getFileNames("models").forEach((model) => {
    Models[capitalize(model)] = require(getModelPath(model));
  });
}

const defineAssociations = (associations) => {
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
        source.belongsToMany(target, { through: options.through, ...options });
        target.belongsToMany(source, { through: options.through, ...options });
        break;
      default:
        throw new Error(`Unknown association type: ${type}`);
    }
  });
};

export async function initDatabase() {
  const { associations } = require(getFilePath("models", "associations.js"));
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
