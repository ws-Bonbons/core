import { RouteResult } from "@bonbons/contracts";
import { ConfigsCollection } from "../../di";
export declare class RenderResult implements RouteResult {
    private name;
    private data;
    type: string;
    constructor(name: string, data: string);
    toString(configs: ConfigsCollection): Promise<string>;
}
