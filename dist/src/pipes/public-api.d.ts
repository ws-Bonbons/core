import { Async, Constructor } from "@bonbons/contracts";
import * as c from "@bonbons/contracts/dist/src/private-api";
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
export declare abstract class PipeMiddleware<T = any> implements c.IPipe<T> {
    readonly params: T;
    constructor();
    readonly context: c.IBonbonsContext;
    abstract process(): Async<c.PipeProcessResult>;
    protected break(): c.PipeProcessResult;
}
/**
 * Bonbons Pipe Factory Generator
 * ---
 * use this generator to create factory and params bundle.
 */
export declare const PipeFactory: {
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
    generic<T extends c.PipeMapParams>(type: Constructor<c.IPipe<T>>): (params: T) => c.IPipeBundle<T>;
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
    fromArray<T extends c.PipeParamType[]>(type: Constructor<c.IPipe<T>>): (params: T) => c.IPipeBundle<T>;
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
    fromMap<T = any>(type: Constructor<c.IPipe<T>>): (params: T) => c.IPipeBundle<T>;
};
