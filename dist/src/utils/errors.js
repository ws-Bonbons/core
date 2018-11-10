"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_color_1 = require("./console-color");
class BonbonsError extends Error {
    constructor(error) {
        super(error);
        this.name = "BonbonsError";
        this.message = `[${console_color_1.setColor("yellow", "Bonbons.koa")}] ${console_color_1.setColor("green", "throws")} : \n\n${error}\n`;
    }
}
exports.BonbonsError = BonbonsError;
function ERROR(error, more) {
    return new BonbonsError(`${console_color_1.setColor("cyan", error)} \n[ ${console_color_1.setColor("magenta", "more details")} ] : ${(JSON.stringify(more)) || "none"}`);
}
exports.ERROR = ERROR;
function invalidOperation(error, more) {
    return ERROR(`[ ${console_color_1.setColor("red", "INVALID OPERATION")} ] : ${error}`, more);
}
exports.invalidOperation = invalidOperation;
function invalidParam(error, more) {
    return ERROR(`[ ${console_color_1.setColor("red", "INVALID PARAM")} ] : ${error}`, more);
}
exports.invalidParam = invalidParam;
//# sourceMappingURL=errors.js.map