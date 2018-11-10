"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function Injectable(config) {
    return function (target) {
        const prototype = target.prototype;
        prototype.__valid = true;
        return target;
    };
}
exports.Injectable = Injectable;
//# sourceMappingURL=injectable.js.map