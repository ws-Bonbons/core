import "reflect-metadata";
import { PARAMS_META_KEY, CTOR_META_KEY, PIPE_META_KEY, IBonbonsControllerMetadata, IBonbonsPipeMetadata } from "./declares";

export function getDependencies(target): any[] {
  return Reflect.getMetadata(PARAMS_META_KEY, target) || [];
}

export class ReflectionConstructor {

  public GetInjections(target: any) {
    return getDependencies(target);
  }

  public GetControllerMetadata(target: any): IBonbonsControllerMetadata {
    return Reflect.getMetadata(CTOR_META_KEY, target) || { router: { prefix: "/", routes: {} }, pipes: [], middlewares: [] };
  }

  public SetControllerMetadata(target: any, meta: IBonbonsControllerMetadata) {
    Reflect.defineMetadata(CTOR_META_KEY, meta, target);
  }

  public GetPipeMetadata(target: any): IBonbonsPipeMetadata {
    return Reflect.getMetadata(PIPE_META_KEY, target) || { params: {}, keyMatch: [] };
  }

  public SetPipeMetadata(target: any, meta: IBonbonsPipeMetadata) {
    Reflect.defineMetadata(PIPE_META_KEY, meta, target);
  }

}

export const Reflection = new ReflectionConstructor();
