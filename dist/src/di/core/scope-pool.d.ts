/// <reference types="koa" />
/// <reference types="koa-router" />
import { InjectToken } from "./declares";
import { KOAContext } from "@bonbons/contracts/dist/src/private-api";
export declare class DIScopePool {
    private scopeMetadata;
    private instanceMap;
    constructor(scopeMetadata: {
        ctx?: KOAContext;
    });
    readonly metadata: {
        ctx?: KOAContext;
    };
    setInstance<T>(token: InjectToken<T>, instance: T): void;
    getInstance<T>(token: InjectToken<T>): T | null | undefined;
    update(newMaps: Array<[InjectToken, any]>): void;
    update(resolver: <T>(token: InjectToken<T>) => T | null): void;
    dispose(): void;
}
