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
const di_1 = require("../../di");
const logger_1 = require("./logger");
const render_1 = require("./render");
const utils_1 = require("../../utils");
const fileLoader_1 = require("./fileLoader");
const injector_1 = require("./injector");
let tplHanderCache;
let loggerCache;
let compilerCache;
exports.ERROR_HANDLER = di_1.createToken("ERROR_HANDLER");
exports.ERROR_PAGE_TEMPLATE = di_1.createToken("ERROR_PAGE_TEMPLATE");
exports.ERROR_RENDER_OPRIONS = di_1.createToken("ERROR_RENDER_OPRIONS");
exports.defaultErrorPageRenderOptions = {
    render: render_1.defaultViewTplRender,
    extensions: "html",
    cache: {},
    options: {},
    root: undefined,
    fileName: "500",
    devTail: "dev"
};
function defaultErrorHandler(configs) {
    return function (ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield next();
            }
            catch (error) {
                const di = configs.get(di_1.DI_CONTAINER);
                const logger = loggerCache || (loggerCache = di.get(logger_1.GlobalLogger));
                const tplHandler = tplHanderCache || (tplHanderCache = configs.get(exports.ERROR_PAGE_TEMPLATE)(configs));
                const injector = di.get(injector_1.InjectService);
                ctx.status = 500;
                ctx.type = "text/html";
                try {
                    ctx.body = yield tplHandler.render(error);
                    logger.error("core", "defaultErrorHandler", error.stack);
                    injector["INTERNAL_dispose"]();
                }
                catch (ex) {
                    ctx.body = `<pre>${ex.stack}</pre>`;
                    logger.error("core", "defaultErrorHandler", ex.stack);
                    injector["INTERNAL_dispose"]();
                }
            }
        });
    };
}
exports.defaultErrorHandler = defaultErrorHandler;
function defaultErrorPageTemplate(configs) {
    const { mode } = configs.get(di_1.ENV_MODE);
    const { extensions, root: errorRoot, fileName: name, devTail } = configs.get(exports.ERROR_RENDER_OPRIONS);
    const compiler = compilerCache || (compilerCache = defaultErrorRenderCompiler(configs));
    let fileName = name || "500";
    if (mode === "development" && devTail !== false) {
        fileName = `${fileName}.${devTail || "dev"}`;
    }
    return ({
        render: (error) => __awaiter(this, void 0, void 0, function* () {
            try {
                const root = errorRoot || `${utils_1.BonbonsGlobal.folderRoot}/assets/templates`;
                const filePath = `${root}/${fileName}.${extensions || "html"}`;
                const compiledFn = yield (compiler && compiler(filePath, true));
                return compiledFn && compiledFn({ stack: error && error.stack });
            }
            catch (error) {
                throw error;
            }
        })
    });
}
exports.defaultErrorPageTemplate = defaultErrorPageTemplate;
function defaultErrorRenderCompiler(configs) {
    const { render, cache, root, extensions, options: defaultOptions } = configs.get(exports.ERROR_RENDER_OPRIONS);
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
//# sourceMappingURL=errorHandler.js.map