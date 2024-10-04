"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = void 0;
var _fs = require("fs");
var _Utils = require("./Utils.js");
let Config = exports.Config = {};
function readConfig() {
  try {
    exports.Config = Config = require((0, _Utils.getProjectRoot)() + "/.config.js");
    let ConfigShared = require((0, _Utils.getProjectRoot)() + "/.shared.config.js");
    mergeDeep(Config, ConfigShared);
    Config.package = JSON.parse((0, _fs.readFileSync)((0, _Utils.getProjectRoot)() + "/package.json"));
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
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    }
  }
  return mergeDeep(target, ...sources);
}
readConfig();