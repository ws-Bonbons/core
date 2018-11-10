import { ConfigsCollection } from "@bonbons/di";
import { FILE_LOADER } from "../fileLoader";
import { TPL_RENDER_OPTIONS, TplRendeInvoker } from "./base";
import { invalidOperation } from "@bonbons/utils";

function defaultTplRenderCompiler(configs: ConfigsCollection): TplRendeInvoker {
  const { render, cache, root, extensions, options: defaultOptions } = configs.get(TPL_RENDER_OPTIONS);
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

export const defaultTplRenderCompilerOptions = {
  compilerFactory: defaultTplRenderCompiler
};
