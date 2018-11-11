import { serializeAs, deserializeAs, inheritSerialization } from "cerialize";
import { Constructor, IStaticTypedResolver, IStaticSerializeOptions } from "@bonbons/contracts";
export declare class TypedSerializerCreator implements IStaticTypedResolver {
    ToJSON<T = any>(obj: any, options?: boolean | Partial<IStaticSerializeOptions<T>>): string;
    FromJSON<T = any>(json: string, type?: Constructor<T>): T;
    ToObject<T = any>(obj: any, options?: boolean | Partial<IStaticSerializeOptions<T>>): any;
    FromObject<T>(json: any, type?: Constructor<T>): T;
}
/** Bonbons built-in static type contract serialization tool (based on cerialize) */
export declare const TypedSerializer: TypedSerializerCreator;
export { serializeAs as Serialize, deserializeAs as Deserialize, inheritSerialization as Extends };
