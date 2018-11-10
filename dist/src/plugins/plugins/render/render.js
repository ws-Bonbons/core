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
const simple_render_1 = require("./simple.render");
exports.defaultViewTplRender = simple_render_1.defaultViewTplRender;
const ejs_render_1 = require("./ejs.render");
const base_1 = require("./base");
exports.defaultViewTplRenderOptions = {
    render: simple_render_1.defaultViewTplRender,
    extensions: "html",
    root: "",
    cache: {},
    options: {}
};
exports.Renders = {
    default: simple_render_1.defaultViewTplRender,
    ejs: ejs_render_1.ejsViewTplRender
};
class RenderService {
}
exports.RenderService = RenderService;
// decorator injectable
RenderService.prototype.__valid = true;
class BonbonsRender {
    constructor(configs) {
        this.configs = configs;
    }
    render(templateName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { compiler } = this.configs.get(base_1.TPL_RENDER_COMPILER);
            try {
                const compiledFn = yield (compiler && compiler(templateName, false));
                return compiledFn && compiledFn(data);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.BonbonsRender = BonbonsRender;
//# sourceMappingURL=render.js.map