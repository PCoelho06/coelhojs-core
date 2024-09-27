const express = require("express");
const fs = require("fs");
const clc = require("cli-color");

const { Config } = require("./Config.js");
const { loadRoutes, getRouter } = require("./Router.js");
const { showWelcomeMessage } = require("./Utils.js");
const { Database, DataTypes, Models, initDatabase } = require("./Database.js");
const { Controller, Controllers, loadControllers } = require("./Controller.js");
const { Services, loadServices } = require("./Services.js");

const app = express();
const router = express.Router();

class CoelhoJs {
  constructor() {
    fs.mkdir("./logs", { recursive: true }, (err) => {
      if (err) throw err;
    });
    this.accessLogStream = fs.createWriteStream("./logs/access.log", {
      flags: "a",
    });
  }

  initRouter() {
    loadControllers();
    loadRoutes();
    getRouter(app, router);

    app.use("", router);

    app.get("*", function (req, res) {
      res.render("./errors/404.eta");
    });
  }

  initHttpServer() {
    app.listen(Config.app.port, function () {
      console.log(
        "\nYou can now access you're app on http://localhost:" + Config.app.port
      );
    });
  }

  async start() {
    await loadServices();
    // await initDatabase();
    // await this.bootstrap();
    await this.initMiddlewares(app);
    this.initRouter();
    this.initHttpServer();
    showWelcomeMessage(clc);
  }
}

module.exports = {
  CoelhoJs,
  Controller,
  Models,
  Controllers,
  Services,
  Database,
  DataTypes,
  Config,
};
