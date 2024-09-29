import express from "express";
import { createServer } from "http";
import fs from "fs";
import clc from "cli-color";
import { DataTypes } from "sequelize";

import { Config } from "./Config.js";
import { loadRoutes, getRouter } from "./Router.js";
import { showWelcomeMessage } from "./Utils.js";
import { Database, Models, initDatabase } from "./Database.js";
import { Controller, Controllers, loadControllers } from "./Controller.js";
import { Services, loadServices } from "./Services.js";
import { initMiddlewares } from "./Middlewares.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();
const router = express.Router();
const httpServer = createServer(app);

export class CoelhoJs {
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
    httpServer.listen(Config.app.port, function () {
      console.log(
        "\nYou can now access you're app on http://localhost:" + Config.app.port
      );
    });
  }

  async start() {
    await loadServices();
    // await initDatabase();
    // await this.bootstrap();
    await initMiddlewares(app);
    this.initRouter();
    errorHandler();
    this.initHttpServer();
    showWelcomeMessage(clc);
  }
}

module.exports = {
  Controller,
  Models,
  Controllers,
  Services,
  Database,
  DataTypes,
  Config,
};
