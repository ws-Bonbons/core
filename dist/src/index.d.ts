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
export declare const Bonbons: typeof BonbonsServer;
export * from "./decorator";
export declare type BonbonsScopeType = typeof Metadata & typeof BonbonsPlugins & typeof DISystem & typeof DefaultOptions & typeof PipeSupport & typeof ControllerSupport & typeof DecoratorSupport;
export declare const BonbonsScope: BonbonsScopeType;
export { BaseApp, BonbonsServer as Server };
