import { Sequelize } from "sequelize";
import { Config } from "./Config.js";
import {
  getFileNames,
  getModelPath,
  getFilePath,
  capitalize,
} from "./Utils.js";
import fs from "fs";

export const Models = {};

export const sequelize = new Sequelize(
  Config.db.sequelize.database,
  Config.db.sequelize.username,
  Config.db.sequelize.password,
  {
    host: Config.db.sequelize.options.host,
    dialect: Config.db.sequelize.options.dialect,
    logging: Boolean(Config.db.sequelize.options.logging),
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
  try {
    loadModels();
    const associationsPath = getFilePath("models", "associations.js");

    if (!fs.existsSync(associationsPath)) {
      fs.writeFileSync(
        associationsPath,
        "module.exports = { associations: [] };"
      );
    } else {
      const { associations } = require(associationsPath);
      defineAssociations(associations);
    }
    await sequelize.sync();
    console.log("Database initiated and synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}
