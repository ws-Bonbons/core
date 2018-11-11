import { createToken, BonbonsToken as Token } from "../../di";
import { Constructor } from "@bonbons/contracts";
import { Colors, setColor } from "../../utils";
import { IENV } from "@bonbons/contracts/dist/src/private-api";

export const GLOBAL_LOGGER: Token<Constructor<GlobalLogger>> = createToken<Constructor<GlobalLogger>>("GLOBAL_LOGGER");

export abstract class GlobalLogger {
  constructor(env: IENV) { }

  abstract trace(module: string, caller: string, message: string, more?: any): void;
  abstract trace(caller: string, message: string, more?: any): void;
  abstract trace(message: string, more?: any): void;
  abstract trace(...msgs: any[]): void;

  abstract debug(module: string, caller: string, message: string, more?: any): void;
  abstract debug(caller: string, message: string, more?: any): void;
  abstract debug(message: string, more?: any): void;
  abstract debug(...msgs: any[]): void;

  abstract info(module: string, caller: string, message: string, more?: any): void;
  abstract info(caller: string, message: string, more?: any): void;
  abstract info(message: string, more?: any): void;
  abstract info(...msgs: any[]): void;

  abstract warn(module: string, caller: string, message: string, more?: any): void;
  abstract warn(caller: string, message: string, more?: any): void;
  abstract warn(message: string, more?: any): void;
  abstract warn(...msgs: any[]): void;

  abstract error(module: string, caller: string, message: string, more?: any): void;
  abstract error(caller: string, message: string, more?: any): void;
  abstract error(message: string, more?: any): void;
  abstract error(...msgs: any[]): void;
}

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5
}

export const COLORS = {
  ...Colors
};

export const ColorsHelper = {
  setColor,
  green(value: any) { return setColor("green", value); },
  cyan(value: any) { return setColor("cyan", value); },
  red(value: any) { return setColor("red", value); },
  blue(value: any) { return setColor("blue", value); },
  yellow(value: any) { return setColor("yellow", value); },
  magenta(value: any) { return setColor("magenta", value); },
  white(value: any) { return setColor("white", value); }
};

function createStamp(date?: Date): string {
  const tData = date || new Date();
  return `[${ColorsHelper.cyan(`${tData.toLocaleDateString()} ${tData.toLocaleTimeString()}:${tData.getMilliseconds()}`)}]-`;
}

function createType(type: LogLevel): string {
  let color: string;
  let tps: string;
  switch (type) {
    case LogLevel.FATAL:
    case LogLevel.ERROR: [color, tps] = ["red", "ERROR"]; break;
    case LogLevel.WARN: [color, tps] = ["yellow", "WARN"]; break;
    case LogLevel.INFO: [color, tps] = ["blue", "INFO"]; break;
    case LogLevel.DEBUG: [color, tps] = ["green", "DEBUG"]; break;
    default: [color, tps] = ["white", "TRACE"];
  }
  return `[${ColorsHelper[color](tps)}]-`;
}

function createModule(msg: any, upcase = false): string {
  const c: string = (msg || "").toString();
  return `[${ColorsHelper.magenta(upcase ? c.toUpperCase() : c)}]-`;
}

function createMethod(msg: any, upcase = false): string {
  const c: string = (msg || "").toString();
  return `[${ColorsHelper.blue(upcase ? c.toUpperCase() : c)}]-`;
}

export class BonbonsLogger implements GlobalLogger {

  constructor(private env: IENV) { }

  private log(type: LogLevel, ...msgs: any[]): void {
    if (msgs.length === 0) return;
    let logmsg: string;
    let [main, summary, details, ...mores] = msgs;
    let tMsgs;
    switch (msgs.length) {
      case 1: tMsgs = ["x", "x", ...msgs]; break;
      case 2: tMsgs = ["x", ...msgs]; break;
      case 3:
      default: tMsgs = msgs;
    }
    [main, summary, details, ...mores] = tMsgs;
    const more = (mores || []).map(i => `-------------\n${JSON.stringify(i)}`);
    logmsg = `${createStamp()}${createType(type)}${createModule(main, true)}${createMethod(summary)} ${details} ${more.length > 0 ? `\n--------------\nMore: \n${more}` : ""}`;
    console.log(logmsg);
  }

  trace(...msgs: any[]): void {
    if (this.env.mode === "production") return;
    if (!this.env.trace) return;
    return this.log(LogLevel.TRACE, ...msgs);
  }

  debug(...msgs: any[]): void {
    if (this.env.mode === "production") return;
    return this.log(LogLevel.DEBUG, ...msgs);
  }

  info(...msgs: any[]): void {
    return this.log(LogLevel.INFO, ...msgs);
  }

  warn(...msgs: any[]): void {
    return this.log(LogLevel.WARN, ...msgs);
  }

  error(...msgs: any[]): void {
    return this.log(LogLevel.ERROR, ...msgs);
  }

}
