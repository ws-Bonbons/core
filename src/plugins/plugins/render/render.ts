import { defaultViewTplRender } from "./simple.render";
import { ejsViewTplRender } from "./ejs.render";
import { ConfigsCollection } from "../../../di";
import { TPL_RENDER_COMPILER } from "./base";

export { defaultViewTplRender };

export const defaultViewTplRenderOptions = {
  render: defaultViewTplRender,
  extensions: "html",
  root: "",
  cache: {},
  options: {}
};

export const Renders = {
  default: defaultViewTplRender,
  ejs: ejsViewTplRender
};

export abstract class RenderService {
  abstract render(templateName: string, data: any): string | undefined | Promise<string | undefined>;
}

// decorator injectable
(<any>RenderService.prototype).__valid = true;

export class BonbonsRender implements RenderService {

  constructor(private configs: ConfigsCollection) { }

  async render(templateName: string, data: any): Promise<string | undefined> {
    const { compiler } = this.configs.get(TPL_RENDER_COMPILER);
    try {
      const compiledFn = await (compiler && compiler(templateName, false));
      return compiledFn && compiledFn(data);
    } catch (error) {
      throw error;
    }
  }

}
