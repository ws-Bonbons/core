import { setColor } from "./console-color";

export class BonbonsError extends Error {

  constructor(error?: string) {
    super(error);
    this.name = "BonbonsError";
    this.message = `[${setColor("yellow", "Bonbons.koa")}] ${setColor("green", "throws")} : \n\n${error}\n`;
  }

}

export function ERROR(error: string, more?: any) {
  return new BonbonsError(`${setColor("cyan", error)} \n[ ${setColor("magenta", "more details")} ] : ${(JSON.stringify(more)) || "none"}`);
}

export function invalidOperation(error: string, more?: any) {
  return ERROR(`[ ${setColor("red", "INVALID OPERATION")} ] : ${error}`, more);
}

export function invalidParam(error: string, more?: any) {
  return ERROR(`[ ${setColor("red", "INVALID PARAM")} ] : ${error}`, more);
}