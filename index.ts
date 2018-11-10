import path from "path";
import { BonbonsGlobal } from "./src/utils";

BonbonsGlobal.folderRoot = path.resolve(__dirname);

export * from "./src";
