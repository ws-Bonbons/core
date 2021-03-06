"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const private_api_1 = require("@bonbons/contracts/dist/src/private-api");
const plugins_1 = require("./plugins");
const pipes_1 = require("./pipes");
const di_1 = require("./di");
const utils_1 = require("./utils");
const controllers_1 = require("./controllers");
const options_1 = require("./options");
const public_api_1 = require("./plugins/public-api");
const decorators_1 = require("./decorators");
const get_1 = __importDefault(require("lodash/get"));
const { green: GREEN, yellow: YELLOW, cyan: CYAN, blue: BLUE } = plugins_1.ColorsHelper;
class BaseApp {
    get config() { return this["_configs"]; }
    start() { }
}
exports.BaseApp = BaseApp;
class BonbonsServer {
    constructor(config) {
        this.$app = new private_api_1.KOA();
        this.$confColls = new di_1.ConfigCollection();
        this.$port = 3000;
        this.$is_dev = true;
        this._ctlrs = [];
        this._mwares = [];
        this._pipes = [];
        this._renews = [];
        this._scopeds = [];
        this._singletons = [];
        this.$$defaultOptionsInitialization();
        this.$$configsInitialization(config);
    }
    static Create() { return new BonbonsServer(); }
    static get New() { return BonbonsServer.Create(); }
    /**
     * Use koa middleware.
     * ---
     * use "factory" here , not "factory()", the params should be sent after factory as ...args
     * @description
     * @author Big Mogician
     * @param {MiddlewaresFactory} mfac middleware factory
     * @param {...any[]} params factory params
     * @returns {BonbonsServer}
     * @memberof BonbonsServer
     */
    use(mfac, ...params) {
        this._mwares.push([mfac, params || []]);
        return this;
    }
    pipe(pipe) {
        this._pipes.push(pipe);
        return this;
    }
    option(...args) {
        const [e1, e2] = args;
        if (!e1) {
            throw utils_1.invalidOperation("DI token or entry is empty, you shouldn't call BonbonsServer.use<T>(...) without any param.");
        }
        if (!e2 || args.length === 2) {
            this.$confColls.set(e1, optionAssign(this.$confColls, e1, e2));
        }
        else {
            const { token, value } = e1;
            this.$confColls.set(token, optionAssign(this.$confColls, token, value));
        }
        return this;
    }
    /**
     * Set a controller
     * ---
     * * controller should be decorated by @Controller(...)
     *
     * @description
     * @author Big Mogician
     * @template T
     * @param {*} ctlr
     * @returns {BonbonsServer}
     * @memberof BonbonsServer
     */
    controller(ctlr) {
        if (!ctlr || !ctlr.prototype.__valid)
            throw controllerError(ctlr);
        this._ctlrs.push(ctlr);
        return this;
    }
    renew(...args) {
        return this.$$preInject(args[0], args[1], private_api_1.InjectScope.New);
    }
    scoped(...args) {
        return this.$$preInject(args[0], args[1], private_api_1.InjectScope.Scope);
    }
    singleton(...args) {
        return this.$$preInject(args[0], args[1], private_api_1.InjectScope.Singleton);
    }
    getConfigs() {
        return this.$confColls.get(di_1.CONFIG_COLLECTION);
    }
    /**
     * Start application
     * ---
     * @description
     * @author Big Mogician
     * @param {(configs: ReadonlyConfigs) => void} [run]
     * @memberof BonbonsServer
     */
    start(run) {
        this.$$useCommonOptions();
        this.$$initLogger();
        this.$$initDLookup();
        this.$$initContextProvider();
        this.$$initDIContainer();
        this.$$useRouters();
        this.$$useMiddlewares();
        this.$app.listen(this.$port);
        this.$$afterRun();
        if (run) {
            run(this.$configs);
        }
        if (!this.$is_dev) {
            this._clearServer();
        }
        // console.log(this._configs);
    }
    $$afterRun() {
        const { compilerFactory: factory } = this.$confColls.get(public_api_1.TPL_RENDER_COMPILER);
        this.option(public_api_1.TPL_RENDER_COMPILER, { compiler: factory && factory(this.$configs) });
    }
    _clearServer() {
        delete this.$app;
        delete this.$port;
        delete this._ctlrs;
        delete this._mwares;
        delete this._pipes;
        delete this._scopeds;
        delete this._singletons;
        delete this._clearServer;
    }
    $$configsInitialization(config) {
        if (config) {
            this._ctlrs = config.controller || [];
            resolveInjections(this._renews, config.renews || []);
            resolveInjections(this._scopeds, config.scoped || []);
            resolveInjections(this._singletons, config.singleton || []);
            this._pipes.push(...(config.pipes || []));
            (config.middlewares || []).forEach(item => {
                if (item instanceof Array) {
                    this._mwares.push([item[0], item[1]]);
                }
                else {
                    const { factory, params } = item;
                    factory ?
                        this._mwares.push([factory, params]) :
                        this._mwares.push([item, []]);
                }
            });
            (config.options || []).forEach(item => {
                if (item instanceof Array) {
                    this.option(item[0], item[1]);
                }
                else {
                    this.option(item.token, item.value);
                }
            });
        }
    }
    $$defaultOptionsInitialization() {
        this.option(di_1.ENV_MODE, options_1.Options.env);
        this.option(di_1.DEPLOY_MODE, options_1.Options.deploy);
        this.option(di_1.CONFIG_COLLECTION, this.$confColls);
        this.option(di_1.DI_CONTAINER, new di_1.DIContainer());
        this.option(public_api_1.FILE_LOADER, public_api_1.defaultFileLoaderOptions);
        this.option(public_api_1.TPL_RENDER_COMPILER, public_api_1.defaultTplRenderCompilerOptions);
        this.option(public_api_1.ERROR_HANDLER, public_api_1.defaultErrorHandler);
        this.option(public_api_1.ERROR_PAGE_TEMPLATE, public_api_1.defaultErrorPageTemplate);
        this.option(public_api_1.ERROR_RENDER_OPRIONS, public_api_1.defaultErrorPageRenderOptions);
        this.option(public_api_1.TPL_RENDER_OPTIONS, public_api_1.defaultViewTplRenderOptions);
        this.option(public_api_1.GLOBAL_LOGGER, plugins_1.BonbonsLogger);
        this.option(di_1.STATIC_TYPED_RESOLVER, utils_1.TypedSerializer);
        this.option(di_1.JSON_RESULT_OPTIONS, options_1.Options.jsonResult);
        this.option(di_1.STRING_RESULT_OPTIONS, options_1.Options.stringResult);
        this.option(di_1.BODY_PARSE_OPTIONS, options_1.Options.koaBodyParser);
        this.option(di_1.JSON_FORM_OPTIONS, options_1.Options.jsonForm);
        this.option(di_1.TEXT_FORM_OPTIONS, options_1.Options.textForm);
        this.option(di_1.URL_FORM_OPTIONS, options_1.Options.urlForm);
    }
    $$useCommonOptions() {
        const { mode } = this.$confColls.get(di_1.ENV_MODE);
        this.$is_dev = mode === "development";
        const { port } = this.$confColls.get(di_1.DEPLOY_MODE);
        this.$port = port || 3000;
        this.$configs = { get: this.$confColls.get.bind(this.$confColls) };
        this.singleton(public_api_1.ConfigService, () => this.$configs);
        this.singleton(public_api_1.RenderService, () => new public_api_1.BonbonsRender(this.$configs));
        const handler = this.$confColls.get(public_api_1.ERROR_HANDLER);
        this._mwares.unshift([handler, [this.$configs]]);
    }
    $$initLogger() {
        const caller = "$$initLogger";
        const LoggerConstructor = decorators_1.Injectable()(this.$confColls.get(public_api_1.GLOBAL_LOGGER));
        const env = this.$confColls.get(di_1.ENV_MODE);
        this.$logger = new LoggerConstructor(env);
        this.singleton(public_api_1.Logger, () => this.$logger);
        this.$logger.debug("core", caller, `logger init : [ type -> ${GREEN(public_api_1.Logger.name)} ].`);
        this.$logger.debug("core", caller, "-----------------------");
    }
    $$initDLookup() {
        this.$di = this.$confColls.get(di_1.DI_CONTAINER);
        this.$rdi = { get: this.$di.get.bind(this.$di) };
        this.scoped(public_api_1.InjectService, (scopeId) => ({
            get: (token) => this.$rdi.get(token, scopeId),
            INTERNAL_dispose: () => this.$di.dispose(scopeId),
            scopeId
        }));
    }
    $$initContextProvider() {
        this.scoped(controllers_1.Context, (scopeId, { ctx = null } = {}) => {
            if (ctx === null)
                throw utils_1.invalidOperation("invalid call, you can only call a context in request pipe scope.");
            return new controllers_1.Context(ctx);
        });
    }
    $$initDIContainer() {
        const caller = "$$initDIContainer";
        this.$logger.debug("core", caller, "init DI container.");
        this.$logger.debug("core", caller, `renew inject entry count : [ ${GREEN(this._renews.length)} ].`);
        this._renews.forEach(([tk, imp]) => {
            this.$$injectaFinally(tk, imp, private_api_1.InjectScope.New);
            this.$logger.trace("core", caller, `relation add : [ @${CYAN(tk.name)} -> @${BLUE(logInjectImp(imp))} ].`);
        });
        this.$logger.debug("core", caller, `scoped inject entry count : [ ${GREEN(this._scopeds.length)} ].`);
        this._scopeds.forEach(([tk, imp]) => {
            this.$$injectaFinally(tk, imp, private_api_1.InjectScope.Scope);
            this.$logger.trace("core", caller, `relation add : [ @${CYAN(tk.name)} -> @${BLUE(logInjectImp(imp))} ].`);
        });
        this.$logger.debug("core", caller, `singleton inject entry count : [ ${GREEN(this._singletons.length)} ].`);
        this._singletons.forEach(([tk, imp]) => {
            this.$$injectaFinally(tk, imp, private_api_1.InjectScope.Singleton);
            this.$logger.trace("core", caller, `relation add : [ @${CYAN(tk.name)} -> @${BLUE(logInjectImp(imp))} ].`);
        });
        this.$di.complete();
        this.$logger.debug("core", caller, `complete with di container : [ total injectable count -> ${GREEN(this.$di.count)} ].`);
        this.$logger.debug("core", caller, "-----------------------");
    }
    $$preInject(provide, classType, type) {
        if (!provide)
            return this;
        type = type || private_api_1.InjectScope.Singleton;
        switch (type) {
            case private_api_1.InjectScope.New:
                this._renews.push([provide, classType || provide]);
                break;
            case private_api_1.InjectScope.Scope:
                this._scopeds.push([provide, classType || provide]);
                break;
            default: this._singletons.push([provide, classType || provide]);
        }
        return this;
    }
    $$injectaFinally(provide, classType, type) {
        if (!provide)
            return this;
        type = type || private_api_1.InjectScope.Singleton;
        this.$di.register(provide, classType || provide, type);
        return this;
    }
    $$useRouters() {
        const caller = "$$useRouters";
        this.$logger.debug("core", caller, `start build routers : [ count -> ${GREEN(this._ctlrs.length)} ]`);
        const mainRouter = new private_api_1.KOARouter();
        this._ctlrs.forEach(controllerClass => {
            const proto = controllerClass.prototype || {};
            if (!proto.getConfig)
                throw utils_1.invalidOperation(`invalid controller [${CYAN(controllerClass.name || "unknown-controller")}], you must set a HTTP method for a route.`);
            const { router } = (proto.getConfig());
            const thisRouter = new private_api_1.KOARouter({ prefix: router.prefix });
            this.$logger.debug("core", caller, `register ${YELLOW(controllerClass.name)} : [ @prefix -> ${CYAN(router.prefix)} @methods -> ${plugins_1.COLORS.green}${Object.keys(router.routes).length}${plugins_1.COLORS.reset} ]`);
            Object.keys(router.routes).forEach(methodName => {
                const item = router.routes[methodName];
                const { allowMethods } = item;
                if (!allowMethods)
                    throw utils_1.invalidOperation("invalid method, you must set a HTTP method for a route.");
                allowMethods.forEach(each => this.$$resolveControllerMethod(each, item, controllerClass, methodName, thisRouter));
            });
            mainRouter.use(thisRouter.routes()).use(thisRouter.allowedMethods());
        });
        this.$logger.debug("core", caller, "app routers initialization completed.");
        this.$logger.debug("core", caller, "-----------------------");
        const { routes, allowedMethods } = mainRouter;
        this.use(routes.bind(mainRouter));
        this.use(allowedMethods.bind(mainRouter));
    }
    $$resolveControllerMethod(method, item, ctor, name, router) {
        const caller = "$$resolveControllerMethod";
        const { path, pipes, middlewares: mds } = item;
        if (!path)
            return;
        const { list: pipelist } = pipes;
        const { list: mdsList } = mds;
        this.$logger.trace("core", caller, `add route : [ ${GREEN(method)} ${BLUE(item.path)} @params -> ${CYAN(item.funcParams.map(i => i.key).join(",") || "...")} ]`);
        const middlewares = [...(mdsList || [])];
        const preMiddles = this.$$preparePipes();
        this.$$addPipeMiddlewares(pipelist, middlewares);
        this.$$selectFormParser(item, middlewares);
        this.$$decideFinalStep(item, middlewares, ctor, name);
        this.$$selectFuncMethod(router, method)(path, ...[requestScopeStart(this.$logger, this.$di), ...preMiddles, ...middlewares]);
    }
    $$preparePipes() {
        const pipes = [];
        this.$$addPipeMiddlewares(this._pipes, pipes);
        return pipes;
    }
    $$addPipeMiddlewares(pipelist, middlewares) {
        resolvePipeList(pipelist).forEach(bundle => middlewares.push((ctx, next) => __awaiter(this, void 0, void 0, function* () {
            const { target: pipe } = bundle;
            const scopeId = ctx.state["$$scopeId"];
            const context = this.$rdi.get(controllers_1.Context, scopeId);
            const instance = pipes_1.createPipeInstance(bundle, this.$di.getDepedencies(di_1.getDependencies(pipe), scopeId) || [], context /* getRequestContext(ctx) */);
            const result = yield instance.process();
            if (result) {
                if (result.breakOut === true) {
                    if (result.error)
                        throw result.error;
                }
                else {
                    yield next();
                }
            }
            else {
                yield next();
            }
        })));
    }
    $$useMiddlewares() {
        this._mwares.forEach(([fac, args]) => this.$app.use(fac(...(args || []))));
    }
    $$selectFormParser(route, middlewares) {
        if (route.form && route.form.parser)
            resolveFormParser(middlewares, route, this.$confColls);
    }
    $$decideFinalStep(route, middlewares, constructor, methodName) {
        middlewares.push((ctx) => __awaiter(this, void 0, void 0, function* () {
            const scopeId = ctx.state["$$scopeId"];
            const list = this.$di.getDepedencies(di_1.getDependencies(constructor), scopeId);
            const c = new constructor(...list);
            // c.$$ctx = getRequestContext(ctx);
            c.$$ctx = this.$rdi.get(controllers_1.Context, scopeId);
            c.$$injector = this.$rdi;
            const result = constructor.prototype[methodName].bind(c)(...this.$$parseFuncParams(ctx, route));
            yield resolveResult(ctx, result, this.$configs, null, () => {
                this.$di.dispose(scopeId);
            });
        }));
    }
    $$parseFuncParams(ctx, { funcParams, form }) {
        const querys = (funcParams || []).filter(i => i.key !== null).map(({ key, type, isQuery }) => {
            const pack = isQuery ? ctx.query : ctx.params;
            return !type ? pack[key] : type(pack[key]);
        });
        if (form && form.index >= 0) {
            const { index } = form;
            const staticType = (funcParams || [])[index];
            const resolver = this.$confColls.get(di_1.STATIC_TYPED_RESOLVER);
            querys[index] = !!(resolver && staticType && staticType.type) ?
                resolver.FromObject(ctx.request.body, staticType.type) :
                ctx.request.body;
        }
        return querys;
    }
    $$selectFuncMethod(router, method) {
        let invoke;
        switch (method) {
            case "GET":
            case "POST":
            case "PUT":
            case "DELETE":
            case "PATCH":
            case "OPTIONS":
            case "HEAD":
                invoke = (...args) => router[method.toLowerCase()](...args);
                break;
            default: throw utils_1.invalidParam(`invalid REST method registeration : the method [${method}] is not allowed.`);
        }
        return invoke;
    }
}
exports.BonbonsServer = BonbonsServer;
function logInjectImp(imp) {
    if (!imp)
        return "[undefined]";
    if (imp.name)
        return imp.name;
    if (Object.prototype.toString.call(imp.__proto__) === "[object Function]")
        return "[factory]";
    if (get_1.default(imp, "__proto__", {}).constructor)
        return get_1.default(imp, "__proto__.constructor.name", "[unknown]");
    return "[instance]";
}
function resolvePipeList(list) {
    return (list || []).map(ele => {
        const { target } = ele;
        if (!target) {
            return { target: ele, params: {} };
        }
        else {
            return ele;
        }
    });
}
function resolveInjections(list, injects) {
    (injects || []).forEach(item => {
        if (item instanceof Array) {
            list.push(item);
        }
        else {
            const { token, implement } = item;
            !token ?
                list.push([item, item]) :
                list.push([token, implement]);
        }
    });
}
function resolveFormParser(middlewares, route, configs) {
    const parser = resolveParser(route.form.parser, configs, route.form.options);
    if (parser)
        middlewares.unshift(parser);
}
function resolveParser(type, configs, options) {
    switch (type) {
        // case FormType.MultipleFormData:
        //     return MultiplePartParser().any();
        case private_api_1.FormType.ApplicationJson:
            return resolveParserOptions(di_1.JSON_FORM_OPTIONS, configs, Object.assign({ type: "json" }, options));
        case private_api_1.FormType.UrlEncoded:
            return resolveParserOptions(di_1.URL_FORM_OPTIONS, configs, Object.assign({ type: "form" }, options));
        // case FormType.Raw:
        //   return RawParser(resolveParserOptions(BODY_RAW_PARSER, configs, options));
        case private_api_1.FormType.TextPlain:
            return resolveParserOptions(di_1.TEXT_FORM_OPTIONS, configs, Object.assign({ type: "text" }, options));
        default: return null;
    }
}
function resolveParserOptions(key, configs, options) {
    const { type, extends: extendsV } = options;
    options.enableTypes = [type];
    const etx = options.extendTypes = {};
    etx[type] = extendsV || [];
    delete options.type;
    delete options.extends;
    return private_api_1.KOABodyParser(Object.assign(configs.get(key) || {}, options));
}
function optionAssign(configs, token, newValue) {
    return utils_1.TypeCheck.isFromCustomClass(newValue || {}) ?
        newValue :
        Object.assign(configs.get(token) || {}, newValue);
}
function controllerError(ctlr) {
    return utils_1.invalidParam("Controller to be add is invalid. You can only add the controller been decorated by @Controller(...).", { className: ctlr && ctlr.name });
}
function resolveResult(ctx, result, configs, isSync, finalize) {
    return __awaiter(this, void 0, void 0, function* () {
        const isAsync = isSync === null ? utils_1.TypeCheck.isFromCustomClass(result || {}, Promise) : !isSync;
        let sResult = result;
        if (isAsync) {
            sResult = yield result;
        }
        ctx.type = sResult.type || "text/plain";
        ctx.body = yield sResult.toString(configs);
        finalize();
    });
}
function requestScopeStart(logger, di) {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const scopeId = ctx.state["$$scopeId"] = utils_1.UUID.Create();
        di.createScope(scopeId, { ctx });
        logger.debug("core", "requestScopeStart", `${BLUE(ctx.request.method)} ${CYAN(ctx.request.url)} ${YELLOW(ctx.state["$$scopeId"].substring(0, 8))}`);
        yield next();
    });
}
//# sourceMappingURL=server.js.map