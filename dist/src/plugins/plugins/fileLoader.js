"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const iconv = __importStar(require("iconv-lite"));
const fs_1 = __importDefault(require("fs"));
const di_1 = require("@bonbons/di");
exports.FILE_LOADER = di_1.createToken("FILE_LOADER");
function defaultStringFileLoader(filename, { root = undefined, encode = "utf8" } = {}) {
    return new Promise((resolve, reject) => {
        const prefix = (root && (root + "/")) || "";
        fs_1.default.readFile((prefix + filename), (error, data) => {
            if (error)
                reject(error);
            else
                resolve(iconv.decode(data, encode));
        });
    });
}
function defaultFileLoader(filename, { root = undefined } = {}) {
    return new Promise((resolve, reject) => {
        const prefix = (root && (root + "/")) || "";
        fs_1.default.readFile((prefix + filename), (error, data) => {
            if (error)
                reject(error);
            else
                resolve(data);
        });
    });
}
exports.defaultFileLoaderOptions = {
    loader: defaultFileLoader,
    stringLoader: defaultStringFileLoader
};
//# sourceMappingURL=fileLoader.js.map