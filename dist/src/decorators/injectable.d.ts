import "reflect-metadata";
import { Constructor } from "@bonbons/contracts";
export declare function Injectable(config?: any): <T>(target: Constructor<T>) => Constructor<T>;
