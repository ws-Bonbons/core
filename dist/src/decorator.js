"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const plugins_1 = require("@bonbons/plugins");
const di_1 = require("@bonbons/di");
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
            this._configs = { get: conf.get.bind(conf) };
            const di = this._configs.get(di_1.DI_CONTAINER);
            this.logger = di.get(plugins_1.GlobalLogger);
            theStartup && theStartup.bind(this)();
        };
    };
}
exports.BonbonsApp = BonbonsApp;
/** Create a Bonbons.koa App server */
exports.BKoa = BonbonsApp;
//# sourceMappingURL=decorator.js.map