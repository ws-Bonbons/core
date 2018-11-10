"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isObject(target) {
    return Object.prototype.toString.call(target) === "[object Object]";
}
function isArray(target) {
    return Object.prototype.toString.call(target) === "[object Array]";
}
function isFunction(target) {
    return Object.prototype.toString.call(target) === "[object Function]";
}
function getPrototypeConstructor(obj) {
    const proto = Object.getPrototypeOf(obj);
    return proto && proto.constructor;
}
function isCustomClassInstance(obj, type) {
    return !type ?
        (getPrototypeConstructor(obj) !== Object) :
        (getPrototypeConstructor(obj) === type);
}
exports.TypeCheck = {
    IsObject(target) { return isObject(target); },
    IsArray(target) { return isArray(target); },
    isFunction(target) { return isFunction(target) && !target.prototype && target !== Object; },
    getClass(target) { return getPrototypeConstructor(target); },
    isFromCustomClass(target, type) { return isCustomClassInstance(target, type); }
};
//# sourceMappingURL=type-check.js.map