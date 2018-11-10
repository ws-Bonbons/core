"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("../../di");
const plugins_1 = require("../../plugins");
class RenderResult {
    constructor(name, data) {
        this.name = name;
        this.data = data;
        this.type = "text/html";
    }
    toString(configs) {
        const r = configs.get(di_1.DI_CONTAINER).get(plugins_1.RenderService);
        return r.render(this.name, this.data);
    }
}
exports.RenderResult = RenderResult;
//# sourceMappingURL=render.js.map