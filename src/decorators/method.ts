import { Constructor } from "@bonbons/contracts";
import * as c from "@bonbons/contracts/dist/src/private-api";
import * as d from "../di";

const { PARAMS_META_KEY } = c;

export function initRoutes(reflect: c.IBonbonsControllerMetadata, propertyKey: string): c.IRoute {
  return reflect.router.routes[propertyKey] || (reflect.router.routes[propertyKey] = <any>{});
}

export function reroute(reflect: c.IBonbonsControllerMetadata, propertyKey: string, payload: Partial<c.IRoute>) {
  Object.assign(initRoutes(reflect, propertyKey), payload);
  return reflect;
}

/**
 *  Define a route method for the controller. default allowed method is 'GET'.
 * @description
 * @author Big Mogician
 * @export
 * @param {...AllowMethod[]} allowMethods
 * @returns
 */
export function Method(...allowMethods: c.AllowMethod[]) {
  return createMethodDecorator(...allowMethods);
}

export const GET = createMethodDecorator("GET");
export const POST = createMethodDecorator("POST");
export const PUT = createMethodDecorator("PUT");
export const DELETE = createMethodDecorator("DELETE");
export const PATCH = createMethodDecorator("PATCH");
export const OPTIONS = createMethodDecorator("OPTIONS");
export const HEAD = createMethodDecorator("HEAD");

function createMethodDecorator(...allowMethods: c.AllowMethod[]) {
  return function <T extends c.IBonbonsController>(target: any, propertyKey: string) {
    const reflect = d.Reflection.GetControllerMetadata((<T>target));
    d.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { allowMethods }));
  };
}
/**
 * Define a method path for a route. absolute or relative path is supported. <nesessary>
 * Declare query params name to use static-typed variable.
 * @description
 * @author Big Mogician
 * @export
 * @param {string} path
 * @returns
 */
export function Route(path: string) {
  return function <T extends c.IBonbonsController>(target: any, propertyKey: string) {
    const querys: any[] = Reflect.getMetadata(PARAMS_META_KEY, target, propertyKey);
    const reflect = d.Reflection.GetControllerMetadata(target);
    reroute(reflect, propertyKey, { path: path.split("?")[0], funcParams: [] });
    const route = reflect.router.routes[propertyKey];
    let pcount = 0;
    path.replace(/:([^\/\?&]+)(\?|\/|$)/g, (_, $1) => {
      const type = querys[pcount];
      route.funcParams.push({
        key: $1,
        type: (type === Object || type === String) ? null : type,
        isQuery: false
      });
      pcount += 1;
      return path;
    });
    path.replace(/{([^&\/\?{}]+)}/g, (_, $1) => {
      const type = querys[pcount];
      route.funcParams.push({
        key: $1,
        type: (type === Object || type === String) ? null : type,
        isQuery: true
      });
      pcount += 1;
      return path;
    });
    const type = querys[querys.length - 1];
    route.funcParams.push({ key: null, type: type === Object ? null : type, isQuery: false });
    d.Reflection.SetControllerMetadata(target, reflect);
  };
}

type PipesControllerDecorator = <T>(target: Constructor<T>) => void;
type PipesMethodDecorator = <T>(target: T, propertyKey: string) => void;
type PipesDecorator = <T>(target: Constructor<T> | T, propertyKey?: string) => void;

export function Pipes(pipes: c.BonbonsPipeEntry[]): PipesDecorator;
export function Pipes(pipes: c.BonbonsPipeEntry[], merge: boolean): PipesMethodDecorator;
export function Pipes(pipes: c.BonbonsPipeEntry[], merge = false) {
  return function <T>(target: Constructor<T> | T, propertyKey?: string) {
    if (propertyKey) {
      const reflect = d.Reflection.GetControllerMetadata((<T>target));
      d.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { pipes: { list: pipes, merge } }));
    } else {
      const { prototype } = <Constructor<T>>target;
      const reflect = d.Reflection.GetControllerMetadata((prototype));
      const { pipes: pipelist } = reflect;
      pipelist.push(...pipes);
      d.Reflection.SetControllerMetadata(prototype, reflect);
    }
  };
}

export function Middlewares(middlewares: c.KOAMiddleware[]): PipesDecorator;
export function Middlewares(middlewares: c.KOAMiddleware[], merge: boolean): PipesMethodDecorator;
export function Middlewares(middlewares: c.KOAMiddleware[], merge = false) {
  return function <T>(target: Constructor<T> | T, propertyKey?: string) {
    if (propertyKey) {
      const reflect = d.Reflection.GetControllerMetadata((<T>target));
      d.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { middlewares: { list: middlewares, merge } }));
    } else {
      const { prototype } = <Constructor<T>>target;
      const reflect = d.Reflection.GetControllerMetadata((prototype));
      const { middlewares: list } = reflect;
      list.push(...middlewares);
      d.Reflection.SetControllerMetadata(prototype, reflect);
    }
  };
}