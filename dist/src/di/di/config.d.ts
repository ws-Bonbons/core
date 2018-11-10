import { BonbonsConfigCollection, BonbonsToken, BonbonsEntry } from "@bonbons/contracts/dist/src/private-api";
declare type Configs = BonbonsConfigCollection;
declare type Token<T> = BonbonsToken<T>;
export declare class ConfigCollection implements Configs {
    protected _pool: Map<symbol, {
        value: any;
    }>;
    set<T>(token: Token<T>, entry: T): void;
    get<T>(token: Token<T>): T;
    toArray(): BonbonsEntry<any>[];
}
export {};
