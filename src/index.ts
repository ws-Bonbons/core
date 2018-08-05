export * from "@bonbons/contracts";
export * from "@bonbons/di/dist";
export * from "@bonbons/pipes";
export * from "@bonbons/plugins";
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
export const Bonbons = BonbonsServer;

export * from "./decorator";

export {
  BaseApp,
  BonbonsServer as Server
};
