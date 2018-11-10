"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const iconv = __importStar(require("iconv-lite"));
const di_1 = require("../../di");
class StringResult {
    constructor(value, options) {
        this.value = value;
        this.options = options || {};
    }
    toString(configs) {
        const options = Object.assign(configs.get(di_1.STRING_RESULT_OPTIONS) || {}, this.options || {});
        const from = (options.encoding || "UTF8").toLowerCase();
        const to = (options.decoding || "UTF8").toLowerCase();
        return iconv.decode(iconv.encode(this.value, from), to);
    }
}
exports.StringResult = StringResult;
//# sourceMappingURL=string.js.map