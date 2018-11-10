"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DIScopePool {
    constructor(scopeMetadata) {
        this.scopeMetadata = scopeMetadata;
        this.instanceMap = new Map();
    }
    get metadata() { return this.scopeMetadata; }
    setInstance(token, instance) {
        this.instanceMap.set(token, instance || null);
    }
    getInstance(token) {
        const instance = this.instanceMap.get(token);
        return instance;
    }
    update(args) {
        if (args instanceof Array) {
            const newMaps = args;
            newMaps.forEach(([key, instance]) => {
                this.instanceMap.set(key, instance);
            });
        }
        else {
            const resolver = args;
            Array.from(this.instanceMap.keys()).forEach(key => {
                this.instanceMap.set(key, resolver(key));
            });
        }
    }
    dispose() {
        this.scopeMetadata = undefined;
        this.instanceMap = undefined;
    }
}
exports.DIScopePool = DIScopePool;
//# sourceMappingURL=scope-pool.js.map