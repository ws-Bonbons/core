"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Context {
    constructor(source) {
        this.source = source;
        this.views = {};
    }
    get request() { return this.source.request; }
    get response() { return this.source.response; }
    get query() { return this.source.query || {}; }
    get params() { return this.source.params || {}; }
    get form() { return this.source.body || {}; }
    get(name, type) {
        switch (type) {
            case Number: return this.getNumber(name);
            case Boolean: return this.getBoolean(name);
            default: return this.query[name] || this.params[name] || this.form[name];
        }
    }
    getNumber(name) {
        const value = Number(this.query[name] || this.params[name] || this.form[name]);
        return Number.isNaN(value) ? null : value;
    }
    getBoolean(name) {
        const value = this.query[name] || this.params[name] || this.form[name];
        return value === "true" ? true : value === "false" ? false : null;
    }
    setStatus(status) {
        this.source.status = status;
        return this;
    }
    setType(type) {
        this.source.type = type;
        return this;
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map