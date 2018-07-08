"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const utils_1 = require("@bonbons/utils");
utils_1.BonbonsGlobal.folderRoot = path_1.default.resolve(__dirname);
__export(require("./src"));
//# sourceMappingURL=index.js.map