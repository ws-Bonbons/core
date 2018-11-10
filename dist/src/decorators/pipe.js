"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Pipe() {
    return function (target) {
        target.prototype.__valid = true;
    };
}
exports.Pipe = Pipe;
//# sourceMappingURL=pipe.js.map