export * from "@bonbons/contracts/dist/src/public-api";
export * from "@bonbons/di/dist/src/public-api";
export * from "@bonbons/pipes/dist/src/public-api";
export * from "@bonbons/plugins/dist/src/public-api";
export * from "@bonbons/options";
export * from "@bonbons/controllers";
export * from "@bonbons/decorators";
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
