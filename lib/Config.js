const fs = require("fs");

let Config = {};

function readConfig() {
  try {
    Config = require(process.cwd() + "/.config.js");

    let ConfigShared = require(process.cwd() + "/.shared.config.js");
    mergeDeep(Config, ConfigShared);

    Config.package = JSON.parse(
      fs.readFileSync(process.cwd() + "/package.json")
    );
  } catch (error) {}
}

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

readConfig();

module.exports = { Config };
