import { BonbonsToken as Token } from "@bonbons/di";
import { Constructor } from "@bonbons/contracts";
import { setColor } from "@bonbons/utils";
import { IENV } from "@bonbons/contracts/dist/src/private-api";
export declare const GLOBAL_LOGGER: Token<Constructor<GlobalLogger>>;
export declare abstract class GlobalLogger {
    constructor(env: IENV);
    abstract trace(...msgs: any[]): void;
    abstract debug(...msgs: any[]): void;
    abstract info(...msgs: any[]): void;
    abstract warn(...msgs: any[]): void;
    abstract error(...msgs: any[]): void;
}
export declare enum LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5
}
export declare const COLORS: {
    reset: string;
    red: string;
    green: string;
    blue: string;
    yellow: string;
    cyan: string;
    magenta: string;
    white: string;
};
export declare const ColorsHelper: {
    setColor: typeof setColor;
    green(value: any): string;
    cyan(value: any): string;
    red(value: any): string;
    blue(value: any): string;
    yellow(value: any): string;
    magenta(value: any): string;
    white(value: any): string;
};
export declare class BonbonsLogger implements GlobalLogger {
    private env;
    constructor(env: IENV);
    private log;
    trace(...msgs: any[]): void;
    debug(...msgs: any[]): void;
    info(...msgs: any[]): void;
    warn(...msgs: any[]): void;
    error(...msgs: any[]): void;
}
