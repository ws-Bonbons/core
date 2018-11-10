import { StringResultOptions, RouteResult } from "@bonbons/contracts";
import { ConfigsCollection } from "../../di";
export declare class StringResult implements RouteResult {
    private value;
    private options;
    constructor(value: string, options?: StringResultOptions);
    toString(configs: ConfigsCollection): string;
}
