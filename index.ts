import path from "path";
import { BonbonsGlobal } from "../utils";

BonbonsGlobal.folderRoot = path.resolve(__dirname);

export * from "./src";
