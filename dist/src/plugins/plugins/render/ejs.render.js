"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs = __importStar(require("ejs"));
function ejsViewTplRender(tpl, data, options) {
    if (!data)
        return tpl;
    try {
        return ejs.compile(tpl, Object.assign({}, options, { _with: true }))(Object.assign({}, data, { global }));
    }
    catch (error) {
        throw error;
    }
}
exports.ejsViewTplRender = ejsViewTplRender;
//# sourceMappingURL=ejs.render.js.map