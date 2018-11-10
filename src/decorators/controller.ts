import * as d from "../di";
import * as c from "@bonbons/contracts/dist/src/private-api";
import { Constructor } from "@bonbons/contracts";

type ControllerDecorator = <T>(target: Constructor<T>) => void;

/**
 * Define a controller with config. the config is used for route prefix and other features.
 * @param {string} config prefix string
 */
export function Controller(config?: string): ControllerDecorator;
/**
 * Define a controller with config. the config is used for route prefix and other features.
 * @param {string} config an object contains some editable params
 */
export function Controller(config?: c.IControllerConfig): ControllerDecorator;
export function Controller(config?: string | c.IControllerConfig): ControllerDecorator {
  return function <T>(target: Constructor<T>) {
    const prototype: c.IBonbonsController = target.prototype;
    prototype.getConfig = () => d.Reflection.GetControllerMetadata(prototype);
    prototype.__valid = true;
    const reflect = d.Reflection.GetControllerMetadata(prototype);
    d.Reflection.SetControllerMetadata(prototype, registerCompelete(registerPrefix(reflect, config)));
    return target;
  };
}

/**
 * Check and edit absolute route path, merge middlewares and all work done.
 * @param ctrl controller prototype
 */
function registerCompelete(meta: c.IBonbonsControllerMetadata) {
  // console.log(JSON.stringify(meta.router.routes, null, "\t"));
  Object.keys(meta.router.routes).map(key => meta.router.routes[key]).forEach(route => {
    const { middlewares: mms, pipes: mps } = meta;
    const {
      middlewares = { list: [], merge: true },
      pipes = { list: [], merge: true }
    } = route;
    // try make sure the item is exist.
    route.middlewares = middlewares;
    route.pipes = pipes;
    if (middlewares.merge) {
      route.middlewares.list = [...mms, ...middlewares.list];
    } else {
      route.middlewares = { list: [...middlewares.list], merge: false };
    }
    if (pipes.merge) {
      route.pipes.list = [...mps, ...pipes.list];
    } else {
      route.pipes = { list: [...pipes.list], merge: false };
    }
  });
  return meta;
}

/**
 * Config controller prefix
 * @description
 * @author Big Mogician
 * @param {IControllerMetadata} meta
 * @param {(string | IControllerConfig)} [config]
 * @returns
 */
function registerPrefix(meta: c.IBonbonsControllerMetadata, config?: string | c.IControllerConfig) {
  const prefix = typeof config === "string" ? config : config && config.prefix;
  meta.router.prefix = "/" + (prefix || "");
  return meta;
}