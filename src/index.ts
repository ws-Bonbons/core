export * from "@bonbons/contracts";
export * from "./utils/public-api";
export * from "./di/public-api";
export * from "./pipes/public-api";
export * from "./plugins/public-api";
export * from "./decorators";
export * from "./controllers";

import { BonbonsServer, BaseApp } from "./server";

/**
 * Bonbons
 * ------
 * represent the server generator of application.
 *
 * Use Bonbons.Create() to create a new app.
 */
export const Bonbons = BonbonsServer;

export {
  BaseApp,
  BonbonsServer as Server
};
