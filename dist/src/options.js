"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defaultEnvModeOptions() {
    return { mode: "development", trace: true };
}
function defaultDeployModeOptions() {
    return { port: 3000 };
}
function defaultJsonResultOptions() {
    return { indentation: true, staticType: false };
}
function defaultStringResultOptions() {
    return { encoding: "utf8", decoding: "utf8" };
}
function defaultBodyParserOptions() {
    return { enableTypes: ["json", "form"] };
}
function defaultJsonFormOptions() {
    return { jsonLimit: "1mb" };
}
function defaultTextFormOptions() {
    return { textLimit: "1mb" };
}
function defaultUrlFormOptions() {
    return { formLimit: "56kb" };
}
exports.Options = {
    jsonResult: defaultJsonResultOptions(),
    stringResult: defaultStringResultOptions(),
    env: defaultEnvModeOptions(),
    deploy: defaultDeployModeOptions(),
    koaBodyParser: defaultBodyParserOptions(),
    jsonForm: defaultJsonFormOptions(),
    textForm: defaultTextFormOptions(),
    urlForm: defaultUrlFormOptions()
};
//# sourceMappingURL=options.js.map