"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Metadata = __importStar(require("@bonbons/contracts"));
const DISystem = __importStar(require("@bonbons/di"));
const DefaultOptions = __importStar(require("@bonbons/options"));
const PipeSupport = __importStar(require("@bonbons/pipes"));
const ControllerSupport = __importStar(require("@bonbons/controllers"));
const DecoratorSupport = __importStar(require("@bonbons/decorators"));
const BonbonsPlugins = __importStar(require("@bonbons/plugins"));
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
exports.BonbonsScope = Object.assign({}, Metadata, BonbonsPlugins, DISystem, DefaultOptions, PipeSupport, ControllerSupport, DecoratorSupport);
//# sourceMappingURL=index.js.map