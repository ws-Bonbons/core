import { default as decamelize } from "decamelize";
import { default as camel } from "camelcase";


export const Formater = {
  ToCamelCase(str: string) {
    return camel(str);
  },
  DeCamelCase(str: string, sec = "-") {
    return decamelize(str, sec);
  }
};
