"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = (key) => ({ key: Symbol(`BONBONS-KOA2-TOKEN:${key}`) });
exports.ENV_MODE = exports.createToken("ENV_MODE");
exports.DEPLOY_MODE = exports.createToken("DEPLOY_MODE");
exports.CONFIG_COLLECTION = exports.createToken("CONFIG_COLLECTION");
exports.DI_CONTAINER = exports.createToken("DI_CONTAINER");
exports.STATIC_TYPED_RESOLVER = exports.createToken("STATIC_TYPED_RESOLVER");
exports.JSON_RESULT_OPTIONS = exports.createToken("JSON_RESULT_OPTIONS");
exports.STRING_RESULT_OPTIONS = exports.createToken("STRING_RESULT_OPTIONS");
exports.BODY_PARSE_OPTIONS = exports.createToken("BODY_PARSE_OPTIONS");
exports.JSON_FORM_OPTIONS = exports.createToken("JSON_FORM_OPTIONS");
exports.URL_FORM_OPTIONS = exports.createToken("URL_FORM_OPTIONS");
exports.TEXT_FORM_OPTIONS = exports.createToken("TEXT_FORM_OPTIONS");
//# sourceMappingURL=tokens.js.map