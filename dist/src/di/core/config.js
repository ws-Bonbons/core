"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigCollection {
    constructor() {
        this._pool = new Map();
    }
    set(token, entry) {
        this._pool.set(token.key, { value: entry });
    }
    get(token) {
        const entry = this._pool.get(token.key);
        return entry && entry.value;
    }
    toArray() {
        return Array.from(this._pool.entries()).map(([sb, { value }]) => ({ token: { key: sb }, value }));
    }
}
exports.ConfigCollection = ConfigCollection;
//# sourceMappingURL=config.js.map