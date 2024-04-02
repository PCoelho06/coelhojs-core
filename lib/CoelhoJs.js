const path = require("path");
const express = require("express");
const fs = require("fs");
const clc = require("cli-color");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const robots = require("express-robots-txt");

const { getFileNames, capitalize } = require("./utils.js");
const { sequelize, DataTypes } = require("./db.config.js");
const { AbstractController } = require("./AbstractController.js");
const { Config } = require("./Config.js");
const { showWelcomeMessage } = require("./welcome.js");

const rootDir = process.cwd();
const app = express();

const models = {};
let routes = {};
const controllers = {};
const services = {};
const middlewares = {};

var morgan = require("morgan");
var accessLogStream = fs.createWriteStream("./logs/access.log", {
  flags: "a",
});

class CoelhoJs {
  setModels() {
    getFileNames("models").forEach((model) => {
      models[capitalize(model)] = require(process.cwd() +
        "/models/" +
        model +
        ".model.js");
    });
  }

  setRoutes() {
    let routesString = "";
    getFileNames("routes").forEach((route) => {
      routesString +=
        JSON.stringify(
          require(process.cwd() + "/routes/" + route + ".route.js")
        ).slice(1, -1) + ",";
    });
    routes = JSON.parse("{" + routesString.slice(0, -1) + "}");
  }

  setServices() {
    getFileNames("services").forEach((service) => {
      services[capitalize(service)] = require(process.cwd() +
        "/services/" +
        service +
        ".service.js");
    });
  }

  async setControllers() {
    getFileNames("controllers").forEach((controller) => {
      const controllerClass = require(process.cwd() +
        "/controllers/" +
        controller +
        ".controller.js");
      controllers[controller + "Controller"] = new controllerClass[
        capitalize(controller) + "Controller"
      ]();
    });
  }

  setMiddlewares() {
    getFileNames("middlewares").forEach((middleware) => {
      middlewares[middleware] = require(process.cwd() +
        "/middlewares/" +
        middleware +
        ".middleware.js");
    });
  }

  getMiddlewares(routeMiddlewares) {
    const pathMiddlewares = [];
    routeMiddlewares.forEach((middleware) => {
      if (middleware.includes("(")) {
        const middlewareData = "acl(products_list)".match(/(.*)\((.*)\)/);
        const middlewareFunction = middlewares[middlewareData[1]];
        const middlewareParam = middlewareData[2];
        pathMiddlewares.push(middlewareFunction(middlewareParam));
        // pathMiddlewares.push(middlewares[middlewareData[1]](middlewareData[2]));
      } else {
        pathMiddlewares.push(middlewares[middleware]);
      }
    });

    return pathMiddlewares;
  }

  setAssociations() {
    const { setAssociations } = require(process.cwd() + "/models/associations");

    return setAssociations();
  }

  async initDatabase() {
    try {
      await this.setModels();
      this.setAssociations();
      await sequelize.sync();
      console.log("🚀 ~ initDatabase ~ success");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      process.exit(1);
    }
  }

  async initMiddlewares() {
    this.setMiddlewares();
    const bodyParser = require("body-parser");
    app.use(
      morgan(
        "[:date[clf]] :method :url :status :res[content-length] - :response-time ms",
        {
          stream: accessLogStream,
        }
      )
    );
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(express.static(path.normalize(path.join(process.cwd(), "assets"))));

    let { Eta } = require("eta");
    let eta = new Eta({
      views: path.join(process.cwd(), "/views"),
      cache: false,
    });
    app.use(function (req, res, next) {
      res.render = function (view, data) {
        res.send(eta.render(view, data));
      };
      next();
    });

    app.use(cors(Config.middlewares.cors));
    app.use(
      fileUpload({
        abortOnLimit: true,
        responseOnLimit: "File size limit has been reached",
      })
    );
    //app.use(helmet(Config.middlewares.helmet));
    app.use(compression(Config.middlewares.compression));
    app.use(express.json({ limit: Config.app.jsonLimit }));
    app.use(
      express.urlencoded({ limit: Config.app.jsonLimit, extended: true })
    );
    app.use(
      cookieParser(
        Config.middlewares.cookieParser.secret,
        Config.middlewares.cookieParser.options
      )
    );
    app.use(express.static(rootDir + Config.middlewares.static));
    app.use(robots(Config.middlewares.robots));
  }

  initRouter() {
    this.setControllers();
    this.setRoutes();
    const getRouter = require("./router.js").getRouter;
    const apiRouter = express.Router();
    getRouter(
      app,
      apiRouter,
      routes,
      controllers,
      this.getMiddlewares,
      sequelize.Sequelize.Op
    );

    app.use("", apiRouter);

    app.get("*", function (req, res) {
      res.render("./errors/404.eta");
    });
  }

  initServer() {
    // app.listen(Config.app.port, function () {
    //   console.log("listening on port " + Config.app.port);
    // });
    app.listen(Config.app.port, function () {
      console.log(
        "\nYou can now access you're app on http://localhost:" + Config.app.port
      );
    });
  }

  initServices() {
    this.setServices();
  }

  async start() {
    this.initServices();
    await this.initDatabase();
    await this.bootstrap();
    this.initMiddlewares();
    this.initRouter();
    this.initServer();
    showWelcomeMessage(clc);
  }
}

module.exports = {
  CoelhoJs,
  AbstractController,
  models,
  controllers,
  services,
  sequelize,
  DataTypes,
  Config,
};
