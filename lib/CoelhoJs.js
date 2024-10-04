"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoelhoJs = void 0;
Object.defineProperty(exports, "Config", {
  enumerable: true,
  get: function () {
    return _Config.Config;
  }
});
Object.defineProperty(exports, "Controller", {
  enumerable: true,
  get: function () {
    return _Controller.Controller;
  }
});
Object.defineProperty(exports, "Controllers", {
  enumerable: true,
  get: function () {
    return _Controller.Controllers;
  }
});
Object.defineProperty(exports, "DataTypes", {
  enumerable: true,
  get: function () {
    return _sequelize.DataTypes;
  }
});
Object.defineProperty(exports, "Database", {
  enumerable: true,
  get: function () {
    return _Database.Database;
  }
});
Object.defineProperty(exports, "Models", {
  enumerable: true,
  get: function () {
    return _Database.Models;
  }
});
Object.defineProperty(exports, "Services", {
  enumerable: true,
  get: function () {
    return _Services.Services;
  }
});
Object.defineProperty(exports, "syncDatabase", {
  enumerable: true,
  get: function () {
    return _Database.syncDatabase;
  }
});
var _express = _interopRequireDefault(require("express"));
var _http = require("http");
var _cliColor = _interopRequireDefault(require("cli-color"));
var _sequelize = require("sequelize");
var _Config = require("./Config.js");
var _Router = require("./Router.js");
var _Utils = require("./Utils.js");
var _Database = require("./Database.js");
var _Controller = require("./Controller.js");
var _Services = require("./Services.js");
var _Middlewares = require("./Middlewares.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const app = (0, _express.default)();
const router = _express.default.Router();
const httpServer = (0, _http.createServer)(app);
class CoelhoJs {
  async initRouter() {
    await (0, _Controller.loadControllers)();
    console.log("🚀 ~ CoelhoJs ~ initRouter ~ Controllers:", _Controller.Controllers);
    await (0, _Router.getRouter)(app, router, _Controller.Controllers);
    app.use("", router);
    app.get("*", function (req, res) {
      res.status(404).json("Not Found");
    });
  }
  initHttpServer() {
    httpServer.listen(_Config.Config.app.port, function () {
      console.log("\nYou can now access your app on http://localhost:" + _Config.Config.app.port);
    });
  }
  async start() {
    await (0, _Services.loadServices)();
    await (0, _Database.initDatabase)();
    await this.bootstrap();
    await (0, _Middlewares.initMiddlewares)(app);
    await this.initRouter();
    app.use((err, req, res, next) => {
      console.error(err);
      res.send({
        error: "Something went wrong!"
      });
    });
    this.initHttpServer();
    (0, _Utils.showWelcomeMessage)(_cliColor.default);
  }
}
exports.CoelhoJs = CoelhoJs;