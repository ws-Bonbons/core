/// <reference types="koa" />
/// <reference types="koa-bodyparser" />
import { IBonbonsContext, KOARequest, KOAResponse, KOAContext } from "@bonbons/contracts/dist/src/private-api";
export declare class Context implements IBonbonsContext {
    private source;
    readonly request: KOARequest;
    readonly response: KOAResponse;
    readonly query: {
        [prop: string]: any;
    };
    readonly params: {
        [prop: string]: any;
    };
    readonly form: {
        [prop: string]: any;
    };
    readonly views: {
        [prop: string]: any;
    };
    constructor(source: KOAContext);
    get(name: string, type: StringConstructor): string | null;
    get(name: string, type: BooleanConstructor): boolean | null;
    get(name: string, type: NumberConstructor): number | null;
    get(name: string): string | null;
    getNumber(name: string): number | null;
    getBoolean(name: string): boolean | null;
    setStatus(status: number): Context;
    setType(type: string): Context;
}
