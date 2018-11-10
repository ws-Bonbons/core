import { ConfigsCollection, BonbonsToken } from "@bonbons/di";
export interface RenderFunction<TOptions = any> {
    (tpl: string, data?: any, options?: TOptions): string | undefined;
}
export interface CompiledRenderFunction<TOptions = any> {
    (data?: any, options?: TOptions): string | undefined;
}
export declare type TplRendeInvoker = (filename: string, ispath?: boolean) => Promise<CompiledRenderFunction>;
export interface TplRenderCompiler {
    (configs: ConfigsCollection): TplRendeInvoker;
}
export interface TplRenderCompilerOptions {
    compilerFactory?: TplRenderCompiler;
    compiler?: (filename: string, ispath?: boolean) => Promise<CompiledRenderFunction>;
}
export interface ViewTplRenderOptions<TOptions = any> {
    render?: RenderFunction<TOptions>;
    root?: string;
    extensions?: string | string[];
    cache?: {
        [prop: string]: CompiledRenderFunction<TOptions>;
    };
    options?: TOptions;
    fileName?: string;
    devTail?: string | false;
}
export declare const TPL_RENDER_OPTIONS: BonbonsToken<ViewTplRenderOptions>;
export declare const TPL_RENDER_COMPILER: BonbonsToken<TplRenderCompilerOptions>;
