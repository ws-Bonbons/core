"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("@bonbons/di/dist"));
__export(require("@bonbons/pipes"));
__export(require("@bonbons/plugins"));
__export(require("@bonbons/options"));
__export(require("@bonbons/controllers"));
__export(require("@bonbons/decorators"));
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
__export(require("./decorator"));
//# sourceMappingURL=index.js.map