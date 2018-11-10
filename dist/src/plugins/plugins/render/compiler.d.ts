import { ConfigsCollection } from "../../../di";
import { TplRendeInvoker } from "./base";
declare function defaultTplRenderCompiler(configs: ConfigsCollection): TplRendeInvoker;
export declare const defaultTplRenderCompilerOptions: {
    compilerFactory: typeof defaultTplRenderCompiler;
};
export {};
