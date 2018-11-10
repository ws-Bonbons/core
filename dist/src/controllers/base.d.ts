import { JsonResultOptions, StringResultOptions, Async } from "@bonbons/contracts";
import { IBonbonsController, IBonbonsContext, IBonbonsControllerMetadata } from "@bonbons/contracts/dist/src/private-api";
import { JsonResult } from "./result/json";
import { StringResult } from "./result/string";
import { RenderResult } from "./result/render";
export declare abstract class BaseController implements IBonbonsController {
    private readonly $$ctx;
    private readonly $$injector;
    protected readonly views: any;
    readonly context: IBonbonsContext;
    getConfig(): IBonbonsControllerMetadata;
    /**
     * Returns in JSON format, and supports the use of options to configure serialization behavior
     * @description
     * @author Big Mogician
     * @protected
     * @param {*} json
     * @param {Partial<JsonResultOptions>} [options]
     * @returns {JsonResult}
     * @memberof BaseController
     */
    protected toJSON(json: any, options?: Partial<JsonResultOptions>): JsonResult;
    /**
     * Returns the body of a string. You can use the encoding of the options configuration string, et
     * @description
     * @author Big Mogician
     * @protected
     * @param {string} str
     * @param {StringResultOptions} [options]
     * @returns {StringResult}
     * @memberof BaseController
     */
    protected toStringfy(str: string, options?: StringResultOptions): StringResult;
    protected render(name: string): RenderResult;
    /**
     * Let the current execution sleep for a certain period of time
     * @param time
     * @async
     */
    protected sleep(time: number): Async<void>;
}
