"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("../../di");
const utils_1 = require("../../utils");
exports.GLOBAL_LOGGER = di_1.createToken("GLOBAL_LOGGER");
class GlobalLogger {
    constructor(env) { }
}
exports.GlobalLogger = GlobalLogger;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["TRACE"] = 0] = "TRACE";
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARN"] = 3] = "WARN";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 5] = "FATAL";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.COLORS = Object.assign({}, utils_1.Colors);
exports.ColorsHelper = {
    setColor: utils_1.setColor,
    green(value) { return utils_1.setColor("green", value); },
    cyan(value) { return utils_1.setColor("cyan", value); },
    red(value) { return utils_1.setColor("red", value); },
    blue(value) { return utils_1.setColor("blue", value); },
    yellow(value) { return utils_1.setColor("yellow", value); },
    magenta(value) { return utils_1.setColor("magenta", value); },
    white(value) { return utils_1.setColor("white", value); }
};
function createStamp(date) {
    const tData = date || new Date();
    return `[${exports.ColorsHelper.cyan(`${tData.toLocaleDateString()} ${tData.toLocaleTimeString()}:${tData.getMilliseconds()}`)}]-`;
}
function createType(type) {
    let color;
    let tps;
    switch (type) {
        case LogLevel.FATAL:
        case LogLevel.ERROR:
            [color, tps] = ["red", "ERROR"];
            break;
        case LogLevel.WARN:
            [color, tps] = ["yellow", "WARN"];
            break;
        case LogLevel.INFO:
            [color, tps] = ["blue", "INFO"];
            break;
        case LogLevel.DEBUG:
            [color, tps] = ["green", "DEBUG"];
            break;
        default: [color, tps] = ["white", "TRACE"];
    }
    return `[${exports.ColorsHelper[color](tps)}]-`;
}
function createModule(msg, upcase = false) {
    const c = (msg || "").toString();
    return `[${exports.ColorsHelper.magenta(upcase ? c.toUpperCase() : c)}]-`;
}
function createMethod(msg, upcase = false) {
    const c = (msg || "").toString();
    return `[${exports.ColorsHelper.blue(upcase ? c.toUpperCase() : c)}]-`;
}
class BonbonsLogger {
    constructor(env) {
        this.env = env;
    }
    log(type, ...msgs) {
        if (msgs.length === 0)
            return;
        let logmsg;
        let [main, summary, details, ...mores] = msgs;
        let tMsgs;
        switch (msgs.length) {
            case 1:
                tMsgs = ["x", "x", ...msgs];
                break;
            case 2:
                tMsgs = ["x", ...msgs];
                break;
            case 3:
            default: tMsgs = msgs;
        }
        [main, summary, details, ...mores] = tMsgs;
        const more = (mores || []).map(i => `-------------\n${JSON.stringify(i)}`);
        logmsg = `${createStamp()}${createType(type)}${createModule(main, true)}${createMethod(summary)} ${details} ${more.length > 0 ? `\n--------------\nMore: \n${more}` : ""}`;
        console.log(logmsg);
    }
    trace(...msgs) {
        if (this.env.mode === "production")
            return;
        if (!this.env.trace)
            return;
        return this.log(LogLevel.TRACE, ...msgs);
    }
    debug(...msgs) {
        if (this.env.mode === "production")
            return;
        return this.log(LogLevel.DEBUG, ...msgs);
    }
    info(...msgs) {
        return this.log(LogLevel.INFO, ...msgs);
    }
    warn(...msgs) {
        return this.log(LogLevel.WARN, ...msgs);
    }
    error(...msgs) {
        return this.log(LogLevel.ERROR, ...msgs);
    }
}
exports.BonbonsLogger = BonbonsLogger;
//# sourceMappingURL=logger.js.map