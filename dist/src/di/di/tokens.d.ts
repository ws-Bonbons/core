import { IStaticTypedResolver, JsonResultOptions, StringResultOptions, JsonFormOptions, URLFormOptions, TextFormOptions } from "@bonbons/contracts";
import { BonbonsConfigCollection, BonbonsDIContainer, BonbonsToken, BonbonsTokenGenerator, IENV, IDepolyENV, KOABodyParseOptions } from "@bonbons/contracts/dist/src/private-api";
declare type Configs = BonbonsConfigCollection;
declare type DIC = BonbonsDIContainer;
declare type Token<T> = BonbonsToken<T>;
export declare const createToken: BonbonsTokenGenerator;
export declare const ENV_MODE: Token<IENV>;
export declare const DEPLOY_MODE: Token<IDepolyENV>;
export declare const CONFIG_COLLECTION: Token<Configs>;
export declare const DI_CONTAINER: Token<DIC>;
export declare const STATIC_TYPED_RESOLVER: Token<IStaticTypedResolver>;
export declare const JSON_RESULT_OPTIONS: Token<JsonResultOptions>;
export declare const STRING_RESULT_OPTIONS: Token<StringResultOptions>;
export declare const BODY_PARSE_OPTIONS: Token<KOABodyParseOptions>;
export declare const JSON_FORM_OPTIONS: Token<JsonFormOptions>;
export declare const URL_FORM_OPTIONS: Token<URLFormOptions>;
export declare const TEXT_FORM_OPTIONS: Token<TextFormOptions>;
export {};