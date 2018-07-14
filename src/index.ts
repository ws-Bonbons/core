export * from "@bonbons/contracts/dist/src/public-api";
export * from "@bonbons/di/dist/src/public-api";
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
export const Bonbons = BonbonsServer;

export * from "./decorator";

export {
  BaseApp,
  BonbonsServer as Server
};
