/// <reference types="koa" />
import { Constructor } from "@bonbons/contracts";
import * as c from "@bonbons/contracts/dist/src/private-api";
export declare function initRoutes(reflect: c.IBonbonsControllerMetadata, propertyKey: string): c.IRoute;
export declare function reroute(reflect: c.IBonbonsControllerMetadata, propertyKey: string, payload: any): c.IBonbonsControllerMetadata;
/**
 *  Define a route method for the controller. default allowed method is 'GET'.
 * @description
 * @author Big Mogician
 * @export
 * @param {...AllowMethod[]} allowMethods
 * @returns
 */
export declare function Method(...allowMethods: c.AllowMethod[]): <T extends c.IBonbonsController>(target: any, propertyKey: string) => void;
export declare const GET: <T extends c.IBonbonsController>(target: any, propertyKey: string) => void;
export declare const POST: <T extends c.IBonbonsController>(target: any, propertyKey: string) => void;
export declare const PUT: <T extends c.IBonbonsController>(target: any, propertyKey: string) => void;
export declare const DELETE: <T extends c.IBonbonsController>(target: any, propertyKey: string) => void;
export declare const PATCH: <T extends c.IBonbonsController>(target: any, propertyKey: string) => void;
export declare const OPTIONS: <T extends c.IBonbonsController>(target: any, propertyKey: string) => void;
export declare const HEAD: <T extends c.IBonbonsController>(target: any, propertyKey: string) => void;
/**
 * Define a method path for a route. absolute or relative path is supported. <nesessary>
 * Declare query params name to use static-typed variable.
 * @description
 * @author Big Mogician
 * @export
 * @param {string} path
 * @returns
 */
export declare function Route(path: string): <T extends c.IBonbonsController>(target: any, propertyKey: string) => void;
declare type PipesMethodDecorator = <T>(target: T, propertyKey: string) => void;
declare type PipesDecorator = <T>(target: Constructor<T> | T, propertyKey?: string) => void;
export declare function Pipes(pipes: c.BonbonsPipeEntry[]): PipesDecorator;
export declare function Pipes(pipes: c.BonbonsPipeEntry[], merge: boolean): PipesMethodDecorator;
export declare function Middlewares(middlewares: c.KOAMiddleware[]): PipesDecorator;
export declare function Middlewares(middlewares: c.KOAMiddleware[], merge: boolean): PipesMethodDecorator;
export {};
