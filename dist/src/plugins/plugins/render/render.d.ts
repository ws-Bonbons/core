import { defaultViewTplRender } from "./simple.render";
import { ejsViewTplRender } from "./ejs.render";
import { ConfigsCollection } from "../../../di";
export { defaultViewTplRender };
export declare const defaultViewTplRenderOptions: {
    render: typeof defaultViewTplRender;
    extensions: string;
    root: string;
    cache: {};
    options: {};
};
export declare const Renders: {
    default: typeof defaultViewTplRender;
    ejs: typeof ejsViewTplRender;
};
export declare abstract class RenderService {
    abstract render(templateName: string, data: any): string | undefined | Promise<string | undefined>;
}
export declare class BonbonsRender implements RenderService {
    private configs;
    constructor(configs: ConfigsCollection);
    render(templateName: string, data: any): Promise<string | undefined>;
}
