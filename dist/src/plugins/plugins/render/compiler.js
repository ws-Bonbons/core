"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileLoader_1 = require("../fileLoader");
const base_1 = require("./base");
const utils_1 = require("../../../utils");
function defaultTplRenderCompiler(configs) {
    const { render, cache, root, extensions, options: defaultOptions } = configs.get(base_1.TPL_RENDER_OPTIONS);
    const { stringLoader: loader } = configs.get(fileLoader_1.FILE_LOADER);
    if (!loader) {
        throw utils_1.invalidOperation("no string-file loader found.");
    }
    return (filename, ispath = false) => __awaiter(this, void 0, void 0, function* () {
        const prefix = (root && (root + "/")) || "";
        const filepath = ispath ? filename : `${prefix}${filename}.${extensions || "html"}`;
        if (cache && cache[filepath])
            return cache[filepath];
        const tpl = (yield loader(filepath)) || "";
        const compiledFn = (data, options) => render && render(tpl, data, Object.assign(defaultOptions, options));
        if (cache && !cache[filepath])
            cache[filepath] = compiledFn;
        return compiledFn;
    });
}
exports.defaultTplRenderCompilerOptions = {
    compilerFactory: defaultTplRenderCompiler
};
//# sourceMappingURL=compiler.js.map