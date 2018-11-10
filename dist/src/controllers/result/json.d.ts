import { RouteResult, JsonResultOptions } from "@bonbons/contracts";
import { ConfigsCollection } from "../../di";
/**
 * Represent the json to send by response.
 */
export declare class JsonResult implements RouteResult {
    private json;
    private options;
    type: string;
    constructor(json: any, options?: Partial<JsonResultOptions>);
    toString(configs: ConfigsCollection): string;
}
export declare const JsonResultResolvers: {
    decamelize(key: string): string;
    camel(key: string): string;
};
