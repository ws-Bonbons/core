"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("../../di");
const utils_1 = require("../../utils");
/**
 * Represent the json to send by response.
 */
class JsonResult {
    constructor(json, options) {
        this.json = json;
        this.type = "application/json";
        this.options = options || {};
    }
    toString(configs) {
        if (configs) {
            this.options = Object.assign(configs.get(di_1.JSON_RESULT_OPTIONS) || {}, this.options);
        }
        const staticResolver = configs.get(di_1.STATIC_TYPED_RESOLVER);
        let json = (staticResolver && staticResolver.ToObject(this.json)) || this.json;
        if (this.options.resolver) {
            const resolver = this.options.resolver;
            json = recursiveResolver(this.json, resolver, staticResolver);
        }
        return JSON.stringify(json, null, this.options.indentation ? "  " : 0);
    }
}
exports.JsonResult = JsonResult;
exports.JsonResultResolvers = {
    decamelize(key) {
        return utils_1.Formater.DeCamelCase(key, "_");
    },
    camel(key) {
        return utils_1.Formater.ToCamelCase(key);
    }
};
function recursiveResolver(target, resolver, staticRv) {
    let payload = {};
    if (utils_1.TypeCheck.IsObject(target)) {
        for (const propKey in target || {}) {
            payload[resolver(propKey)] = recursiveResolver((staticRv && staticRv.ToObject(target[propKey]) || target[propKey]), resolver);
        }
    }
    else if (utils_1.TypeCheck.IsArray(target)) {
        payload = (target || []).map(i => recursiveResolver((staticRv && staticRv.ToObject(i) || i), resolver));
    }
    else {
        return target;
    }
    return payload;
}
//# sourceMappingURL=json.js.map