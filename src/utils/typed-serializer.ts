import {
  serializeAs, deserializeAs,
  inheritSerialization, Serialize,
  Deserialize, GenericDeserialize
} from "cerialize";
import {
  Constructor,
  IStaticTypedResolver
} from "@bonbons/contracts";

export class TypedSerializerCreator implements IStaticTypedResolver {

  public ToJSON(obj: any, format = false): string {
    return JSON.stringify(Serialize(obj), null, format ? "  " : 0);
  }

  // tslint:disable-next-line:ban-types
  public FromJSON<T>(json: string, type?: Constructor<T>): T {
    return !type ?
      Deserialize(JSON.parse(json)) as T :
      GenericDeserialize(JSON.parse(json), type) as T;
  }

  public ToObject(obj: any, format = false): any {
    return Serialize(obj);
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