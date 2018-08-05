import { BonbonsConfigCollection as SourceConfigs, InjectableToken as IJTK, BonbonsDeptFactory as IJTFC, ImplementToken as IMPK, BonbonsEntry as Entry, BonbonsToken as Token, IBonbonsServer as IServer, BonbonsServerConfig as ServerConfig, BonbonsPipeEntry as PipeEntry, MiddlewaresFactory } from "@bonbons/contracts/dist/src/private-api";
import { Constructor } from "@bonbons/contracts";
import { ConfigsCollection } from "@bonbons/di";
import { Logger } from "@bonbons/plugins";
export declare abstract class BaseApp {
    protected readonly logger: Logger;
    protected readonly config: ConfigsCollection;
    start(): void;
}
export declare class BonbonsServer implements IServer {
    static Create(): BonbonsServer;
    static readonly New: BonbonsServer;
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
    private $di;
    private $rdi;
    private $configs;
    private $logger;
    private $app;
    private $confColls;
    private $port;
    private $is_dev;
    private _ctlrs;
    private _mwares;
    private _pipes;
    private _renews;
    private _scopeds;
    private _singletons;
    constructor(config?: ServerConfig);
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
    use(mfac: MiddlewaresFactory, ...params: any[]): BonbonsServer;
    pipe(pipe: PipeEntry): BonbonsServer;
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
    option<T>(entry: Entry<Partial<T> | T>): BonbonsServer;
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
    option<T>(token: Token<T>, value: Partial<T> | T): BonbonsServer;
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
    controller<T>(ctlr: Constructor<T>): BonbonsServer;
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
    renew<TInject>(srv: Constructor<TInject>): BonbonsServer;
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
    renew<TToken, TImplement>(token: IJTK<TToken>, srv: IMPK<TImplement>): BonbonsServer;
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
    renew<TToken, TImplement>(token: IJTK<TToken>, srv: IJTFC<TImplement>): BonbonsServer;
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
    renew<TToken, TImplement>(token: IJTK<TToken>, srv: TImplement): BonbonsServer;
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
    scoped<TInject>(srv: Constructor<TInject>): BonbonsServer;
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
    scoped<TToken, TImplement>(token: IJTK<TToken>, srv: IMPK<TImplement>): BonbonsServer;
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
    scoped<TToken, TImplement>(token: IJTK<TToken>, srv: IJTFC<TImplement>): BonbonsServer;
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
    scoped<TToken, TImplement>(token: IJTK<TToken>, srv: TImplement): BonbonsServer;
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
    singleton<TInject>(srv: Constructor<TInject>): BonbonsServer;
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
    singleton<TToken, TImplement>(token: IJTK<TToken>, srv: IMPK<TImplement>): BonbonsServer;
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
    singleton<TToken, TImplement>(token: IJTK<TToken>, srv: IJTFC<TImplement>): BonbonsServer;
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
    singleton<TToken, TImplement>(token: IJTK<TToken>, srv: TImplement): BonbonsServer;
    getConfigs(): SourceConfigs;
    /**
     * Start application
     * ---
     * @description
     * @author Big Mogician
     * @param {(configs: ReadonlyConfigs) => void} [run]
     * @memberof BonbonsServer
     */
    start(run?: (configs: ConfigsCollection) => void): void;
    private $$afterRun;
    private _clearServer;
    private $$configsInitialization;
    private $$defaultOptionsInitialization;
    private $$useCommonOptions;
    private $$initLogger;
    private $$initDLookup;
    private $$initDIContainer;
    private $$preInject;
    private $$injectaFinally;
    private $$useRouters;
    private $$resolveControllerMethod;
    private $$preparePipes;
    private $$addPipeMiddlewares;
    private $$useMiddlewares;
    private $$selectFormParser;
    private $$decideFinalStep;
    private $$parseFuncParams;
    private $$selectFuncMethod;
}
