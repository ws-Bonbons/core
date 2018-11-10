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
        if (route.middlewares && route.middlewares.merge) {
            route.middlewares.list = [...meta.middlewares, ...route.middlewares.list];
        }
        else if (!route.middlewares) {
            route.middlewares = { list: [...meta.middlewares], merge: false };
        }
        if (route.pipes && route.pipes.merge) {
            route.pipes.list = [...meta.pipes, ...route.pipes.list];
        }
        else if (!route.pipes) {
            route.pipes = { list: [...meta.pipes], merge: false };
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