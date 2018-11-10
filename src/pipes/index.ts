import { IBonbonsContext, IPipeBundle, IPipe } from "@bonbons/contracts/dist/src/private-api";
import { Reflection } from "../di";
import { clone } from "../utils";

export function createPipeInstance<T extends IPipe>(type: IPipeBundle<T>, depts: any[], $$ctx?: IBonbonsContext) {
  const { target, params } = type;
  const { keyMatch } = Reflection.GetPipeMetadata(target.prototype);
  const initFn = (<any>target.prototype).pipeOnInit;
  const instance = new target(...depts);
  instance.context = <IBonbonsContext>$$ctx;
  const paramsCopy = clone(params);
  Object.defineProperty(instance, "params", { enumerable: true, configurable: false, get: () => paramsCopy });
  (<[(string | number), string][]>keyMatch).forEach(([old, newKey]) => instance[newKey] = (<any>params)[old]);
  initFn && (initFn.bind(instance))();
  return instance;
}
