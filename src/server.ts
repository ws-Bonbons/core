import {
  BonbonsConfigCollection as SourceConfigs,
  BonbonsDIContainer as SourceDI,
  InjectableToken as IJTK,
  BonbonsDeptFactory as IJTFC,
  ImplementToken as IMPK,
  ImplementDIValue as IMPDIV,
  BonbonsEntry as Entry,
  BonbonsToken as Token,
  IBonbonsServer as IServer,
  BonbonsServerConfig as ServerConfig,
  BonbonsInjectEntry as InjectEntry,
  InjectableServiceType as InjectableType,
  BonbonsPipeEntry as PipeEntry,
  UnionBonbonsResult as IResult,
  IBonbonsControllerMetadata as ControllerMetadata,
  IBonbonsMethodResult as SyncResult,
  KOAMiddlewareTuple as MiddlewareTuple,
  ReadonlyDIContainer as ReadonlyDI,
  IMethodResult,
  KOAMiddleware,
  KOAContext,
  KOARouter,
  KOABodyParseOptions,
  IPipeBundle,
  IRoute,
  MiddlewaresFactory,
  InjectScope,
  KOA,
  KOABodyParser,
  FormType,
  IBonbonsController,
  InjectToken,
  ScopeID
} from "@bonbons/contracts/dist/src/private-api";
import { getDependencies, ConfigCollection, DIContainer } from "@bonbons/di/dist/src/private-api";
import {
  ColorsHelper,
  COLORS,
  BonbonsLogger
} from "@bonbons/plugins/dist/src/private-api";
import { createPipeInstance } from "@bonbons/pipes/dist/src/private-api";
import {
  Constructor,
  Async,
  BaseFormOptions
} from "@bonbons/contracts";
import {
  ConfigsCollection,
  CONFIG_COLLECTION,
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
import { invalidOperation, invalidParam, TypeCheck, TypedSerializer, UUID } from "@bonbons/utils";
import { Context } from "@bonbons/controllers";
import { Options as DEFAULTS } from "@bonbons/options";
import {
  Logger,
  InjectService,
  ConfigService,
  GLOBAL_LOGGER,
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

const { red, green, yellow, cyan, blue, magenta } = ColorsHelper;

export abstract class BaseApp {
  protected readonly logger: Logger;
  protected get config(): ConfigsCollection { return this["_configs"]; }
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
   * @type {SourceDI}
   * @memberof BonbonsServer
   */
  private $di!: SourceDI;
  private $rdi!: ReadonlyDI;
  private $configs!: ConfigsCollection;
  private $logger!: Logger;

  private $app = new KOA();
  private $confColls: SourceConfigs = new ConfigCollection();

  private $port = 3000;
  private $is_dev = true;

  private _ctlrs: Constructor<any>[] = [];
  private _mwares: MiddlewareTuple[] = [];
  private _pipes: PipeEntry[] = [];
  private _renews: [IJTK<any>, IMPDIV][] = [];
  private _scopeds: [IJTK<any>, IMPDIV][] = [];
  private _singletons: [IJTK<any>, IMPDIV][] = [];

  constructor(config?: ServerConfig) {
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

  public pipe(pipe: PipeEntry): BonbonsServer {
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
   * @param {BonbonsEntry<Partial<T>|T>} entry BonbonsEntry<T>
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public option<T>(entry: Entry<Partial<T> | T>): BonbonsServer;
  /**
   * Set an option
   * ---
   * Set an option with token and provided value.
   *
   * @description
   * @author Big Mogician
   * @template T
   * @param {Token<T>} token
   * @param {Partial<T>} value
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public option<T>(token: Token<T>, value: Partial<T> | T): BonbonsServer;
  public option(...args: any[]): BonbonsServer {
    const [e1, e2] = args;
    if (!e1) {
      throw invalidOperation("DI token or entry is empty, you shouldn't call BonbonsServer.use<T>(...) without any param.");
    }
    if (!e2 || args.length === 2) {
      this.$confColls.set(e1, optionAssign(this.$confColls, e1, e2));
    } else {
      const { token, value } = <Entry<any>>e1;
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
  public controller<T>(ctlr: Constructor<T>): BonbonsServer {
    if (!ctlr || !(<IBonbonsController>ctlr.prototype).__valid) throw controllerError(ctlr);
    this._ctlrs.push(ctlr);
    return this;
  }

  /**
   * Set a renew service
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a renew service with constructor.
   * All renew services will be created new instance anywhere and everytime.
   *
   * @description
   * @author Big Mogician
   * @template TInject
   * @param {Constructor<TInject>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public renew<TInject>(srv: Constructor<TInject>): BonbonsServer;
  /**
   * Set a renew service
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a renew service with injectable token (such abstract class,
   * but not the typescript interface because there's no interface in
   * the javascript runtime) and implement service constructor. All
   * All renew services will be created new instance anywhere and everytime.
   *
   * @description
   * @author Big Mogician
   * @template TToken
   * @template TImplement
   * @param {InjectableToken<TToken>} token
   * @param {ImplementToken<TImplement>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public renew<TToken, TImplement>(token: IJTK<TToken>, srv: IMPK<TImplement>): BonbonsServer;
  /**
   * Set a renew service
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a renew service with injectable token (such abstract class,
   * but not the typescript interface because there's no interface in
   * the javascript runtime) and implement service instance factory
   * ( pure function with no side effects).
   * All renew services will be created new instance anywhere and everytime.
   *
   * @description
   * @author Big Mogician
   * @template TToken
   * @template TImplement
   * @param {InjectableToken<TToken>} token
   * @param {InjectFactory<TImplement>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public renew<TToken, TImplement>(token: IJTK<TToken>, srv: IJTFC<TImplement>): BonbonsServer;
  /**
   * Set a renew service
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a renew service with injectable token (such abstract class,
   * but not the typescript interface because there's no interface in
   * the javascript runtime) and a well-created implement service instance.
   * All renew services will be created new
   * instance everytime and anywhere (but injecting by instance means
   * the instance may be changed in runtime, so please be careful. If you
   * want to prevent this situation, use a service factory here).
   *
   * @description
   * @author Big Mogician
   * @template TInject
   * @template TImplement
   * @param {InjectableToken<TToken>} token
   * @param {TImplement} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public renew<TToken, TImplement>(token: IJTK<TToken>, srv: TImplement): BonbonsServer;
  public renew(...args: any[]): BonbonsServer {
    return this.$$preInject(args[0], args[1], InjectScope.New);
  }

  /**
   * Set a scoped service
   * ---
   * * service should be decorated by @Injectable(...)
   *
   * Set a scoped service with constructor.
   * All scoped services will be created new instance in different request pipe
   *
   * @description
   * @author Big Mogician
   * @template TInject
   * @param {Constructor<TInject>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public scoped<TInject>(srv: Constructor<TInject>): BonbonsServer;
  /**
   * Set a scoped service
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
   * @template TToken
   * @template TImplement
   * @param {InjectableToken<TToken>} token
   * @param {ImplementToken<TImplement>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public scoped<TToken, TImplement>(token: IJTK<TToken>, srv: IMPK<TImplement>): BonbonsServer;
  /**
   * Set a scoped service
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
   * @template TToken
   * @template TImplement
   * @param {InjectableToken<TToken>} token
   * @param {InjectFactory<TImplement>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public scoped<TToken, TImplement>(token: IJTK<TToken>, srv: IJTFC<TImplement>): BonbonsServer;
  /**
   * Set a scoped service
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
   * @template TInject
   * @template TImplement
   * @param {InjectableToken<TToken>} token
   * @param {TImplement} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public scoped<TToken, TImplement>(token: IJTK<TToken>, srv: TImplement): BonbonsServer;
  public scoped(...args: any[]): BonbonsServer {
    return this.$$preInject(args[0], args[1], InjectScope.Scope);
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
   * @template TInject
   * @param {Constructor<TInject>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public singleton<TInject>(srv: Constructor<TInject>): BonbonsServer;
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
   * @template TToken
   * @template TImplement
   * @param {InjectableToken<TToken>} token
   * @param {ImplementToken<TImplement>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public singleton<TToken, TImplement>(token: IJTK<TToken>, srv: IMPK<TImplement>): BonbonsServer;
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
   * @template TToken
   * @template TImplement
   * @param {InjectableToken<B>} token
   * @param {InjectFactory<TImplement>} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public singleton<TToken, TImplement>(token: IJTK<TToken>, srv: IJTFC<TImplement>): BonbonsServer;
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
   * @template TToken
   * @template TImplement
   * @param {InjectableToken<TToken>} token
   * @param {TImplement} srv
   * @returns {BonbonsServer}
   * @memberof BonbonsServer
   */
  public singleton<TToken, TImplement>(token: IJTK<TToken>, srv: TImplement): BonbonsServer;
  public singleton(...args: any[]): BonbonsServer {
    return this.$$preInject(args[0], args[1], InjectScope.Singleton);
  }

  public getConfigs() {
    return this.$confColls.get(CONFIG_COLLECTION);
  }

  /**
   * Start application
   * ---
   * @description
   * @author Big Mogician
   * @param {(configs: ReadonlyConfigs) => void} [run]
   * @memberof BonbonsServer
   */
  public start(run?: (configs: ConfigsCollection) => void): void {
    this.$$useCommonOptions();
    this.$$initLogger();
    this.$$initDLookup();
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

  private $$afterRun() {
    const { compilerFactory: factory } = this.$confColls.get(TPL_RENDER_COMPILER);
    this.option(TPL_RENDER_COMPILER, { compiler: factory && factory(this.$configs) });
  }

  private _clearServer(): void {
    delete this.$app;
    delete this.$port;
    delete this._ctlrs;
    delete this._mwares;
    delete this._pipes;
    delete this._scopeds;
    delete this._singletons;
    delete this._clearServer;
  }

  private $$configsInitialization(config?: ServerConfig): void {
    if (config) {
      this._ctlrs = config.controller || [];
      resolveInjections(this._renews, config.renews || []);
      resolveInjections(this._scopeds, config.scoped || []);
      resolveInjections(this._singletons, config.singleton || []);
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

  private $$defaultOptionsInitialization(): void {
    this.option(ENV_MODE, DEFAULTS.env);
    this.option(DEPLOY_MODE, DEFAULTS.deploy);
    this.option(CONFIG_COLLECTION, this.$confColls);
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
    this.option(BODY_PARSE_OPTIONS, DEFAULTS.koaBodyParser);
    this.option(JSON_FORM_OPTIONS, DEFAULTS.jsonForm);
    this.option(TEXT_FORM_OPTIONS, DEFAULTS.textForm);
    this.option(URL_FORM_OPTIONS, DEFAULTS.urlForm);
  }

  private $$useCommonOptions(): void {
    const { mode } = this.$confColls.get(ENV_MODE);
    this.$is_dev = mode === "development";
    const { port } = this.$confColls.get(DEPLOY_MODE);
    this.$port = port || 3000;
    this.$configs = { get: this.$confColls.get.bind(this.$confColls) };
    this.singleton(ConfigService, () => this.$configs);
    this.singleton(RenderService, () => new BonbonsRender(this.$configs));
    const handler = this.$confColls.get(ERROR_HANDLER);
    this._mwares.unshift([handler, [this.$configs]]);
  }

  private $$initLogger(): void {
    const caller = "$$initLogger";
    const LoggerConstructor = Injectable()(this.$confColls.get(GLOBAL_LOGGER));
    const env = this.$confColls.get(ENV_MODE);
    this.$logger = new LoggerConstructor(env);
    this.singleton(Logger, () => this.$logger);
    this.$logger.debug("core", caller, `logger init : [ type -> ${green(Logger.name)} ].`);
    this.$logger.debug("core", caller, "-----------------------");
  }

  private $$initDLookup(): void {
    this.$di = this.$confColls.get(DI_CONTAINER);
    this.$rdi = { get: this.$di.get.bind(this.$di) };
    this.scoped(InjectService,
      (scopeId: ScopeID) => ({
        get: (token: InjectToken) => this.$rdi.get(token, scopeId),
        scopeId
      }));
  }

  private $$initDIContainer(): void {
    const caller = "$$initDIContainer";
    this.$logger.debug("core", caller, "init DI container.");
    this.$logger.debug("core", caller, `renew inject entry count : [ ${green(this._renews.length)} ].`);
    this._renews.forEach(([tk, imp]) => {
      this.$$injectaFinally(tk, imp, InjectScope.New);
      this.$logger.trace("core", caller, `relation add : [ @${cyan((<any>tk).name)} -> @${blue(logInjectImp(imp))} ].`);
    });
    this.$logger.debug("core", caller, `scoped inject entry count : [ ${green(this._scopeds.length)} ].`);
    this._scopeds.forEach(([tk, imp]) => {
      this.$$injectaFinally(tk, imp, InjectScope.Scope);
      this.$logger.trace("core", caller, `relation add : [ @${cyan((<any>tk).name)} -> @${blue(logInjectImp(imp))} ].`);
    });
    this.$logger.debug("core", caller, `singleton inject entry count : [ ${green(this._singletons.length)} ].`);
    this._singletons.forEach(([tk, imp]) => {
      this.$$injectaFinally(tk, imp, InjectScope.Singleton);
      this.$logger.trace("core", caller, `relation add : [ @${cyan((<any>tk).name)} -> @${blue(logInjectImp(imp))} ].`);
    });
    this.$di.complete();
    this.$logger.debug("core", caller, `complete with di container : [ total injectable count -> ${green(this.$di.count)} ].`);
    this.$logger.debug("core", caller, "-----------------------");
  }

  private $$preInject(provide: any, type: InjectScope): BonbonsServer;
  private $$preInject(provide: any, classType: any, type?: InjectScope): BonbonsServer;
  private $$preInject(provide: any, classType?: any, type?: InjectScope): BonbonsServer {
    if (!provide) return this;
    type = type || InjectScope.Singleton;
    switch (type) {
      case InjectScope.New: this._renews.push([provide, classType || provide]); break;
      case InjectScope.Scope: this._scopeds.push([provide, classType || provide]); break;
      default: this._singletons.push([provide, classType || provide]);
    }
    return this;
  }

  private $$injectaFinally(provide: any, type: InjectScope): BonbonsServer;
  private $$injectaFinally(provide: any, classType: any, type?: InjectScope): BonbonsServer;
  private $$injectaFinally(provide: any, classType?: any, type?: InjectScope): BonbonsServer {
    if (!provide) return this;
    type = type || InjectScope.Singleton;
    this.$di.register(provide, classType || provide, type);
    return this;
  }

  private $$useRouters(): void {
    const caller = "$$useRouters";
    this.$logger.debug("core", caller, `start build routers : [ count -> ${green(this._ctlrs.length)} ]`);
    const mainRouter = new KOARouter();
    this._ctlrs.forEach(controllerClass => {
      const proto = controllerClass.prototype;
      const { router } = <ControllerMetadata>(proto.getConfig && proto.getConfig());
      const thisRouter = new KOARouter({ prefix: router.prefix as string });
      this.$logger.debug("core", caller,
        `register ${yellow(controllerClass.name)} : [ @prefix -> ${cyan(router.prefix)} @methods -> ${COLORS.green}${Object.keys(router.routes).length}${COLORS.reset} ]`);
      Object.keys(router.routes).forEach(methodName => {
        const item = router.routes[methodName];
        const { allowMethods } = item;
        if (!allowMethods) throw invalidOperation("invalid method, you must set a HTTP method for a route.");
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

  private $$resolveControllerMethod(method: string, item: IRoute, ctor: Constructor<any>, name: string, router: KOARouter): void {
    const caller = "$$resolveControllerMethod";
    const { path, pipes, middlewares: mds } = item;
    if (!path) return;
    const { list: pipelist } = pipes;
    const { list: mdsList } = mds;
    this.$logger.trace("core", caller,
      `add route : [ ${green(method)} ${blue(item.path)} @params -> ${cyan(item.funcParams.map(i => i.key).join(",") || "...")} ]`);
    const middlewares: KOAMiddleware[] = [...(mdsList || [])];
    const preMiddles = this.$$preparePipes();
    this.$$addPipeMiddlewares(pipelist, middlewares);
    this.$$selectFormParser(item, middlewares);
    this.$$decideFinalStep(item, middlewares, ctor, name);
    this.$$selectFuncMethod(router, method)(path, ...[requestScopeStart(this.$logger), ...preMiddles, ...middlewares]);
  }

  private $$preparePipes(): KOAMiddleware[] {
    const pipes: KOAMiddleware[] = [];
    this.$$addPipeMiddlewares(this._pipes, pipes);
    return pipes;
  }

  private $$addPipeMiddlewares(pipelist: PipeEntry[], middlewares: ((context: KOAContext, next: () => Async<any>) => any)[]): void {
    resolvePipeList(pipelist).forEach(bundle => middlewares.push(async (ctx, next) => {
      const { target: pipe } = bundle;
      const instance = createPipeInstance(bundle, this.$di.getDepedencies(getDependencies(pipe), ctx.state["$$scopeId"]) || [], getRequestContext(ctx));
      await instance.process();
      await next();
    }));
  }

  private $$useMiddlewares(): void {
    this._mwares.forEach(([fac, args]) => this.$app.use(fac(...(args || []))));
  }

  private $$selectFormParser(route: IRoute, middlewares: any[]): void {
    if (route.form && route.form.parser) resolveFormParser(middlewares, route, this.$confColls);
  }

  private $$decideFinalStep(route: IRoute, middlewares: KOAMiddleware[], constructor: any, methodName: string): void {
    middlewares.push(async (ctx) => {
      const list = this.$di.getDepedencies(getDependencies(constructor), ctx.state["$$scopeId"]);
      const c = new constructor(...list);
      c.$$ctx = getRequestContext(ctx);
      c.$$injector = this.$rdi;
      const result: IResult = constructor.prototype[methodName].bind(c)(...this.$$parseFuncParams(ctx, route));
      await resolveResult(ctx, result, this.$configs);
    });
  }

  private $$parseFuncParams(ctx: KOAContext, route: IRoute): any[] {
    const querys = (route.funcParams || []).filter(i => i.key !== null).map(({ key, type, isQuery }) => {
      const pack = isQuery ? ctx.query : (<any>ctx).params;
      return !type ? pack[key] : type(pack[key]);
    });
    if (route.form && route.form.index >= 0) {
      const { index } = route.form;
      const staticType = (route.funcParams || [])[index];
      const resolver = this.$confColls.get(STATIC_TYPED_RESOLVER);
      querys[index] = !!(resolver && staticType && staticType.type) ?
        resolver.FromObject(ctx.request.body, staticType.type) :
        ctx.request.body;
    }
    return querys;
  }

  private $$selectFuncMethod(router: KOARouter, method: string): (...args: any[]) => void {
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

function resolvePipeList(list: PipeEntry[]) {
  return (list || []).map(ele => {
    const { target } = <IPipeBundle<any>>ele;
    if (!target) {
      return { target: <Constructor<any>>ele, params: {} };
    } else {
      return <IPipeBundle<any>>ele;
    }
  });
}

function resolveInjections(list: [IJTK<any>, IMPDIV][], injects: InjectableType[]) {
  (injects || []).forEach(item => {
    if (item instanceof Array) {
      list.push(item);
    } else {
      const { token, implement } = <InjectEntry<any>>item;
      !token ?
        list.push(<any>[item, item]) :
        list.push([token, implement]);
    }
  });
}

function resolveFormParser(middlewares: any[], route: IRoute, configs: ConfigsCollection) {
  const parser = resolveParser(route.form.parser, configs, route.form.options);
  if (parser) middlewares.unshift(parser);
}

function resolveParser(type: FormType, configs: ConfigsCollection, options?: BaseFormOptions) {
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

function resolveParserOptions<T>(key: Token<T>, configs: ConfigsCollection, options: Partial<BaseFormOptions>): KOAMiddleware {
  // console.log(options);
  const { type, extends: extendsV } = options;
  (<any>options).enableTypes = [type];
  const etx = (<Partial<KOABodyParseOptions>>options).extendTypes = {};
  etx[(<string>type)] = extendsV || [];
  delete options.type;
  delete options.extends;
  // console.log(JSON.stringify(Object.assign(configs.get(key) || {}, options)));
  return KOABodyParser(Object.assign(configs.get(key) || {}, options));
}

function optionAssign(configs: ConfigsCollection, token: any, newValue: any) {
  return TypeCheck.isFromCustomClass(newValue || {}) ?
    newValue :
    Object.assign(configs.get(token) || {}, newValue);
}

function controllerError(ctlr: any) {
  return invalidParam("Controller to be add is invalid. You can only add the controller been decorated by @Controller(...).", { className: ctlr && ctlr.name });
}

async function resolveResult(ctx: KOAContext, result: IResult, configs: ConfigsCollection, isSync?: boolean) {
  const isAsync = isSync === undefined ? TypeCheck.isFromCustomClass(result || {}, Promise) : !isSync;
  let sResult: IMethodResult = <any>result;
  if (isAsync) {
    // (<Promise<SyncResult>>result).then(r => resolveResult(ctx, r, configs, true));
    sResult = await <Promise<IMethodResult>>result;
  }
  // else {
  //   console.log(await (<any>result).toString(configs));
  //   if (!result) { ctx.body = ""; return; }
  //   if (typeof result === "string") { ctx.body = result; return; }
  //   ctx.type = (<IMethodResult>result).type || "text/plain";
  //   ctx.body = await (<IMethodResult>result).toString(configs);
  // }
  // console.log(Object.keys(sResult));
  ctx.type = sResult.type || "text/plain";
  ctx.body = await sResult.toString(configs);
}

function requestScopeStart(logger: Logger) {
  return async (ctx: KOAContext, next: () => Promise<any>) => {
    ctx.state["$$scopeId"] = UUID.Create();
    logger.debug(
      "core", "requestScopeStart", `${blue(ctx.request.method)} ${cyan(ctx.request.url)} ${yellow(ctx.state["$$scopeId"].substring(0, 8))}`);
    await next();
  };
}
