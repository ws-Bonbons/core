import { Constructor } from "@bonbons/contracts";

export function Pipe() {
  return function <T>(target: Constructor<T>) {
    (<any>target.prototype).__valid = true;
  };
}
