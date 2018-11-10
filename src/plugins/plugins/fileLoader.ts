import * as iconv from "iconv-lite";
import { default as fs } from "fs";
import { createToken, BonbonsToken } from "../../di";

export interface FileLoaderOptions {
  stringLoader?(filename: string, options?: { root?: string, encode?: string }): Promise<string>;
  loader?(filename: string, options?: { root?: string }): Promise<Buffer>;
}

export const FILE_LOADER: BonbonsToken<FileLoaderOptions> = createToken<FileLoaderOptions>("FILE_LOADER");

function defaultStringFileLoader(filename: string, { root = undefined, encode = "utf8" } = {}) {
  return new Promise<string>((resolve, reject) => {
    const prefix = (root && (root + "/")) || "";
    fs.readFile((prefix + filename), (error, data) => {
      if (error) reject(error);
      else resolve(iconv.decode(data, encode));
    });
  });
}

function defaultFileLoader(filename: string, { root = undefined } = {}) {
  return new Promise<Buffer>((resolve, reject) => {
    const prefix = (root && (root + "/")) || "";
    fs.readFile((prefix + filename), (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

export const defaultFileLoaderOptions = {
  loader: defaultFileLoader,
  stringLoader: defaultStringFileLoader
};
