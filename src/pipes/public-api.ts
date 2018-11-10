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
export abstract class PipeMiddleware<T = any> implements c.IPipe<T> {
  public readonly params!: T;
  constructor() { }
  public readonly context!: c.IBonbonsContext;
  abstract process(): Async<c.PipeProcessResult>;
}

/**
 * Bonbons Pipe Factory Generator
 * ---
 * use this generator to create factory and params bundle.
 */
export const PipeFactory = {
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
  generic<T extends c.PipeMapParams>(type: Constructor<c.IPipe<T>>) { return createGenericPipeFactory(type); },
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
  fromArray<T extends c.PipeArrayParams>(type: Constructor<c.IPipe<T>>) { return createArrayPipeFactory(type); },
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
  fromMap<T = any>(type: Constructor<c.IPipe<T>>) { return createPipeFactory(type); }
};

function createGenericPipeFactory<T extends c.PipeMapParams>(target: Constructor<c.IPipe<T>>): (params: T) => c.IPipeBundle<T> {
  return resolvePipe(target);
}

function createArrayPipeFactory<T extends c.PipeArrayParams>(target: Constructor<c.IPipe<T>>) {
  return resolvePipe(target);
}

function createPipeFactory<T = any>(target: Constructor<c.IPipe<T>>): (params: T) => c.IPipeBundle<T> {
  return resolvePipe(target);
}

function resolvePipe<T extends c.PipeArrayParams>(target: Constructor<c.IPipe<T>>): (params: T) => c.IPipeBundle<T>;
function resolvePipe<T extends c.PipeMapParams>(target: Constructor<c.IPipe<T>>): (params: T) => c.IPipeBundle<T>;
function resolvePipe(target: Constructor<c.IPipe<any>>) {
  return (params) => ({ params, target });
}
