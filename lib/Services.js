"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Services = void 0;
exports.loadServices = loadServices;
var _fs = require("fs");
var _Utils = require("./Utils.js");
const Services = exports.Services = {};
async function loadServices() {
  (0, _fs.access)(process.cwd() + "/services", error => {
    if (error) {
      return;
    }
    (0, _Utils.getFileNames)("services").forEach(service => {
      const serviceClass = require((0, _Utils.getServicePath)(service));
      Services[capitalize(service)] = new serviceClass[capitalize(service)]();
    });
  });
}