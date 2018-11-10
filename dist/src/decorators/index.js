"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const di_1 = require("../di");
const public_api_1 = require("../plugins/public-api");
/**
 * Create a Bonbons.koa App server
 * ---
 * @description
 * @author Big Mogician
 * @export
 * @param {BonbonsServerConfig} config
 * @returns
 */
function BonbonsApp(config) {
    return function (target) {
        const theStartup = target.prototype.start;
        target.prototype.start = function () {
            const app = new server_1.BonbonsServer(config);
            app.start();
            const conf = app.getConfigs();
            const instance = this;
            instance._configs = { get: conf.get.bind(conf) };
            const di = instance._configs.get(di_1.DI_CONTAINER);
            instance.logger = di.get(public_api_1.Logger);
            theStartup && theStartup.bind(instance)();
        };
    };
}
exports.BonbonsApp = BonbonsApp;
__export(require("./controller"));
__export(require("./injectable"));
__export(require("./method"));
__export(require("./forms"));
__export(require("./pipe"));
//# sourceMappingURL=index.js.map