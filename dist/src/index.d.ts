export * from "@bonbons/contracts";
export * from "@bonbons/di";
export * from "@bonbons/options";
export * from "@bonbons/pipes";
export * from "@bonbons/controllers";
export * from "@bonbons/decorators";
export * from "@bonbons/plugins";
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
