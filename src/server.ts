import {
  IBonbonsServer as IServer,
  MiddlewaresFactory,
  BonbonsServerConfig,
  BonbonsInjectEntry,
  KOAMiddlewareTuple,
  InjectableServiceType,
  BonbonsPipeEntry,
  IRoute,
  UnionBonbonsResult as IResult,
  IBonbonsControllerMetadata as ControllerMetadata,
  IBonbonsMethodResult as SyncResult,
  IMethodResult,
  BonbonsDeptFactory as InjectFactory,
  ImplementDIValue,
  BonbonsEntry as Entry,
  BonbonsToken as Token,
  BonbonsConfigCollection as IConfigs,
  BonbonsDIContainer as IDIContainer,
  BonbonsToken,
  ReadonlyDIContainer as ReadonlyDI,
  ConfigsCollection as ReadonlyConfigs,
  KOAMiddleware,
  KOA,
  KOAContext,
  KOARouter,
  KOABodyParser,
  KOABodyParseOptions,
  InjectScope,
  InjectableToken,
  ImplementToken,
  FormType,
  IConstructor,
  Async,
  BaseFormOptions,
  IPipeBundle
} from "@bonbons/contracts";
import {
  DIContainer,
  CONFIG_COLLECTION,
  ConfigCollection,
  DI_CONTAINER,
  JSON_RESULT_OPTIONS,
  STATIC_TYPED_RESOLVER,
  STRING_RESULT_OPTIONS,
  JSON_FORM_OPTIONS,
  BODY_PARSE_OPTIONS,
  TEXT_FORM_OPTIONS,
  URL_FORM_OPTIONS,
  ENV_MODE,
  DEPLOY_MODE
} from "@bonbons/di";
import { invalidOperation, invalidParam, TypeCheck, TypedSerializer } from "@bonbons/utils";
import { Context } from "@bonbons/controllers";
import { Options as DEFAULTS } from "@bonbons/options";
import {
  GLOBAL_LOGGER,
  BonbonsLogger,
  GlobalLogger,
  COLORS,
  ColorsHelper,
  InjectService,
  ConfigService,
  ERROR_HANDLER,
  ERROR_PAGE_TEMPLATE,
  defaultErrorHandler,
  defaultErrorPageTemplate,
  ERROR_RENDER_OPRIONS,
  defaultErrorPageRenderOptions,
  TPL_RENDER_OPTIONS,
  defaultViewTplRenderOptions,
  TPL_RENDER_COMPILER,
  defaultTplRenderCompilerOptions,
  RenderService,
  BonbonsRender,
  FILE_LOADER,
  defaultFileLoaderOptions
} from "@bonbons/plugins";
import { Injectable } from "@bonbons/decorators";
import { createPipeInstance } from "@bonbons/pipes";

const { green, cyan, red, blue, magenta, yellow } = ColorsHelper;

export abstract class BaseApp {
  protected readonly logger: GlobalLogger;
  protected get config(): ReadonlyConfigs { return this["_configs"]; }
  public start(): void { }
}

export class BonbonsServer implements IServer {

  public static Create() { return new BonbonsServer(); }

  public static get New() { return BonbonsServer.Create(); }

  /**
   * DI container
   * ---
   * could be change by set option DI_CONTAINER
   *
   * @description
   * @private
   * @type {IDIContainer}
   * @memberof BonbonsServer
   */
  private _di!: IDIContainer;
  private _readonlyDI!: ReadonlyDI;
  private _readonlyConfigs!: ReadonlyConfigs;
  private _logger!: GlobalLogger;

  private _app = new KOA();
  private _ctlrs: IConstructor<any>[] = [];
  private _configs: IConfigs = new ConfigCollection();
  private _mwares: KOAMiddlewareTuple[] = [];
  private _pipes: BonbonsPipeEntry[] = [];
  private _scoped: [InjectableToken<any>, ImplementDIValue][] = [];
  private _singleton: [InjectableToken<any>, ImplementDIValue][] = [];
  private _port = 3000;
  private _isDev = true;

  constructor(config?: BonbonsServerConfig) {
    this.$$defaultOptionsInitialization();
    this.$$configsInitialization(config);
  }

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
  public use(mfac: MiddlewaresFactory, ...params: any[]): BonbonsServer {
    this._mwares.push([mfac, params || []]);
    return this;
  }

  public pipe(pipe: BonbonsPipeEntry): BonbonsServer {
    this._pipes.push(pipe);
    return this;
  }

  /**
   * Set an option
   * ---
   * Set an option with format entry{@BonbonsEntry<T>}.
   *
   * @description
   * @author Big Mogician
   * @template T
   * @param {BonbonsEntry<T>} entry BonbonsEntry<T>
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public option<T>(entry: Entry<T>): BonbonsServer;
  /**
   * Set an option
   * ---
   * Set an option with token and provided value.
   *
   * @description
   * @author Big Mogician
   * @template T
   * @param {Token<T>} token
   * @param {T} value
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public option<T>(token: Token<T>, value: T): BonbonsServer;
  public option(...args: any[]): BonbonsServer {
    const [e1, e2] = args;
    if (!e1) {
      throw invalidOperation("DI token or entry is empty, you shouldn't call BonbonsServer.use<T>(...) without any param.");
    }
    if (!e2 || args.length === 2) {
      this._configs.set(e1, optionAssign(this._configs, e1, e2));
    } else {
      const { token, value } = <Entry<any>>e1;
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
  public controller<T>(ctlr: IConstructor<T>): BonbonsServer {
    if (!ctlr || !(<IConstructor<T>>ctlr).prototype.__valid) throw controllerError(ctlr);
    this._ctlrs.push(ctlr);
    return this;
  }

  /**
   * Set a scoped servics
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a scoped service with constructor.
   * All scoped services will be created new instance in different request pipe
   *
   * @description
   * @author Big Mogician
   * @template T
   * @param {IConstructor<T>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public scoped<T>(srv: IConstructor<T>): BonbonsServer;
  /**
   * Set a scoped servics
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a scoped service with injectable token (such abstract class,
   * but not the typescript interface because there's no interface in
   * the javascript runtime) and implement service constructor. All
   * scoped services will be created new instance in different request pipe.
   *
   * @description
   * @author Big Mogician
   * @template B
   * @template T
   * @param {InjectableToken<B>} token
   * @param {ImplementToken<T>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public scoped<B, T>(token: InjectableToken<B>, srv: ImplementToken<T>): BonbonsServer;
  /**
   * Set a scoped servics
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a scoped service with injectable token (such abstract class,
   * but not the typescript interface because there's no interface in
   * the javascript runtime) and implement service instance factory
   * ( pure function with no side effects).
   * All scoped services will be created new instance in different request pipe.
   *
   * @description
   * @author Big Mogician
   * @template B
   * @template T
   * @param {InjectableToken<B>} token
   * @param {InjectFactory<T>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public scoped<B, T>(token: InjectableToken<B>, srv: InjectFactory<T>): BonbonsServer;
  /**
   * Set a scoped servics
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a scoped service with injectable token (such abstract class,
   * but not the typescript interface because there's no interface in
   * the javascript runtime) and a well-created implement service instance.
   * All scoped services will be created new
   * instance in different request pipe (but injecting by instance means
   * the instance may be changed in runtime, so please be careful. If you
   * want to prevent this situation, use a service factory here).
   *
   * @description
   * @author Big Mogician
   * @template T
   * @param {InjectableToken} token
   * @param {T} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public scoped<B, T>(token: InjectableToken<B>, srv: T): BonbonsServer;
  public scoped(...args: any[]): BonbonsServer {
    return this.$$preInject(args[0], args[1], InjectScope.Scoped);
  }

  /**
   * Set a singleton service
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a singleton service with constructor.
   * All singleton services will use unique instance throught different request pipes.
   *
   * @description
   * @author Big Mogician
   * @template T
   * @param {IConstructor<T>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public singleton<T>(srv: IConstructor<T>): BonbonsServer;
  /**
   * Set a singleton service
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a singleton service with injectable token (such abstract class,
   * but not the typescript interface because there's no interface in
   * the javascript runtime) and implement service constructor.
   * All singleton services will use unique
   * instance throught different request pipes.
   *
   * @description
   * @author Big Mogician
   * @template B
   * @template T
   * @param {InjectableToken<B>} token
   * @param {ImplementToken<T>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public singleton<B, T>(token: InjectableToken<B>, srv: ImplementToken<T>): BonbonsServer;
  /**
   * Set a singleton service
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a singleton service with injectable token (such abstract class,
   * but not the typescript interface because there's no interface in
   * the javascript runtime) and implement service factory ( pure function with no side effects).
   * All singleton services will use unique
   * instance throught different request pipes.
   *
   * @description
   * @author Big Mogician
   * @template B
   * @template T
   * @param {InjectableToken<B>} token
   * @param {InjectFactory<T>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public singleton<B, T>(token: InjectableToken<B>, srv: InjectFactory<T>): BonbonsServer;
  /**
   * Set a singleton service
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a singleton service with injectable token (such abstract class,
   * but not the typescript interface because there's no interface in
   * the javascript runtime) and a well-created implement service instance.
   * All singleton services will use unique
   * instance throught different request pipes.
   *
   * @description
   * @author Big Mogician
   * @template T
   * @param {InjectableToken} token
   * @param {T} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public singleton<B, T>(token: InjectableToken<B>, srv: T): BonbonsServer;
  public singleton(...args: any[]): BonbonsServer {
    return this.$$preInject(args[0], args[1], InjectScope.Singleton);
  }

  public getConfigs() {
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
  public start(run?: (configs: ReadonlyConfigs) => void): void {
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

  private $$afterRun() {
    const { compilerFactory: factory } = this._configs.get(TPL_RENDER_COMPILER);
    this.option(TPL_RENDER_COMPILER, { compiler: factory && factory(this._readonlyConfigs) });
  }

  private _clearServer = () => {
    delete this._app;
    delete this._ctlrs;
    delete this._mwares;
    delete this._pipes;
    delete this._scoped;
    delete this._singleton;
    delete this._port;
    delete this._clearServer;
  }

  private $$configsInitialization(config?: BonbonsServerConfig) {
    if (config) {
      this._ctlrs = config.controller || [];
      resolveInjections(this._scoped, config.scoped || []);
      resolveInjections(this._singleton, config.singleton || []);
      this._pipes.push(...(config.pipes || []));
      (config.middlewares || []).forEach(item => {
        if (item instanceof Array) {
          this._mwares.push([item[0], item[1]]);
        } else {
          const { factory, params } = <any>item;
          factory ?
            this._mwares.push([factory, params]) :
            this._mwares.push([<any>item, []]);
        }
      });
      (config.options || []).forEach(item => {
        if (item instanceof Array) {
          this.option(item[0], item[1]);
        } else {
          this.option(item.token, item.value);
        }
      });
    }
  }

  private $$defaultOptionsInitialization() {
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

  private $$useCommonOptions() {
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

  private $$initLogger() {
    const Logger = Injectable()(this._configs.get(GLOBAL_LOGGER));
    const env = this._configs.get(ENV_MODE);
    this._logger = new Logger(env);
    this.singleton(GlobalLogger, () => this._logger);
    this._logger.debug("core", this.$$initLogger.name, `logger init : [ type -> ${green(Logger.name)} ].`);
    this._logger.debug("core", this.$$initLogger.name, "-----------------------");
  }

  private $$initDLookup() {
    this._di = this._configs.get(DI_CONTAINER);
    this._readonlyDI = { get: this._di.get.bind(this._di) };
    this.singleton(InjectService, () => this._readonlyDI);
  }

  private $$initDIContainer() {
    this._logger.debug("core", this.$$initDIContainer.name, "init DI container.");
    this._logger.debug("core", this.$$initDIContainer.name, `scoped inject entry count : [ ${green(this._scoped.length)} ].`);
    this._scoped.forEach(([tk, imp]) => {
      this.$$injectaFinally(tk, imp, InjectScope.Scoped);
      this._logger.trace("core", this.$$initDIContainer.name, `relation add : [ @${cyan((<any>tk).name)} -> @${blue(logInjectImp(imp))} ].`);
    });
    this._logger.debug("core", this.$$initDIContainer.name, `singleton inject entry count : [ ${green(this._singleton.length)} ].`);
    this._singleton.forEach(([tk, imp]) => {
      this.$$injectaFinally(tk, imp, InjectScope.Singleton);
      this._logger.trace("core", this.$$initDIContainer.name, `relation add : [ @${cyan((<any>tk).name)} -> @${blue(logInjectImp(imp))} ].`);
    });
    this._di.complete();
    this._logger.debug("core", this.$$initDIContainer.name, `complete with di container : [ total injectable count -> ${green(this._di.count)} ].`);
    this._logger.debug("core", this.$$initDIContainer.name, "-----------------------");
  }

  private $$preInject(provide: any, type: InjectScope): BonbonsServer;
  private $$preInject(provide: any, classType: any, type?: InjectScope): BonbonsServer;
  private $$preInject(provide: any, classType?: any, type?: InjectScope): BonbonsServer {
    if (!provide) return this;
    type = type || InjectScope.Singleton;
    type === InjectScope.Scoped ?
      this._scoped.push([provide, classType || provide]) :
      this._singleton.push([provide, classType || provide]);
    return this;
  }

  private $$injectaFinally(provide: any, type: InjectScope): BonbonsServer;
  private $$injectaFinally(provide: any, classType: any, type?: InjectScope): BonbonsServer;
  private $$injectaFinally(provide: any, classType?: any, type?: InjectScope): BonbonsServer {
    if (!provide) return this;
    type = type || InjectScope.Singleton;
    this._di.register(provide, classType || provide, type);
    return this;
  }

  private $$useRouters() {
    this._logger.debug("core", this.$$useRouters.name, `start build routers : [ count -> ${green(this._ctlrs.length)} ]`);
    const mainRouter = new KOARouter();
    this._ctlrs.forEach(controllerClass => {
      const proto = controllerClass.prototype;
      const { router } = <ControllerMetadata>(proto.getConfig && proto.getConfig());
      const thisRouter = new KOARouter({ prefix: router.prefix as string });
      this._logger.debug("core", this.$$useRouters.name,
        `register ${yellow(controllerClass.name)} : [ @prefix -> ${cyan(router.prefix)} @methods -> ${COLORS.green}${Object.keys(router.routes).length}${COLORS.reset} ]`);
      Object.keys(router.routes).forEach(methodName => {
        const item = router.routes[methodName];
        const { allowMethods } = item;
        if (!allowMethods) throw invalidOperation("invalid method, you must set a HTTP method for a route.");
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

  private $$resolveControllerMethod(method: string, item: IRoute, ctor: IConstructor<any>, name: string, router: KOARouter) {
    const { path, pipes, middlewares: mds } = item;
    if (!path) return;
    const { list: pipelist } = pipes;
    const { list: mdsList } = mds;
    this._logger.trace("core", this.$$resolveControllerMethod.name,
      `add route : [ ${green(method)} ${blue(item.path)} @params -> ${cyan(item.funcParams.map(i => i.key).join(",") || "-")} ]`);
    const middlewares: KOAMiddleware[] = [...(mdsList || [])];
    this.$$addPipeMiddlewares(pipelist, middlewares);
    this.$$selectFormParser(item, middlewares);
    this.$$decideFinalStep(item, middlewares, ctor, name);
    this.$$selectFuncMethod(router, method)(path, ...middlewares);
  }

  private $$preparePipes() {
    const pipes: KOAMiddleware[] = [];
    this.$$addPipeMiddlewares(this._pipes, pipes);
    pipes.forEach(pipe => this.use(() => pipe));
  }

  private $$addPipeMiddlewares(pipelist: BonbonsPipeEntry[], middlewares: ((context: KOAContext, next: () => Async<any>) => any)[]) {
    resolvePipeList(pipelist).forEach(bundle => middlewares.push(async (ctx, next) => {
      const { target: pipe } = bundle;
      const instance = createPipeInstance(bundle, this._di.resolveDeps(pipe) || [], getRequestContext(ctx));
      return instance.process(next);
    }));
  }

  private $$useMiddlewares() {
    this._mwares.forEach(([fac, args]) => this._app.use(fac(...(args || []))));
  }

  private $$selectFormParser(route: IRoute, middlewares: any[]) {
    if (route.form && route.form.parser) resolveFormParser(middlewares, route, this._configs);
  }

  private $$decideFinalStep(route: IRoute, middlewares: KOAMiddleware[], constructor: any, methodName: string) {
    middlewares.push(async (ctx) => {
      const list = this._di.resolveDeps(constructor);
      const c = new constructor(...list);
      c.$$ctx = getRequestContext(ctx);
      c.$$injector = this._readonlyDI;
      const result: IResult = constructor.prototype[methodName].bind(c)(...this.$$parseFuncParams(ctx, route));
      await resolveResult(ctx, result, this._readonlyConfigs);
    });
  }

  private $$parseFuncParams(ctx: KOAContext, route: IRoute) {
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

  private $$selectFuncMethod(router: KOARouter, method: string) {
    let invoke: (...args: any[]) => void;
    switch (method) {
      case "GET":
      case "POST":
      case "PUT":
      case "DELETE":
      case "PATCH":
      case "OPTIONS":
      case "HEAD": invoke = (...args: any[]) => router[method.toLowerCase()](...args); break;
      default: throw invalidParam(`invalid REST method registeration : the method [${method}] is not allowed.`);
    }
    return invoke;
  }

}

function logInjectImp(imp: any) {
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

function getRequestContext(ctx: KOAContext) {
  return ctx.state["$$ctx"] || (ctx.state["$$ctx"] = new Context(ctx));
}

function resolvePipeList(list: BonbonsPipeEntry[]) {
  return (list || []).map(ele => {
    const { target } = <IPipeBundle<any>>ele;
    if (!target) {
      return { target: <IConstructor<any>>ele, params: {} };
    } else {
      return <IPipeBundle<any>>ele;
    }
  });
}

function resolveInjections(list: [InjectableToken<any>, ImplementDIValue][], injects: InjectableServiceType[]) {
  (injects || []).forEach(item => {
    if (item instanceof Array) {
      list.push(item);
    } else {
      const { token, implement } = <BonbonsInjectEntry<any>>item;
      !token ?
        list.push(<any>[item, item]) :
        list.push([token, implement]);
    }
  });
}

function resolveFormParser(middlewares: any[], route: IRoute, configs: IConfigs) {
  const parser = resolveParser(route.form.parser, configs, route.form.options);
  if (parser) middlewares.unshift(parser);
}

function resolveParser(type: FormType, configs: IConfigs, options?: BaseFormOptions) {
  // console.log(options);
  switch (type) {
    // case FormType.MultipleFormData:
    //     return MultiplePartParser().any();
    case FormType.ApplicationJson:
      return resolveParserOptions(JSON_FORM_OPTIONS, configs, { type: "json", ...options });
    case FormType.UrlEncoded:
      return resolveParserOptions(URL_FORM_OPTIONS, configs, { type: "form", ...options });
    // case FormType.Raw:
    //   return RawParser(resolveParserOptions(BODY_RAW_PARSER, configs, options));
    case FormType.TextPlain:
      return resolveParserOptions(TEXT_FORM_OPTIONS, configs, { type: "text", ...options });
    default: return null;
  }
}

function resolveParserOptions<T>(key: BonbonsToken<T>, configs: IConfigs, options: BaseFormOptions): KOAMiddleware {
  // console.log(options);
  const { type, extends: extendsV } = options;
  (<any>options).enableTypes = [type];
  const etx = (<KOABodyParseOptions>options).extendTypes = {};
  etx[(<string>type)] = extendsV || [];
  delete options.type;
  delete options.extends;
  // console.log(JSON.stringify(Object.assign(configs.get(key) || {}, options)));
  return KOABodyParser(Object.assign(configs.get(key) || {}, options));
}

function optionAssign(configs: IConfigs, token: any, newValue: any) {
  return TypeCheck.isFromCustomClass(newValue || {}) ?
    newValue :
    Object.assign(configs.get(token) || {}, newValue);
}

function controllerError(ctlr: any) {
  return invalidParam("Controller to be add is invalid. You can only add the controller been decorated by @Controller(...).", { className: ctlr && ctlr.name });
}

async function resolveResult(ctx: KOAContext, result: IResult, configs: ReadonlyConfigs, isSync?: boolean) {
  const isAsync = isSync === undefined ? TypeCheck.isFromCustomClass(result || {}, Promise) : !isSync;
  if (isAsync) {
    (<Promise<SyncResult>>result).then(r => resolveResult(ctx, r, configs, true));
  } else {
    if (!result) { ctx.body = ""; return; }
    if (typeof result === "string") { ctx.body = result; return; }
    ctx.type = (<IMethodResult>result).type || "text/plain";
    ctx.body = await (<IMethodResult>result).toString(configs);
  }
}
