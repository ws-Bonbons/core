import * as c from "@bonbons/contracts/dist/src/private-api";
import { Constructor } from "@bonbons/contracts";
declare type ControllerDecorator = <T>(target: Constructor<T>) => void;
/**
 * Define a controller with config. the config is used for route prefix and other features.
 * @param {string} config prefix string
 */
export declare function Controller(config?: string): ControllerDecorator;
/**
 * Define a controller with config. the config is used for route prefix and other features.
 * @param {string} config an object contains some editable params
 */
export declare function Controller(config?: c.IControllerConfig): ControllerDecorator;
export {};
