import { IENV, IDepolyENV, KOABodyParseOptions } from "@bonbons/contracts/dist/src/private-api";
import {
  JsonResultOptions,
  StringResultOptions,
  JsonFormOptions,
  TextFormOptions,
  URLFormOptions
} from "@bonbons/contracts";

function defaultEnvModeOptions(): Partial<IENV> {
  return { mode: "development", trace: true };
}

function defaultDeployModeOptions(): Partial<IDepolyENV> {
  return { port: 3000 };
}

function defaultJsonResultOptions(): Partial<JsonResultOptions> {
  return { indentation: true, staticType: false };
}

function defaultStringResultOptions(): Partial<StringResultOptions> {
  return { encoding: "utf8", decoding: "utf8" };
}

function defaultBodyParserOptions(): Partial<KOABodyParseOptions> {
  return { enableTypes: ["json", "form"] };
}

function defaultJsonFormOptions(): Partial<JsonFormOptions> {
  return { jsonLimit: "1mb" };
}

function defaultTextFormOptions(): Partial<TextFormOptions> {
  return { textLimit: "1mb" };
}

function defaultUrlFormOptions(): Partial<URLFormOptions> {
  return { formLimit: "56kb" };
}

export const Options = {
  jsonResult: defaultJsonResultOptions(),
  stringResult: defaultStringResultOptions(),
  env: defaultEnvModeOptions(),
  deploy: defaultDeployModeOptions(),
  koaBodyParser: defaultBodyParserOptions(),
  jsonForm: defaultJsonFormOptions(),
  textForm: defaultTextFormOptions(),
  urlForm: defaultUrlFormOptions()
};
