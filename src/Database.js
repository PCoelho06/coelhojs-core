import { Sequelize } from "sequelize";
import { Config } from "./Config.js";
import { getFileNames } from "./Utils.js";

export const Models = {};

export const Database = new Sequelize(
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
  const associations = require(process.cwd() + "/models/associations.js");
  try {
    loadModels();
    // setAssociations();
    defineAssociations();
    await database.sync();
    console.log("Database initiated and synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}
