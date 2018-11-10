import { RouteResult } from "@bonbons/contracts";
import { DI_CONTAINER, ConfigsCollection } from "../../di";
import { RenderService } from "../../plugins";

export class RenderResult implements RouteResult {

  public type = "text/html";

  constructor(private name: string, private data: string) { }

  public toString(configs: ConfigsCollection) {
    const r = configs.get(DI_CONTAINER).get(RenderService);
    return <Promise<string>>r.render(this.name, this.data);
  }

}