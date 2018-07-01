import path from "path";
import { BonbonsGlobal } from "@bonbons/utils";

BonbonsGlobal.folderRoot = path.resolve(__dirname);

export * from "./src";
