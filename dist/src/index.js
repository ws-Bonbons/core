"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./utils/public-api"));
__export(require("./di/public-api"));
__export(require("./pipes/public-api"));
__export(require("./plugins/public-api"));
__export(require("./decorators"));
__export(require("./controllers"));
const server_1 = require("./server");
exports.Server = server_1.BonbonsServer;
exports.BaseApp = server_1.BaseApp;
/**
 * Bonbons
 * ------
 * represent the server generator of application.
 *
 * Use Bonbons.Create() to create a new app.
 */
exports.Bonbons = server_1.BonbonsServer;
//# sourceMappingURL=index.js.map