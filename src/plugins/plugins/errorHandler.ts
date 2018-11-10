import { createToken, ENV_MODE, DI_CONTAINER, BonbonsToken, ConfigsCollection } from "../../di";
import * as c from "@bonbons/contracts/dist/src/private-api";
import { GlobalLogger } from "./logger";
import { ViewTplRenderOptions, defaultViewTplRender, CompiledRenderFunction } from "./render";
import { invalidOperation, BonbonsGlobal as GLOBAL } from "../../utils";
import { FILE_LOADER } from "./fileLoader";
import { ConfigService } from "./configs";
import { InjectService } from "./injector";

export interface ErrorHandler {
  (configs: ConfigsCollection): (ctx, next) => Promise<any>;
}

export interface ErrorPageTemplate {
  (configs: ConfigsCollection): ErrorTemplateOptions;
}

export interface ErrorRenderOptions extends ViewTplRenderOptions { }

interface ErrorTemplateOptions {
  render: (error) => Promise<string | Buffer | undefined>;
}

let tplHanderCache: ErrorTemplateOptions;
let loggerCache: GlobalLogger;
let compilerCache: (name: string, ispath?: boolean) => Promise<CompiledRenderFunction<any>>;

export const ERROR_HANDLER: BonbonsToken<ErrorHandler> = createToken<ErrorHandler>("ERROR_HANDLER");
export const ERROR_PAGE_TEMPLATE: BonbonsToken<ErrorPageTemplate> = createToken<ErrorPageTemplate>("ERROR_PAGE_TEMPLATE");
export const ERROR_RENDER_OPRIONS: BonbonsToken<ErrorRenderOptions> = createToken<ErrorRenderOptions>("ERROR_RENDER_OPRIONS");

export const defaultErrorPageRenderOptions: ErrorRenderOptions = {
  render: defaultViewTplRender,
  extensions: "html",
  cache: {},
  options: {},
  root: undefined,
  fileName: "500",
  devTail: "dev"
};

export function defaultErrorHandler(configs: ConfigService) {
  return async function (ctx: c.KOAContext, next: () => Promise<any>) {
    try {
      await next();
    } catch (error) {
      const di = configs.get<c.BonbonsDIContainer>(DI_CONTAINER);
      const logger = loggerCache || (loggerCache = di.get(GlobalLogger));
      const tplHandler = tplHanderCache || (tplHanderCache = configs.get<ErrorPageTemplate>(ERROR_PAGE_TEMPLATE)(configs));
      const injector = di.get(InjectService);
      ctx.status = 500;
      ctx.type = "text/html";
      try {
        ctx.body = await tplHandler.render(error);
        logger.error("core", "defaultErrorHandler", error.stack);
        injector["INTERNAL_dispose"]();
      } catch (ex) {
        ctx.body = `<pre>${ex.stack}</pre>`;
        logger.error("core", "defaultErrorHandler", ex.stack);
        injector["INTERNAL_dispose"]();
      }
    }
  };
}

export function defaultErrorPageTemplate(configs: ConfigsCollection) {
  const { mode } = configs.get(ENV_MODE);
  const {
    extensions,
    root: errorRoot,
    fileName: name,
    devTail
  } = configs.get(ERROR_RENDER_OPRIONS);
  const compiler = compilerCache || (compilerCache = defaultErrorRenderCompiler(configs));
  let fileName = name || "500";
  if (mode === "development" && devTail !== false) {
    fileName = `${fileName}.${devTail || "dev"}`;
  }
  return ({
    render: async (error) => {
      try {
        const root = errorRoot || `${GLOBAL.folderRoot}/assets/templates`;
        const filePath = `${root}/${fileName}.${extensions || "html"}`;
        const compiledFn = await (compiler && compiler(filePath, true));
        return compiledFn && compiledFn({ stack: error && error.stack });
      } catch (error) {
        throw error;
      }
    }
  });
}

function defaultErrorRenderCompiler(configs: ConfigsCollection) {
  const { render, cache, root, extensions, options: defaultOptions } = configs.get(ERROR_RENDER_OPRIONS);
  const { stringLoader: loader } = configs.get(FILE_LOADER);
  if (!loader) {
    throw invalidOperation("no string-file loader found.");
  }
  return async (filename: string, ispath = false) => {
    const prefix = (root && (root + "/")) || "";
    const filepath = ispath ? filename : `${prefix}${filename}.${extensions || "html"}`;
    if (cache && cache[filepath]) return cache[filepath];
    const tpl = await loader(filepath) || "";
    const compiledFn = (data, options) => render && render(tpl, data, Object.assign(defaultOptions, options));
    if (cache && !cache[filepath]) cache[filepath] = compiledFn;
    return compiledFn;
  };
}