import { JsonResultOptions, StringResultOptions, Async } from "@bonbons/contracts";
import { IBonbonsController, IBonbonsContext, IBonbonsControllerMetadata } from "@bonbons/contracts/dist/src/private-api";
import { DIContainer } from "../di";
import { JsonResult } from "./result/json";
import { StringResult } from "./result/string";
import { RenderResult } from "./result/render";

export abstract class BaseController implements IBonbonsController {

  private readonly $$ctx!: IBonbonsContext;
  private readonly $$injector!: DIContainer;
  protected get views(): any { return this.context.views; }
  public get context() { return this.$$ctx; }

  public getConfig(): IBonbonsControllerMetadata { return null as any; }

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
  protected toJSON(json: any, options?: Partial<JsonResultOptions>): JsonResult {
    return new JsonResult(json, options);
  }

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
  protected toStringfy(str: string, options?: StringResultOptions): StringResult {
    return new StringResult(str, options);
  }

  protected render(name: string): RenderResult {
    return new RenderResult(name, this.views);
  }

  /**
   * Let the current execution sleep for a certain period of time
   * @param time
   * @async
   */
  protected sleep(time: number): Async<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, time || 0));
  }

}
