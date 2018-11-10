import { serializeAs, deserializeAs, inheritSerialization } from "cerialize";
import { Constructor, IStaticTypedResolver } from "@bonbons/contracts";
export declare class TypedSerializerCreator implements IStaticTypedResolver {
    ToJSON(obj: any, format?: boolean): string;
    FromJSON<T>(json: string, type?: Constructor<T>): T;
    ToObject(obj: any, format?: boolean): any;
    FromObject<T>(json: any, type?: Constructor<T>): T;
}
/** Bonbons built-in static type contract serialization tool (based on cerialize) */
export declare const TypedSerializer: TypedSerializerCreator;
export { serializeAs as Serialize, deserializeAs as Deserialize, inheritSerialization as Extends };
