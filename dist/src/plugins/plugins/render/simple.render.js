"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defaultViewTplRender(tpl, data) {
    const reg = /{{([^}{]+)}}/g;
    if (!data)
        return tpl;
    return tpl.replace(reg, ($match, $1) => {
        try {
            const ps = ($1 || "").split(".");
            let value = data;
            ps.forEach(key => {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    value = value[key];
                }
            });
            return value;
        }
        catch (error) {
            return $match;
        }
    });
}
exports.defaultViewTplRender = defaultViewTplRender;
//# sourceMappingURL=simple.render.js.map