"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Routes = void 0;
exports.getRouter = getRouter;
exports.loadRoutes = loadRoutes;
var _Utils = require("./Utils.js");
var _Controller = require("./Controller.js");
var _Database = require("./Database.js");
var _Middlewares = require("./Middlewares.js");
let Routes = exports.Routes = {};
async function loadRoutes() {
  let routesString = "";
  (0, _Utils.getFileNames)("routes").forEach(route => {
    routesString += JSON.stringify(require((0, _Utils.getRoutePath)(route))).slice(1, -1) + ",";
  });
  exports.Routes = Routes = JSON.parse("{" + routesString.slice(0, -1) + "}");
}
async function getRouter(app, router) {
  loadRoutes();
  for (const route in Routes) {
    //Fetch all routes
    const routeData = route.split(" ");
    const method = routeData[0].trim();
    const path = routeData[1].trim();

    // Manage redirections
    if (Routes[route].redirect) {
      const redirectionPath = Routes[route].redirect;
      router.get(path, function (req, res) {
        res.redirect(redirectionPath);
      });
    }

    // Manage views
    if (Routes[route].view) {
      app.get(path, (req, res) => {
        res.render(Routes[route].view, Routes[route].viewData);
      });
    }
    if (Routes[route].controller) {
      const controller = _Controller.Controllers[Routes[route].controller];
      const action = Routes[route].action ? Routes[route].action : null;
      const middlewares = Routes[route].middlewares ? (0, _Middlewares.loadRouteMiddlewares)(Routes[route].middlewares) : null;
      if (middlewares) {
        router.use(path, (req, res, next) => {
          middlewares.forEach(middleware => {
            middleware(req, res, next);
          });
        });
      }
      if (!action && method != "API") {
        router.get(path, (req, res) => {
          res.status(404).json("You must specify an action for this route");
        });
        return;
      }

      //Create all methods
      switch (method) {
        case "GET":
          router.get(path, controller[action]);
          break;
        case "POST":
          router.post(path, function (req, res) {
            controller[action](req, res);
          });
          break;
        case "DELETE":
          router.delete(path, controller[action]);
          break;
        case "API":
          router.get(path, (req, res) => {
            controller.find(req, res, _Database.sequelize.Sequelize.Op);
          });
          router.post(path, (req, res) => {
            controller.create(req, res);
          });
          router.get(path + "/:id", (req, res) => {
            controller.findOne(req, res);
          });
          router.put(path + "/:id", (req, res) => {
            controller.update(req, res);
          });
          router.delete(path + "/:id", (req, res) => {
            controller.destroy(req, res);
          });
          break;
        default:
          app.get(path, controller[action]);
          break;
      }
    }
  }
}