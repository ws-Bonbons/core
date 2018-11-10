"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("../di");
const utils_1 = require("../utils");
function createPipeInstance(type, depts, $$ctx) {
    const { target, params } = type;
    const { keyMatch } = di_1.Reflection.GetPipeMetadata(target.prototype);
    const initFn = target.prototype.pipeOnInit;
    const instance = new target(...depts);
    instance.context = $$ctx;
    const paramsCopy = utils_1.clone(params);
    Object.defineProperty(instance, "params", { enumerable: true, configurable: false, get: () => paramsCopy });
    keyMatch.forEach(([old, newKey]) => instance[newKey] = params[old]);
    initFn && (initFn.bind(instance))();
    return instance;
}
exports.createPipeInstance = createPipeInstance;
//# sourceMappingURL=index.js.map