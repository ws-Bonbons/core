export * from "@bonbons/contracts";
export * from "@bonbons/controllers";
export * from "@bonbons/decorators";
export * from "./utils/public-api";
export * from "./di/public-api";
export * from "./pipes/public-api";
export * from "./plugins/public-api";
import { BonbonsServer, BaseApp } from "./server";
/**
 * Bonbons
 * ------
 * represent the server generator of application.
 *
 * Use Bonbons.Create() to create a new app.
 */
export declare const Bonbons: typeof BonbonsServer;
export * from "./decorator";
export { BaseApp, BonbonsServer as Server };
