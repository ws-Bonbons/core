"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decamelize_1 = __importDefault(require("decamelize"));
const camelcase_1 = __importDefault(require("camelcase"));
exports.Formater = {
    ToCamelCase(str) {
        return camelcase_1.default(str);
    },
    DeCamelCase(str, sec = "-") {
        return decamelize_1.default(str, sec);
    }
};
//# sourceMappingURL=formater.js.map