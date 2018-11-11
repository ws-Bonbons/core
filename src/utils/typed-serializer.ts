import {
  serializeAs, deserializeAs,
  inheritSerialization, Serialize,
  Deserialize, GenericDeserialize
} from "cerialize";
import {
  Constructor,
  IStaticTypedResolver,
  IStaticSerializeOptions
} from "@bonbons/contracts";

export class TypedSerializerCreator implements IStaticTypedResolver {

  public ToJSON<T = any>(obj: any, options?: boolean | Partial<IStaticSerializeOptions<T>>): string {
    if (options === undefined) options = { format: false };
    if (typeof options === "boolean") options = { format: options };
    return JSON.stringify(Serialize(obj, options.type), null, options.format ? "  " : 0);
  }

  public FromJSON<T = any>(json: string, type?: Constructor<T>): T {
    return !type ?
      Deserialize(JSON.parse(json)) as T :
      GenericDeserialize(JSON.parse(json), type) as T;
  }

  public ToObject<T = any>(obj: any, options?: boolean | Partial<IStaticSerializeOptions<T>>): any {
    if (options === undefined) options = { format: false };
    if (typeof options === "boolean") options = { format: options };
    return Serialize(obj, options.type);
  }

  // tslint:disable-next-line:ban-types
  public FromObject<T>(json: any, type?: Constructor<T>): T {
    return !type ?
      Deserialize(json) as T :
      GenericDeserialize(json, type) as T;
  }

}

/** Bonbons built-in static type contract serialization tool (based on cerialize) */
export const TypedSerializer = new TypedSerializerCreator();

export {
  serializeAs as Serialize,
  deserializeAs as Deserialize,
  inheritSerialization as Extends
};