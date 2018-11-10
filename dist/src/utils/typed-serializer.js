"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cerialize_1 = require("cerialize");
exports.Serialize = cerialize_1.serializeAs;
exports.Deserialize = cerialize_1.deserializeAs;
exports.Extends = cerialize_1.inheritSerialization;
class TypedSerializerCreator {
    ToJSON(obj, format = false) {
        return JSON.stringify(cerialize_1.Serialize(obj), null, format ? "  " : 0);
    }
    // tslint:disable-next-line:ban-types
    FromJSON(json, type) {
        return !type ?
            cerialize_1.Deserialize(JSON.parse(json)) :
            cerialize_1.GenericDeserialize(JSON.parse(json), type);
    }
    ToObject(obj, format = false) {
        return cerialize_1.Serialize(obj);
    }
    // tslint:disable-next-line:ban-types
    FromObject(json, type) {
        return !type ?
            cerialize_1.Deserialize(json) :
            cerialize_1.GenericDeserialize(json, type);
    }
}
exports.TypedSerializerCreator = TypedSerializerCreator;
/** Bonbons built-in static type contract serialization tool (based on cerialize) */
exports.TypedSerializer = new TypedSerializerCreator();
//# sourceMappingURL=typed-serializer.js.map