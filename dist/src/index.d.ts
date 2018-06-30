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
