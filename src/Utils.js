import path from "path";

import { readdirSync } from "fs";
import { existsSync, mkdirSync } from "fs";

export function capitalize(word) {
  if (typeof word !== "string") return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getFileNames(folder) {
  const fileNames = [];
  const extension = "." + folder.substring(0, folder.length - 1) + ".js";
  if (!existsSync("./" + folder)) {
    mkdirSync("./" + folder);
    return fileNames;
  }
  const files = readdirSync("./" + folder);
  files.forEach((file) => {
    if (file.includes(extension)) {
      const name = file.replace(extension, "");
      fileNames.push(name);
    }
  });
  return fileNames;
}

export function getProjectRoot() {
  return process.cwd();
}

export function getFilePath(folder, fileName) {
  return path.join(getProjectRoot(), folder, fileName);
}

export function getFolderPath(folder) {
  return path.join(getProjectRoot(), folder);
}

export function getModelPath(model) {
  return getFilePath("models", model + ".model.js");
}

export function getControllerPath(controller) {
  return getFilePath("controllers", controller + ".controller.js");
}

export function getMiddlewarePath(middleware) {
  return getFilePath("middlewares", middleware + ".middleware.js");
}

export function getRoutePath(route) {
  return getFilePath("routes", route + ".route.js");
}

export function getServicePath(service) {
  return getFilePath("services", service + ".service.js");
}

export function showWelcomeMessage(clc) {
  console.log("        /\\ /|");
  console.log("       |" + clc.xterm(218)("||") + "| |");
  console.log(
    "        \\ | \\       a88888b.                   dP dP                       dP .d88888b"
  );
  console.log(
    "    _ _ /  " +
      clc.red("@ @") +
      "     d8'   `88                   88 88                       88 88.    '' "
  );
  console.log(
    "  /    \\   =>" +
      clc.xterm(218)("X") +
      "<=   88        .d8888b. .d8888b. 88 88d888b. .d8888b.        88 `Y88888b. "
  );
  console.log(
    "/|      |   /      88        88'  `88 88ooood8 88 88'  `88 88'  `88        88       `8b "
  );
  console.log(
    "\\|     /__| |      Y8.   .88 88.  .88 88.  ... 88 88    88 88.  .88 88.  .d8P d8'   .8P "
  );
  console.log(
    "  \\_____\\ \\__\\      Y88888P' `88888P' `88888P' dP dP    dP `88888P'  `Y8888'   Y88888P  "
  );
}
