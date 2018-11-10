"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const c = __importStar(require("@bonbons/contracts/dist/src/private-api"));
const d = __importStar(require("../di"));
const { PARAMS_META_KEY } = c;
function initRoutes(reflect, propertyKey) {
    return reflect.router.routes[propertyKey] || (reflect.router.routes[propertyKey] = {});
}
exports.initRoutes = initRoutes;
function reroute(reflect, propertyKey, payload) {
    Object.assign(initRoutes(reflect, propertyKey), payload);
    return reflect;
}
exports.reroute = reroute;
/**
 *  Define a route method for the controller. default allowed method is 'GET'.
 * @description
 * @author Big Mogician
 * @export
 * @param {...AllowMethod[]} allowMethods
 * @returns
 */
function Method(...allowMethods) {
    return createMethodDecorator(...allowMethods);
}
exports.Method = Method;
exports.GET = createMethodDecorator("GET");
exports.POST = createMethodDecorator("POST");
exports.PUT = createMethodDecorator("PUT");
exports.DELETE = createMethodDecorator("DELETE");
exports.PATCH = createMethodDecorator("PATCH");
exports.OPTIONS = createMethodDecorator("OPTIONS");
exports.HEAD = createMethodDecorator("HEAD");
function createMethodDecorator(...allowMethods) {
    return function (target, propertyKey) {
        const reflect = d.Reflection.GetControllerMetadata(target);
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
function Route(path) {
    return function (target, propertyKey) {
        const querys = Reflect.getMetadata(PARAMS_META_KEY, target, propertyKey);
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
exports.Route = Route;
function Pipes(pipes, merge = true) {
    return function (target, propertyKey) {
        if (propertyKey) {
            const reflect = d.Reflection.GetControllerMetadata(target);
            d.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { pipes: { list: pipes, merge } }));
        }
        else {
            const { prototype } = target;
            const reflect = d.Reflection.GetControllerMetadata((prototype));
            const { pipes: pipelist } = reflect;
            pipelist.push(...pipes);
            d.Reflection.SetControllerMetadata(prototype, reflect);
        }
    };
}
exports.Pipes = Pipes;
function Middlewares(middlewares, merge = true) {
    return function (target, propertyKey) {
        if (propertyKey) {
            const reflect = d.Reflection.GetControllerMetadata(target);
            d.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { middlewares: { list: middlewares, merge } }));
        }
        else {
            const { prototype } = target;
            const reflect = d.Reflection.GetControllerMetadata((prototype));
            const { middlewares: list } = reflect;
            list.push(...middlewares);
            d.Reflection.SetControllerMetadata(prototype, reflect);
        }
    };
}
exports.Middlewares = Middlewares;
//# sourceMappingURL=method.js.map