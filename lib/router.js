const { getFileNames } = require("./Utils");
const { Controllers } = require("./Controller");
const { Database } = require("./Database");
const { loadRouteMiddlewares } = require("./Middlewares");

let Routes = {};

async function loadRoutes() {
  let routesString = "";
  getFileNames("routes").forEach((route) => {
    routesString +=
      JSON.stringify(
        require(process.cwd() + "/routes/" + route + ".route.js")
      ).slice(1, -1) + ",";
  });
  Routes = JSON.parse("{" + routesString.slice(0, -1) + "}");
}

async function getRouter(app, router) {
  for (const route in Routes) {
    //Fetch all routes
    const routeDatas = route.split(" ");
    const method = routeDatas[0].trim();
    const path = routeDatas[1].trim();

    if (Routes[route].redirect) {
      const redirectionPath = Routes[route].redirect;
      app.get(path, function (req, res) {
        res.redirect(redirectionPath);
      });
    }

    if (Routes[route].view) {
      app.get(path, (req, res) => {
        res.render(Routes[route].view, Routes[route].viewData);
      });
    }

    if (Routes[route].action) {
      const routeAction = Routes[route].action.split(".");
      const controller = routeAction[0];
      const action = routeAction[1];
      const controllerClass = Controllers[controller];

      //Create all methods
      switch (method) {
        case "GET":
          router.get(path, controllerClass[action]);
          break;
        case "POST":
          router.post(path, function (req, res) {
            controllerClass[action](req, res);
          });
          break;
        case "DELETE":
          router.delete(path, controllerClass[action]);
          break;
        case "API":
          const routeMiddlewaresArray = Routes[route].middlewares;

          const routeMiddlewares = loadRouteMiddlewares(routeMiddlewaresArray);

          if (routeMiddlewares.length != 0) {
            router.use(path, routeMiddlewares);
          }

          router.get(path, (req, res) => {
            controllerClass.find(req, res, Database.Sequelize.Op);
          });
          router.post(path, (req, res) => {
            controllerClass.create(req, res);
          });
          router.get(path + "/:id", (req, res) => {
            controllerClass.findOne(req, res);
          });
          router.put(path + "/:id", (req, res) => {
            controllerClass.update(req, res);
          });
          router.delete(path + "/:id", (req, res) => {
            controllerClass.destroy(req, res);
          });

          break;

        default:
          app.get(path, controllerClass[action]);
          break;
      }
    }
  }
}

module.exports = { Routes, loadRoutes, getRouter };
