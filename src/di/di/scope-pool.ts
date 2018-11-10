import { InjectToken } from "./declares";
import { KOAContext } from "@bonbons/contracts/dist/src/private-api";

export class DIScopePool {

  private instanceMap = new Map<InjectToken, any>();

  constructor(private scopeMetadata: { ctx?: KOAContext }) { }

  public get metadata() { return this.scopeMetadata; }

  setInstance<T>(token: InjectToken<T>, instance: T): void {
    this.instanceMap.set(token, instance || null);
  }

  getInstance<T>(token: InjectToken<T>): T | null | undefined {
    const instance = this.instanceMap.get(token);
    return instance;
  }

  update(newMaps: Array<[InjectToken, any]>): void;
  update(resolver: <T>(token: InjectToken<T>) => T | null): void;
  update(args: any): void {
    if (args instanceof Array) {
      const newMaps: Array<[InjectToken, any]> = args;
      newMaps.forEach(([key, instance]) => {
        this.instanceMap.set(key, instance);
      });
    } else {
      const resolver: <T>(token: InjectToken<T>) => T | null = args;
      Array.from(this.instanceMap.keys()).forEach(key => {
        this.instanceMap.set(key, resolver(key));
      });
    }
  }

  dispose() {
    this.scopeMetadata = undefined;
    this.instanceMap = undefined;
  }

}