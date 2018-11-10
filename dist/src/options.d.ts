import { IENV, IDepolyENV, KOABodyParseOptions } from "@bonbons/contracts/dist/src/private-api";
import { JsonResultOptions, StringResultOptions, JsonFormOptions, TextFormOptions, URLFormOptions } from "@bonbons/contracts";
export declare const Options: {
    jsonResult: Partial<JsonResultOptions>;
    stringResult: Partial<StringResultOptions>;
    env: Partial<IENV>;
    deploy: Partial<IDepolyENV>;
    koaBodyParser: Partial<KOABodyParseOptions>;
    jsonForm: Partial<JsonFormOptions>;
    textForm: Partial<TextFormOptions>;
    urlForm: Partial<URLFormOptions>;
};
