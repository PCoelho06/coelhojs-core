import express from "express";
import { createServer } from "http";
import clc from "cli-color";
import { DataTypes } from "sequelize";

import { Config } from "./Config.js";
import { getRouter } from "./Router.js";
import { showWelcomeMessage } from "./Utils.js";
import { Database, Models, initDatabase, syncDatabase } from "./Database.js";
import { Controller, Controllers, loadControllers } from "./Controller.js";
import { Services, loadServices } from "./Services.js";
import { initMiddlewares } from "./Middlewares.js";

const app = express();
const router = express.Router();
const httpServer = createServer(app);

export class CoelhoJs {
  async initRouter() {
    await loadControllers();
    console.log("🚀 ~ CoelhoJs ~ initRouter ~ Controllers:", Controllers);
    await getRouter(app, router, Controllers);

    app.use("", router);

    app.get("*", function (req, res) {
      res.status(404).json("Not Found");
    });
  }

  initHttpServer() {
    httpServer.listen(Config.app.port, function () {
      console.log(
        "\nYou can now access your app on http://localhost:" + Config.app.port
      );
    });
  }

  async start() {
    await loadServices();
    await initDatabase();
    await this.bootstrap();
    await initMiddlewares(app);
    await this.initRouter();
    app.use((err, req, res, next) => {
      console.error(err);
      res.send({ error: "Something went wrong!" });
    });
    this.initHttpServer();
    showWelcomeMessage(clc);
  }
}

export {
  Controller,
  Models,
  Controllers,
  Services,
  Database,
  DataTypes,
  Config,
  syncDatabase,
};
