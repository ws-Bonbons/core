import * as iconv from "iconv-lite";
import { StringResultOptions, RouteResult } from "@bonbons/contracts";
import { STRING_RESULT_OPTIONS, ConfigsCollection } from "../../di";

export class StringResult implements RouteResult {

  private options: Partial<StringResultOptions>;

  constructor(private value: string, options?: StringResultOptions) {
    this.options = options || {};
  }

  public toString(configs: ConfigsCollection): string {
    const options = Object.assign(configs.get(STRING_RESULT_OPTIONS) || {}, this.options || {});
    const from = (options.encoding || "UTF8").toLowerCase();
    const to = (options.decoding || "UTF8").toLowerCase();
    return iconv.decode(iconv.encode(this.value, from), to);
  }

}