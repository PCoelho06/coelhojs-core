import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import robots from "express-robots-txt";
import morgan from "morgan";

const rootDir = process.cwd();

export function loadRouteMiddlewares(middlewaresArray) {
  const routeMiddlewares = [];
  middlewaresArray.forEach((middleware) => {
    if (middleware.includes("(")) {
      const middlewareData = "acl(products_list)".match(/(.*)\((.*)\)/);
      const middlewareFunction = middlewares[middlewareData[1]];
      const middlewareParam = middlewareData[2];
      routeMiddlewares.push(middlewareFunction(middlewareParam));
      // routeMiddlewares.push(middlewares[middlewareData[1]](middlewareData[2]));
    } else {
      routeMiddlewares.push(middlewares[middleware]);
    }
  });
  return routeMiddlewares;
}

async function loadMiddlewares() {
  getFileNames("middlewares").forEach((middleware) => {
    middlewares[middleware] = require(process.cwd() +
      "/middlewares/" +
      middleware +
      ".middleware.js");
  });
}

export async function initMiddlewares(app) {
  await loadMiddlewares();

  app.use(
    morgan(
      "[:date[clf]] :method :url :status :res[content-length] - :response-time ms",
      {
        stream: this.accessLogStream,
      }
    )
  );
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(express.static(path.normalize(path.join(process.cwd(), "assets"))));

  app.use(cors(Config.middlewares.cors));
  app.use(
    fileUpload({
      abortOnLimit: true,
      responseOnLimit: "File size limit has been reached",
    })
  );
  app.use(helmet(Config.middlewares.helmet));
  app.use(compression(Config.middlewares.compression));
  app.use(express.json({ limit: Config.app.jsonLimit }));
  app.use(express.urlencoded({ limit: Config.app.jsonLimit, extended: true }));
  app.use(
    cookieParser(
      Config.middlewares.cookieParser.secret,
      Config.middlewares.cookieParser.options
    )
  );
  app.use(express.static(rootDir + Config.middlewares.static));
  app.use(robots(Config.middlewares.robots));
}
