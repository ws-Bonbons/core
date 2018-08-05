import { Constructor } from "@bonbons/contracts";
import { BonbonsServerConfig } from "@bonbons/contracts/dist/src/private-api";
import { BaseApp } from "./server";
/**
 * Create a Bonbons.koa App server
 * ---
 * @description
 * @author Big Mogician
 * @export
 * @param {BonbonsServerConfig} config
 * @returns
 */
export declare function BonbonsApp(config: BonbonsServerConfig): <T extends BaseApp>(target: Constructor<T>) => void;
/** Create a Bonbons.koa App server */
export declare const BKoa: typeof BonbonsApp;
