import { JsonFormOptions, URLFormOptions, TextFormOptions } from "@bonbons/contracts";
declare type FormDecorator = <T>(target: T, propertyKey: string, index_descriptor: number | TypedPropertyDescriptor<T>) => void;
/** Get form message from body when type is [application/json] */
export declare function FromBody(): FormDecorator;
/** Get form message from body when default type is [application/json] */
export declare function FromBody(type: string): FormDecorator;
/** Get form message from body when default type is [application/json] */
export declare function FromBody(config: Partial<JsonFormOptions>): FormDecorator;
/** Get form message from body when type is [application/x-www-form-urlencoded] */
export declare function FromForm(): FormDecorator;
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export declare function FromForm(type: string): FormDecorator;
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export declare function FromForm(config: Partial<URLFormOptions>): FormDecorator;
/** Get form message from body when type is [text/plain] */
export declare function TextBody(): FormDecorator;
/** Get form message from body when default type is [text/plain] */
export declare function TextBody(type: string): FormDecorator;
/** Get form message from body when default type is [text/plain] */
export declare function TextBody(config: Partial<TextFormOptions>): FormDecorator;
export {};
