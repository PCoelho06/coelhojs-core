"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capitalize = capitalize;
exports.getControllerPath = getControllerPath;
exports.getFileNames = getFileNames;
exports.getFilePath = getFilePath;
exports.getFolderPath = getFolderPath;
exports.getMiddlewarePath = getMiddlewarePath;
exports.getModelPath = getModelPath;
exports.getProjectRoot = getProjectRoot;
exports.getRoutePath = getRoutePath;
exports.getServicePath = getServicePath;
exports.showWelcomeMessage = showWelcomeMessage;
var _path = _interopRequireDefault(require("path"));
var _fs = require("fs");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function capitalize(word) {
  if (typeof word !== "string") return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}
function getFileNames(folder) {
  const fileNames = [];
  const extension = "." + folder.substring(0, folder.length - 1) + ".js";
  const files = (0, _fs.readdirSync)("./" + folder);
  files.forEach(file => {
    if (file.includes(extension)) {
      const name = file.replace(extension, "");
      fileNames.push(name);
    }
  });
  return fileNames;
}
function getProjectRoot() {
  return process.cwd();
}
function getFilePath(folder, fileName) {
  return _path.default.join(getProjectRoot(), folder, fileName);
}
function getFolderPath(folder) {
  return _path.default.join(getProjectRoot(), folder);
}
function getModelPath(model) {
  return getFilePath("models", model + ".model.js");
}
function getControllerPath(controller) {
  return getFilePath("controllers", controller + ".controller.js");
}
function getMiddlewarePath(middleware) {
  return getFilePath("middlewares", middleware + ".middleware.js");
}
function getRoutePath(route) {
  return getFilePath("routes", route + ".route.js");
}
function getServicePath(service) {
  return getFilePath("services", service + ".service.js");
}
function showWelcomeMessage(clc) {
  console.log("        /\\ /|");
  console.log("       |" + clc.xterm(218)("||") + "| |");
  console.log("        \\ | \\       a88888b.                   dP dP                       dP .d88888b");
  console.log("    _ _ /  " + clc.red("@ @") + "     d8'   `88                   88 88                       88 88.    '' ");
  console.log("  /    \\   =>" + clc.xterm(218)("X") + "<=   88        .d8888b. .d8888b. 88 88d888b. .d8888b.        88 `Y88888b. ");
  console.log("/|      |   /      88        88'  `88 88ooood8 88 88'  `88 88'  `88        88       `8b ");
  console.log("\\|     /__| |      Y8.   .88 88.  .88 88.  ... 88 88    88 88.  .88 88.  .d8P d8'   .8P ");
  console.log("  \\_____\\ \\__\\      Y88888P' `88888P' `88888P' dP dP    dP `88888P'  `Y8888'   Y88888P  ");
}