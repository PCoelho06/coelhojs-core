module.exports = {
  async getRouter(app, apiRouter, routes, controllers, getMiddlewares, Op) {
    for (const route in routes) {
      //Fetch all routes
      const routeDatas = route.split(" ");
      const method = routeDatas[0].trim();
      const path = routeDatas[1].trim();

      if (routes[route].redirect) {
        const redirectionPath = routes[route].redirect;
        app.get(path, function (req, res) {
          res.redirect(redirectionPath);
        });
      }

      if (routes[route].view) {
        app.get(path, (req, res) => {
          res.render(routes[route].view, routes[route].viewData);
        });
      }

      if (routes[route].action) {
        const routeAction = routes[route].action.split(".");
        const controller = routeAction[0];
        const action = routeAction[1];
        const controllerClass = controllers[controller];

        //Create all methods
        switch (method) {
          case "GET":
            apiRouter.get(path, controllerClass[action]);
            break;
          case "POST":
            apiRouter.post(path, function (req, res) {
              controllerClass[action](req, res);
            });
            break;
          case "DELETE":
            apiRouter.delete(path, controllerClass[action]);
            break;
          case "API":
            const routeMiddlewares = routes[route].middlewares;

            const pathMiddlewares = getMiddlewares(routeMiddlewares);

            if (pathMiddlewares.length != 0) {
              app.use(path, pathMiddlewares);
            }

            apiRouter.get(path, (req, res) => {
              controllerClass.find(req, res, Op);
            });
            apiRouter.post(path, (req, res) => {
              controllerClass.create(req, res);
            });
            apiRouter.get(path + "/:id", (req, res) => {
              controllerClass.findOne(req, res);
            });
            apiRouter.put(path + "/:id", (req, res) => {
              controllerClass.update(req, res);
            });
            apiRouter.delete(path + "/:id", (req, res) => {
              controllerClass.destroy(req, res);
            });

            break;

          default:
            app.get(path, controllerClass[action]);
            break;
        }
      }
    }
  },
};
