"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const d = __importStar(require("../di"));
const c = __importStar(require("@bonbons/contracts/dist/src/private-api"));
const method_1 = require("./method");
const { FormType } = c;
function FromBody(config) {
    return formDecoratorFactory(FormType.ApplicationJson, config);
}
exports.FromBody = FromBody;
function FromForm(config) {
    return formDecoratorFactory(FormType.UrlEncoded, config);
}
exports.FromForm = FromForm;
function TextBody(config) {
    return formDecoratorFactory(FormType.TextPlain, config);
}
exports.TextBody = TextBody;
function formDecoratorFactory(parser, config) {
    const types = (config && (typeof (config) === "string" ? [config] : [])) || [];
    const configs = (typeof (config) === "string" ? {} : config) || {};
    configs.extends = [...(configs.extends || []), ...types];
    return function (target, propertyKey, index_descriptor) {
        const isParam = typeof index_descriptor === "number" && index_descriptor >= 0;
        const reflect = d.Reflection.GetControllerMetadata(target);
        const form = {
            parser,
            options: configs,
            index: isParam ? index_descriptor : -1
        };
        d.Reflection.SetControllerMetadata(target, method_1.reroute(reflect, propertyKey, { form }));
    };
}
//# sourceMappingURL=forms.js.map