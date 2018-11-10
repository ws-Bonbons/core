import {
  IStaticTypedResolver,
  JsonResultOptions,
  StringResultOptions,
  JsonFormOptions,
  URLFormOptions,
  TextFormOptions
} from "@bonbons/contracts";
import {
  BonbonsConfigCollection,
  BonbonsDIContainer,
  BonbonsToken,
  BonbonsTokenGenerator,
  IENV,
  IDepolyENV,
  KOABodyParseOptions
} from "@bonbons/contracts/dist/src/private-api";

type Configs = BonbonsConfigCollection;
type DIC = BonbonsDIContainer;

type Token<T> = BonbonsToken<T>;

export const createToken: BonbonsTokenGenerator = (key: string) => ({ key: Symbol(`BONBONS-KOA2-TOKEN:${key}`) });

export const ENV_MODE: Token<IENV> = createToken<IENV>("ENV_MODE");
export const DEPLOY_MODE: Token<IDepolyENV> = createToken<IDepolyENV>("DEPLOY_MODE");
export const CONFIG_COLLECTION: Token<Configs> = createToken<Configs>("CONFIG_COLLECTION");
export const DI_CONTAINER: Token<DIC> = createToken<DIC>("DI_CONTAINER");
export const STATIC_TYPED_RESOLVER: Token<IStaticTypedResolver> = createToken<IStaticTypedResolver>("STATIC_TYPED_RESOLVER");
export const JSON_RESULT_OPTIONS: Token<JsonResultOptions> = createToken<JsonResultOptions>("JSON_RESULT_OPTIONS");
export const STRING_RESULT_OPTIONS: Token<StringResultOptions> = createToken<StringResultOptions>("STRING_RESULT_OPTIONS");
export const BODY_PARSE_OPTIONS: Token<KOABodyParseOptions> = createToken<KOABodyParseOptions>("BODY_PARSE_OPTIONS");
export const JSON_FORM_OPTIONS: Token<JsonFormOptions> = createToken<JsonFormOptions>("JSON_FORM_OPTIONS");
export const URL_FORM_OPTIONS: Token<URLFormOptions> = createToken<URLFormOptions>("URL_FORM_OPTIONS");
export const TEXT_FORM_OPTIONS: Token<TextFormOptions> = createToken<TextFormOptions>("TEXT_FORM_OPTIONS");