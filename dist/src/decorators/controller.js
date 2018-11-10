"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const d = __importStar(require("../di"));
function Controller(config) {
    return function (target) {
        const prototype = target.prototype;
        prototype.getConfig = () => d.Reflection.GetControllerMetadata(prototype);
        prototype.__valid = true;
        const reflect = d.Reflection.GetControllerMetadata(prototype);
        d.Reflection.SetControllerMetadata(prototype, registerCompelete(registerPrefix(reflect, config)));
        return target;
    };
}
exports.Controller = Controller;
/**
 * Check and edit absolute route path, merge middlewares and all work done.
 * @param ctrl controller prototype
 */
function registerCompelete(meta) {
    // console.log(JSON.stringify(meta.router.routes, null, "\t"));
    Object.keys(meta.router.routes).map(key => meta.router.routes[key]).forEach(route => {
        const { middlewares: mms, pipes: mps } = meta;
        const { middlewares = { list: [], merge: false }, pipes = { list: [], merge: false } } = route;
        if (middlewares.merge) {
            route.middlewares.list = [...mms, ...middlewares.list];
        }
        else {
            route.middlewares = { list: [...middlewares.list], merge: false };
        }
        if (pipes.merge) {
            route.pipes.list = [...mps, ...pipes.list];
        }
        else {
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
function registerPrefix(meta, config) {
    const prefix = typeof config === "string" ? config : config && config.prefix;
    meta.router.prefix = "/" + (prefix || "");
    return meta;
}
//# sourceMappingURL=controller.js.map