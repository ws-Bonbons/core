/// <reference types="node" />
import { BonbonsToken, ConfigsCollection } from "../../di";
import * as c from "@bonbons/contracts/dist/src/private-api";
import { ViewTplRenderOptions } from "./render";
import { ConfigService } from "./configs";
export interface ErrorHandler {
    (configs: ConfigsCollection): (ctx: any, next: any) => Promise<any>;
}
export interface ErrorPageTemplate {
    (configs: ConfigsCollection): ErrorTemplateOptions;
}
export interface ErrorRenderOptions extends ViewTplRenderOptions {
}
interface ErrorTemplateOptions {
    render: (error: any) => Promise<string | Buffer | undefined>;
}
export declare const ERROR_HANDLER: BonbonsToken<ErrorHandler>;
export declare const ERROR_PAGE_TEMPLATE: BonbonsToken<ErrorPageTemplate>;
export declare const ERROR_RENDER_OPRIONS: BonbonsToken<ErrorRenderOptions>;
export declare const defaultErrorPageRenderOptions: ErrorRenderOptions;
export declare function defaultErrorHandler(configs: ConfigService): (ctx: c.KOA.Context, next: () => Promise<any>) => Promise<void>;
export declare function defaultErrorPageTemplate(configs: ConfigsCollection): {
    render: (error: any) => Promise<string>;
};
export {};
