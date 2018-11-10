"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base BONBONS Pipe
 * ---
 * * you should always extends this Class
 * * contains input params and request/response context support
 *
 * @description
 * @author Big Mogician
 * @export
 * @abstract
 * @class PipeMiddleware
 * @implements {IPipe<T>}
 * @template T
 */
class PipeMiddleware {
    constructor() { }
    break() {
        return { breakOut: true };
    }
}
exports.PipeMiddleware = PipeMiddleware;
/**
 * Bonbons Pipe Factory Generator
 * ---
 * use this generator to create factory and params bundle.
 */
exports.PipeFactory = {
    /**
     * Create a generic pipe
     * -----
     * Create a bundle with pipe which input params is a typed-object.
     * @description
     * @author Big Mogician
     * @template T
     * @param {Constructor<IPipe<T>>} type
     * @returns
     */
    generic(type) { return createGenericPipeFactory(type); },
    /**
     * Create a array pipe
     * -----
     * Create a bundle with pipe which input params is an array.
     * @description
     * @author Big Mogician
     * @template T
     * @param {Constructor<IPipe<T>>} type
     * @returns
     */
    fromArray(type) { return createArrayPipeFactory(type); },
    /**
     *    * Create a common pipe
     * -----
     * Create a bundle with pipe which input params is an object.
     * @description
     * @author Big Mogician
     * @template T
     * @param {Constructor<IPipe<T>>} type
     * @returns
     */
    fromMap(type) { return createPipeFactory(type); }
};
function createGenericPipeFactory(target) {
    return resolvePipe(target);
}
function createArrayPipeFactory(target) {
    return resolvePipe(target);
}
function createPipeFactory(target) {
    return resolvePipe(target);
}
function resolvePipe(target) {
    return (params) => ({ params, target });
}
//# sourceMappingURL=public-api.js.map