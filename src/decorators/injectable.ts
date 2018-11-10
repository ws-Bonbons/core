import "reflect-metadata";
import { Constructor } from "@bonbons/contracts";
import * as c from "@bonbons/contracts/dist/src/private-api";

export function Injectable(config?: any) {
  return function <T>(target: Constructor<T>) {
    const prototype: c.IBonbonsInjectable = target.prototype;
    prototype.__valid = true;
    return target;
  };
}