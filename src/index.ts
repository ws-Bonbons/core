import * as Metadata from "@bonbons/contracts";
import * as DISystem from "@bonbons/di";
import * as DefaultOptions from "@bonbons/options";
import * as PipeSupport from "@bonbons/pipes";
import * as ControllerSupport from "@bonbons/controllers";
import * as DecoratorSupport from "@bonbons/decorators";
import * as BonbonsPlugins from "@bonbons/plugins";

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

export type BonbonsScopeType =
  typeof Metadata & typeof BonbonsPlugins &
  typeof DISystem & typeof DefaultOptions &
  typeof PipeSupport & typeof ControllerSupport &
  typeof DecoratorSupport;

export const BonbonsScope: BonbonsScopeType = Object.assign(
  {},
  Metadata,
  BonbonsPlugins,
  DISystem,
  DefaultOptions,
  PipeSupport,
  ControllerSupport,
  DecoratorSupport
);

export {
  BaseApp,
  BonbonsServer as Server
};
