import { IBonbonsContext, IPipeBundle, IPipe } from "@bonbons/contracts/dist/src/private-api";
export declare function createPipeInstance<T extends IPipe>(type: IPipeBundle<T>, depts: any[], $$ctx?: IBonbonsContext): IPipe<T>;
