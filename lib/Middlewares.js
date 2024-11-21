"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMiddlewares = initMiddlewares;
exports.loadRouteMiddlewares = loadRouteMiddlewares;
var _express = _interopRequireDefault(require("express"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _cors = _interopRequireDefault(require("cors"));
var _expressFileupload = _interopRequireDefault(require("express-fileupload"));
var _helmet = _interopRequireDefault(require("helmet"));
var _compression = _interopRequireDefault(require("compression"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _expressRobotsTxt = _interopRequireDefault(require("express-robots-txt"));
var _morgan = _interopRequireDefault(require("morgan"));
var _Utils = require("./Utils");
var _Config = require("./Config");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// const rootDir = process.cwd();

_fs.default.mkdir("./logs", {
  recursive: true
}, err => {
  if (err) throw err;
});
let accessLogStream = _fs.default.createWriteStream("./logs/access.log", {
  flags: "a"
});
function loadRouteMiddlewares(middlewaresArray) {
  const routeMiddlewares = [];
  middlewaresArray.forEach(middleware => {
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
  (0, _Utils.getFileNames)("middlewares").forEach(middleware => {
    middlewares[middleware] = require((0, _Utils.getMiddlewarePath)(middleware));
  });
}
async function initMiddlewares(app) {
  await loadMiddlewares();
  app.use((0, _morgan.default)("[:date[clf]] :method :url :status :res[content-length] - :response-time ms", {
    stream: accessLogStream
  }));
  app.use(_bodyParser.default.urlencoded({
    extended: false
  }));
  app.use(_bodyParser.default.json());
  app.use(_express.default.static(_path.default.normalize(_path.default.join(process.cwd(), "assets"))));
  app.use((0, _cors.default)(_Config.Config.middlewares.cors));
  app.use((0, _expressFileupload.default)({
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached"
  }));
  app.use((0, _helmet.default)(_Config.Config.middlewares.helmet));
  app.use((0, _compression.default)(_Config.Config.middlewares.compression));
  app.use(_express.default.json({
    limit: _Config.Config.app.jsonLimit
  }));
  app.use(_express.default.urlencoded({
    limit: _Config.Config.app.jsonLimit,
    extended: true
  }));
  // app.use(express.static(rootDir + Config.middlewares.static));
  app.use((0, _expressRobotsTxt.default)(_Config.Config.middlewares.robots));
}