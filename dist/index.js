"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Router = require("koa-router");
var Koa = require("koa");
var bodyParser = require("koa-bodyparser");
var cors = require("koa-cors");
var ShoioHttpServer = /** @class */ (function () {
    function ShoioHttpServer(config) {
        this.$options = {};
        this.$options = config;
    }
    ShoioHttpServer.prototype.startServer = function (sh) {
        var _this = this;
        this.$server = new Koa();
        var component = (this.$options.entry && sh.getComponent(this.$options.entry)) || sh;
        var router = component.__createRouter();
        if (!router) {
            throw new Error('Entry component have not required handler functions "mountRouter" ');
        }
        this.$server.use(cors());
        this.$server.use(bodyParser());
        this.$server.use(router.routes());
        this.$server.listen(this.$options.port || 3000, function () {
            if (component.serverUp) {
                component.serverUp(_this.$server, _this.$options);
            }
        });
    };
    ShoioHttpServer.setRouterConfigurator = function (sh) {
        sh.$options.routerConfiguratorName = "mountRouter";
        var configuratorName = sh.$options.routerConfiguratorName;
        if (typeof sh.$options.routerConfigurer === "function") {
            return;
        }
        else if (typeof sh.$options.routerConfigurer === "string") {
            configuratorName = sh.$options.routerConfigurer;
        }
        var configuratorFunction = sh.$options[configuratorName] || sh[configuratorName];
        if (!configuratorFunction) {
            return;
        }
        sh.$options.routerConfigurer = configuratorFunction;
    };
    ShoioHttpServer.prototype.install = function (shoio) {
        var _this = this;
        shoio.on("created", function (sh) {
            sh.$router = new ShoioHttpServerRouterBuilder(sh);
            sh.$routerConfigurer =
                sh.mountRouter || sh[sh.$options.routerConfiguratorName];
            sh.__createRouter = function () {
                if (typeof sh.$options.routerPrefix === "undefined") {
                    sh.$options.routerPrefix = "/";
                }
                if (typeof sh.$options.prefix !== "undefined") {
                    sh.$options.routerPrefix = sh.$options.prefix;
                }
                if (!sh.$routerConfigurer) {
                    return;
                }
                // Call the configurer
                var routerConfig = sh.$routerConfigurer.call(sh, sh.$router);
                if (routerConfig && typeof routerConfig.prefix !== "undefined") {
                    sh.$routerPrefix = routerConfig.prefix;
                }
                var routerOut = new Router({ prefix: sh.$routerPrefix });
                // if( routerConfig ) {
                //     if (routerConfig.useComponents) {
                //         for (const componentSignature of routerConfig.useComponents) {
                //             const component = sh.getComponent(componentSignature, true);
                //             const router = component.__createRouter();
                //             if (router) {
                //                 routerOut.use(router.routes());
                //             }
                //         }
                //     }
                // }
                routerOut.use(sh.$router.build().routes());
                return routerOut;
            };
        });
        if (shoio.$parent) {
            return;
        }
        shoio.on("mounted", function (sh) {
            // @ts-ignore
            if (_this.$options.boot) {
                _this.startServer(sh);
            }
        });
    };
    return ShoioHttpServer;
}());
exports.ShoioHttpServer = ShoioHttpServer;
var defaultParser = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args;
};
var ShoioHttpServerRouterBuilder = /** @class */ (function () {
    function ShoioHttpServerRouterBuilder(scope) {
        this.__scope = {};
        this.$router = new Router();
        this.__scope = scope;
    }
    ShoioHttpServerRouterBuilder.prototype.createHandler = function (action, requestParser) {
        var _this = this;
        if (requestParser === void 0) { requestParser = defaultParser; }
        return function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var args, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        args = requestParser(ctx, next);
                        if (!action) {
                            ctx.body = "Action not found";
                            return [2 /*return*/];
                        }
                        else if (typeof action === "function") {
                            response = action.call.apply(action, [this.__scope].concat(args, [next]));
                        }
                        else if (typeof action === "object") {
                            response = "not supported action";
                        }
                        else if (typeof action === "string") {
                            action = this.__scope[action];
                            response = action.call.apply(action, [this.__scope].concat(args, [next]));
                        }
                        if (!(response || response instanceof Promise)) return [3 /*break*/, 2];
                        _a = ctx;
                        return [4 /*yield*/, response];
                    case 1:
                        _a.body = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
    };
    ShoioHttpServerRouterBuilder.prototype.get = function (path, action, requestParser) {
        this.$router.get(path, this.createHandler(action, requestParser));
    };
    ShoioHttpServerRouterBuilder.prototype.post = function (path, action, requestParser) {
        this.$router.post(path, this.createHandler(action, requestParser));
    };
    ShoioHttpServerRouterBuilder.prototype.put = function (path, action, requestParser) {
        this.$router.put(path, this.createHandler(action, requestParser));
    };
    ShoioHttpServerRouterBuilder.prototype.delete = function (path, action, requestParser) {
        this.$router.delete(path, this.createHandler(action, requestParser));
    };
    ShoioHttpServerRouterBuilder.prototype.patch = function (path, action, requestParser) {
        this.$router.patch(path, this.createHandler(action, requestParser));
    };
    ShoioHttpServerRouterBuilder.prototype.all = function (path, action, requestParser) {
        this.$router.patch(path, this.createHandler(action, requestParser));
    };
    ShoioHttpServerRouterBuilder.prototype.middlewhere = function (action) {
        var _this = this;
        this.$router.use(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return action.call.apply(action, [_this.__scope].concat(args));
        });
    };
    ShoioHttpServerRouterBuilder.prototype.useComponent = function (path, componentSignature) {
        var component = this.__scope.getComponent(componentSignature, true, true);
        if (process.env.DEBUG && !component) {
            console.log("Component not found, may be not registred or not mounted in application -->", typeof componentSignature, componentSignature.name);
        }
        if (!component) {
            return;
        }
        var router = component.__createRouter();
        if (!router) {
            console.log("Router not created");
            return;
        }
        this.$router.use(path, router.routes());
    };
    ShoioHttpServerRouterBuilder.prototype.build = function () {
        return this.$router;
    };
    return ShoioHttpServerRouterBuilder;
}());
exports.ShoioHttpServerRouterBuilder = ShoioHttpServerRouterBuilder;
