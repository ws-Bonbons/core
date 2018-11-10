import { default as uuid } from "uuid/v4";

export const UUID = {
  Create(): string { return uuid(); }
};
