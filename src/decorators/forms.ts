import { JsonFormOptions, URLFormOptions, TextFormOptions, BaseFormOptions } from "@bonbons/contracts";
import * as d from "../di";
import * as c from "@bonbons/contracts/dist/src/private-api";
import { reroute } from "./method";

const { FormType } = c;
type FormType = c.FormType;
type FormDecorator = <T>(target: T, propertyKey: string, index_descriptor: number | TypedPropertyDescriptor<T>) => void;

// /** Get form message from body when type is [multiple/form-data] */
// export function FormData();
// /** Get form message from body when default type is [multiple/form-data] */
// export function FormData(type: string);
// export function FormData(type?: string) { return formDecoratorFactory(type, FormType.MultipleFormData, null); }

/** Get form message from body when type is [application/json] */
export function FromBody(): FormDecorator;
/** Get form message from body when default type is [application/json] */
export function FromBody(type: string): FormDecorator;
/** Get form message from body when default type is [application/json] */
export function FromBody(config: Partial<JsonFormOptions>): FormDecorator;
export function FromBody(config?: string | Partial<JsonFormOptions>): FormDecorator {
  return formDecoratorFactory(FormType.ApplicationJson, config);
}

/** Get form message from body when type is [application/x-www-form-urlencoded] */
export function FromForm(): FormDecorator;
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export function FromForm(type: string): FormDecorator;
/** Get form message from body when default type is [application/x-www-form-urlencoded] */
export function FromForm(config: Partial<URLFormOptions>): FormDecorator;
export function FromForm(config?: string | Partial<URLFormOptions>): FormDecorator {
  return formDecoratorFactory(FormType.UrlEncoded, config);
}

// /** Get form message from body when type is [application/octet-stream] */
// export function RawBody();
// /** Get form message from body when default type is [application/octet-stream] */
// export function RawBody(type: string);
// /** Get form message from body when default type is [application/octet-stream] */
// export function RawBody(config: BodyParser.Options);
// export function RawBody(config?: string | BodyParser.Options) {
//   return formDecoratorFactory(config && (typeof (config) === "string" ? config : config.type), FormType.Raw, config);
// }

/** Get form message from body when type is [text/plain] */
export function TextBody(): FormDecorator;
/** Get form message from body when default type is [text/plain] */
export function TextBody(type: string): FormDecorator;
/** Get form message from body when default type is [text/plain] */
export function TextBody(config: Partial<TextFormOptions>): FormDecorator;
export function TextBody(config?: string | Partial<TextFormOptions>): FormDecorator {
  return formDecoratorFactory(FormType.TextPlain, config);
}

function formDecoratorFactory(parser: FormType, config?: string | Partial<BaseFormOptions>): FormDecorator {
  const types = (config && (typeof (config) === "string" ? [config] : [])) || [];
  const configs = (typeof (config) === "string" ? {} : config) || {};
  configs.extends = [...(configs.extends || []), ...types];
  return function <T extends c.IBonbonsController>(target: T, propertyKey: string, index_descriptor: number | TypedPropertyDescriptor<T>) {
    const isParam = typeof index_descriptor === "number" && index_descriptor >= 0;
    const reflect = d.Reflection.GetControllerMetadata(target);
    if (isParam) {
      d.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { parser, options: configs, index: <number>index_descriptor } }));
    } else {
      d.Reflection.SetControllerMetadata(target, reroute(reflect, propertyKey, { form: { parser, options: configs } }));
    }
  };
}
