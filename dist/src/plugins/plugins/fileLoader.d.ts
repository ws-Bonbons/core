/// <reference types="node" />
import { BonbonsToken } from "../../di";
export interface FileLoaderOptions {
    stringLoader?(filename: string, options?: {
        root?: string;
        encode?: string;
    }): Promise<string>;
    loader?(filename: string, options?: {
        root?: string;
    }): Promise<Buffer>;
}
export declare const FILE_LOADER: BonbonsToken<FileLoaderOptions>;
declare function defaultStringFileLoader(filename: string, { root, encode }?: {
    root?: any;
    encode?: string;
}): Promise<string>;
declare function defaultFileLoader(filename: string, { root }?: {
    root?: any;
}): Promise<Buffer>;
export declare const defaultFileLoaderOptions: {
    loader: typeof defaultFileLoader;
    stringLoader: typeof defaultStringFileLoader;
};
export {};
