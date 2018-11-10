"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_base_1 = require("./di-base");
const reflect_1 = require("./reflect");
class DIContainer extends di_base_1.BaseDIContainer {
    register(token, imp, scope) {
        this.set(token, {
            token,
            imp,
            scope,
            depts: reflect_1.getDependencies(imp)
        });
    }
    createFactory(item) {
        const { imp, depts } = item;
        if (!item.fac) {
            item.fac = (scopeId) => new (imp)(...this.getDepedencies(depts, scopeId));
        }
        return item.fac;
    }
}
exports.DIContainer = DIContainer;
//# sourceMappingURL=container.js.map