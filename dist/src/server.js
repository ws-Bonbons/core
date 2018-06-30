var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { KOA, KOARouter, KOABodyParser, InjectScope, FormType } from "@bonbons/contracts";
import { DIContainer, CONFIG_COLLECTION, ConfigCollection, DI_CONTAINER, JSON_RESULT_OPTIONS, STATIC_TYPED_RESOLVER, STRING_RESULT_OPTIONS, JSON_FORM_OPTIONS, BODY_PARSE_OPTIONS, TEXT_FORM_OPTIONS, URL_FORM_OPTIONS, ENV_MODE, DEPLOY_MODE } from "@bonbons/di";
import { invalidOperation, invalidParam, TypeCheck, TypedSerializer } from "@bonbons/utils";
import { Context } from "@bonbons/controllers";
import { Options as DEFAULTS } from "@bonbons/options";
import { GLOBAL_LOGGER, BonbonsLogger, GlobalLogger, COLORS, ColorsHelper, InjectService, ConfigService, ERROR_HANDLER, ERROR_PAGE_TEMPLATE, defaultErrorHandler, defaultErrorPageTemplate, ERROR_RENDER_OPRIONS, defaultErrorPageRenderOptions, TPL_RENDER_OPTIONS, defaultViewTplRenderOptions, TPL_RENDER_COMPILER, defaultTplRenderCompilerOptions, RenderService, BonbonsRender, FILE_LOADER, defaultFileLoaderOptions } from "@bonbons/plugins";
import { Injectable } from "@bonbons/decorators";
import { createPipeInstance } from "@bonbons/pipes";
const { green, cyan, red, blue, magenta, yellow } = ColorsHelper;
export class BaseApp {
    get config() { return this["_configs"]; }
    start() { }
}
export class BonbonsServer {
    constructor(config) {
        this._app = new KOA();
        this._ctlrs = [];
        this._configs = new ConfigCollection();
        this._mwares = [];
        this._pipes = [];
        this._scoped = [];
        this._singleton = [];
        this._port = 3000;
        this._isDev = true;
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
            throw invalidOperation("DI token or entry is empty, you shouldn't call BonbonsServer.use<T>(...) without any param.");
        }
        if (!e2 || args.length === 2) {
            this._configs.set(e1, optionAssign(this._configs, e1, e2));
        }
        else {
            const { token, value } = e1;
            this._configs.set(token, optionAssign(this._configs, token, value));
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
    scoped(...args) {
        return this.$$preInject(args[0], args[1], InjectScope.Scoped);
    }
    singleton(...args) {
        return this.$$preInject(args[0], args[1], InjectScope.Singleton);
    }
    getConfigs() {
        return this._configs.get(CONFIG_COLLECTION);
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
        this.$$initDIContainer();
        this.$$preparePipes();
        this.$$useRouters();
        this.$$useMiddlewares();
        this._app.listen(this._port);
        this.$$afterRun();
        if (run) {
            run(this._readonlyConfigs);
        }
        if (!this._isDev) {
            this._clearServer();
        }
        // console.log(this._configs);
    }
    $$afterRun() {
        const { compilerFactory: factory } = this._configs.get(TPL_RENDER_COMPILER);
        this.option(TPL_RENDER_COMPILER, { compiler: factory && factory(this._readonlyConfigs) });
    }
    _clearServer() {
        delete this._app;
        delete this._ctlrs;
        delete this._mwares;
        delete this._pipes;
        delete this._scoped;
        delete this._singleton;
        delete this._port;
        delete this._clearServer;
    }
    $$configsInitialization(config) {
        if (config) {
            this._ctlrs = config.controller || [];
            resolveInjections(this._scoped, config.scoped || []);
            resolveInjections(this._singleton, config.singleton || []);
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
        this.option(ENV_MODE, { mode: "development", trace: true });
        this.option(DEPLOY_MODE, { port: 3000 });
        this.option(CONFIG_COLLECTION, this._configs);
        this.option(DI_CONTAINER, new DIContainer());
        this.option(FILE_LOADER, defaultFileLoaderOptions);
        this.option(TPL_RENDER_COMPILER, defaultTplRenderCompilerOptions);
        this.option(ERROR_HANDLER, defaultErrorHandler);
        this.option(ERROR_PAGE_TEMPLATE, defaultErrorPageTemplate);
        this.option(ERROR_RENDER_OPRIONS, defaultErrorPageRenderOptions);
        this.option(TPL_RENDER_OPTIONS, defaultViewTplRenderOptions);
        this.option(GLOBAL_LOGGER, BonbonsLogger);
        this.option(STATIC_TYPED_RESOLVER, TypedSerializer);
        this.option(JSON_RESULT_OPTIONS, DEFAULTS.jsonResult);
        this.option(STRING_RESULT_OPTIONS, DEFAULTS.stringResult);
        this.option(BODY_PARSE_OPTIONS, { enableTypes: ["json", "form"] });
        this.option(JSON_FORM_OPTIONS, { jsonLimit: "1mb" });
        this.option(TEXT_FORM_OPTIONS, { textLimit: "1mb" });
        this.option(URL_FORM_OPTIONS, { formLimit: "56kb" });
    }
    $$useCommonOptions() {
        const { mode } = this._configs.get(ENV_MODE);
        this._isDev = mode === "development";
        const { port } = this._configs.get(DEPLOY_MODE);
        this._port = port || 3000;
        this._readonlyConfigs = { get: this._configs.get.bind(this._configs) };
        this.singleton(ConfigService, () => this._readonlyConfigs);
        this.singleton(RenderService, () => new BonbonsRender(this._readonlyConfigs));
        const handler = this._configs.get(ERROR_HANDLER);
        this._mwares.unshift([handler, [this._readonlyConfigs]]);
    }
    $$initLogger() {
        const Logger = Injectable()(this._configs.get(GLOBAL_LOGGER));
        const env = this._configs.get(ENV_MODE);
        this._logger = new Logger(env);
        this.singleton(GlobalLogger, () => this._logger);
        this._logger.debug("core", this.$$initLogger.name, `logger init : [ type -> ${green(Logger.name)} ].`);
        this._logger.debug("core", this.$$initLogger.name, "-----------------------");
    }
    $$initDLookup() {
        this._di = this._configs.get(DI_CONTAINER);
        this._readonlyDI = { get: this._di.get.bind(this._di) };
        this.singleton(InjectService, () => this._readonlyDI);
    }
    $$initDIContainer() {
        this._logger.debug("core", this.$$initDIContainer.name, "init DI container.");
        this._logger.debug("core", this.$$initDIContainer.name, `scoped inject entry count : [ ${green(this._scoped.length)} ].`);
        this._scoped.forEach(([tk, imp]) => {
            this.$$injectaFinally(tk, imp, InjectScope.Scoped);
            this._logger.trace("core", this.$$initDIContainer.name, `relation add : [ @${cyan(tk.name)} -> @${blue(logInjectImp(imp))} ].`);
        });
        this._logger.debug("core", this.$$initDIContainer.name, `singleton inject entry count : [ ${green(this._singleton.length)} ].`);
        this._singleton.forEach(([tk, imp]) => {
            this.$$injectaFinally(tk, imp, InjectScope.Singleton);
            this._logger.trace("core", this.$$initDIContainer.name, `relation add : [ @${cyan(tk.name)} -> @${blue(logInjectImp(imp))} ].`);
        });
        this._di.complete();
        this._logger.debug("core", this.$$initDIContainer.name, `complete with di container : [ total injectable count -> ${green(this._di.count)} ].`);
        this._logger.debug("core", this.$$initDIContainer.name, "-----------------------");
    }
    $$preInject(provide, classType, type) {
        if (!provide)
            return this;
        type = type || InjectScope.Singleton;
        type === InjectScope.Scoped ?
            this._scoped.push([provide, classType || provide]) :
            this._singleton.push([provide, classType || provide]);
        return this;
    }
    $$injectaFinally(provide, classType, type) {
        if (!provide)
            return this;
        type = type || InjectScope.Singleton;
        this._di.register(provide, classType || provide, type);
        return this;
    }
    $$useRouters() {
        this._logger.debug("core", this.$$useRouters.name, `start build routers : [ count -> ${green(this._ctlrs.length)} ]`);
        const mainRouter = new KOARouter();
        this._ctlrs.forEach(controllerClass => {
            const proto = controllerClass.prototype;
            const { router } = (proto.getConfig && proto.getConfig());
            const thisRouter = new KOARouter({ prefix: router.prefix });
            this._logger.debug("core", this.$$useRouters.name, `register ${yellow(controllerClass.name)} : [ @prefix -> ${cyan(router.prefix)} @methods -> ${COLORS.green}${Object.keys(router.routes).length}${COLORS.reset} ]`);
            Object.keys(router.routes).forEach(methodName => {
                const item = router.routes[methodName];
                const { allowMethods } = item;
                if (!allowMethods)
                    throw invalidOperation("invalid method, you must set a HTTP method for a route.");
                allowMethods.forEach(each => this.$$resolveControllerMethod(each, item, controllerClass, methodName, thisRouter));
            });
            mainRouter.use(thisRouter.routes()).use(thisRouter.allowedMethods());
        });
        this._logger.debug("core", this.$$useRouters.name, "app routers initialization completed.");
        this._logger.debug("core", this.$$useRouters.name, "-----------------------");
        const { routes, allowedMethods } = mainRouter;
        this.use(routes.bind(mainRouter));
        this.use(allowedMethods.bind(mainRouter));
    }
    $$resolveControllerMethod(method, item, ctor, name, router) {
        const { path, pipes, middlewares: mds } = item;
        if (!path)
            return;
        const { list: pipelist } = pipes;
        const { list: mdsList } = mds;
        this._logger.trace("core", this.$$resolveControllerMethod.name, `add route : [ ${green(method)} ${blue(item.path)} @params -> ${cyan(item.funcParams.map(i => i.key).join(",") || "-")} ]`);
        const middlewares = [...(mdsList || [])];
        this.$$addPipeMiddlewares(pipelist, middlewares);
        this.$$selectFormParser(item, middlewares);
        this.$$decideFinalStep(item, middlewares, ctor, name);
        this.$$selectFuncMethod(router, method)(path, ...middlewares);
    }
    $$preparePipes() {
        const pipes = [];
        this.$$addPipeMiddlewares(this._pipes, pipes);
        pipes.forEach(pipe => this.use(() => pipe));
    }
    $$addPipeMiddlewares(pipelist, middlewares) {
        resolvePipeList(pipelist).forEach(bundle => middlewares.push((ctx, next) => __awaiter(this, void 0, void 0, function* () {
            const { target: pipe } = bundle;
            const instance = createPipeInstance(bundle, this._di.resolveDeps(pipe) || [], getRequestContext(ctx));
            return instance.process(next);
        })));
    }
    $$useMiddlewares() {
        this._mwares.forEach(([fac, args]) => this._app.use(fac(...(args || []))));
    }
    $$selectFormParser(route, middlewares) {
        if (route.form && route.form.parser)
            resolveFormParser(middlewares, route, this._configs);
    }
    $$decideFinalStep(route, middlewares, constructor, methodName) {
        middlewares.push((ctx) => __awaiter(this, void 0, void 0, function* () {
            const list = this._di.resolveDeps(constructor);
            const c = new constructor(...list);
            c.$$ctx = getRequestContext(ctx);
            c.$$injector = this._readonlyDI;
            const result = constructor.prototype[methodName].bind(c)(...this.$$parseFuncParams(ctx, route));
            yield resolveResult(ctx, result, this._readonlyConfigs);
        }));
    }
    $$parseFuncParams(ctx, route) {
        const querys = (route.funcParams || []).map(({ key, type, isQuery }) => {
            const pack = isQuery ? ctx.query : ctx.params;
            return !type ? pack[key] : type(pack[key]);
        });
        if (route.form && route.form.index >= 0) {
            const { index } = route.form;
            const staticType = (route.funcParams || [])[index];
            const resolver = this._configs.get(STATIC_TYPED_RESOLVER);
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
            default: throw invalidParam(`invalid REST method registeration : the method [${method}] is not allowed.`);
        }
        return invoke;
    }
}
function logInjectImp(imp) {
    if (imp.name) {
        return imp.name;
    }
    if (Object.prototype.toString.call(imp.__proto__) === "[object Function]") {
        return "[factory]";
    }
    if (imp.__proto__.constructor) {
        return imp.__proto__.constructor.name;
    }
    return "[instance]";
}
function getRequestContext(ctx) {
    return ctx.state["$$ctx"] || (ctx.state["$$ctx"] = new Context(ctx));
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
    // console.log(options);
    switch (type) {
        // case FormType.MultipleFormData:
        //     return MultiplePartParser().any();
        case FormType.ApplicationJson:
            return resolveParserOptions(JSON_FORM_OPTIONS, configs, Object.assign({ type: "json" }, options));
        case FormType.UrlEncoded:
            return resolveParserOptions(URL_FORM_OPTIONS, configs, Object.assign({ type: "form" }, options));
        // case FormType.Raw:
        //   return RawParser(resolveParserOptions(BODY_RAW_PARSER, configs, options));
        case FormType.TextPlain:
            return resolveParserOptions(TEXT_FORM_OPTIONS, configs, Object.assign({ type: "text" }, options));
        default: return null;
    }
}
function resolveParserOptions(key, configs, options) {
    // console.log(options);
    const { type, extends: extendsV } = options;
    options.enableTypes = [type];
    const etx = options.extendTypes = {};
    etx[type] = extendsV || [];
    delete options.type;
    delete options.extends;
    // console.log(JSON.stringify(Object.assign(configs.get(key) || {}, options)));
    return KOABodyParser(Object.assign(configs.get(key) || {}, options));
}
function optionAssign(configs, token, newValue) {
    return TypeCheck.isFromCustomClass(newValue || {}) ?
        newValue :
        Object.assign(configs.get(token) || {}, newValue);
}
function controllerError(ctlr) {
    return invalidParam("Controller to be add is invalid. You can only add the controller been decorated by @Controller(...).", { className: ctlr && ctlr.name });
}
function resolveResult(ctx, result, configs, isSync) {
    return __awaiter(this, void 0, void 0, function* () {
        const isAsync = isSync === undefined ? TypeCheck.isFromCustomClass(result || {}, Promise) : !isSync;
        if (isAsync) {
            result.then(r => resolveResult(ctx, r, configs, true));
        }
        else {
            if (!result) {
                ctx.body = "";
                return;
            }
            if (typeof result === "string") {
                ctx.body = result;
                return;
            }
            ctx.type = result.type || "text/plain";
            ctx.body = yield result.toString(configs);
        }
    });
}
//# sourceMappingURL=server.js.map