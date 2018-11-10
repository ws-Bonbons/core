import { BaseDIContainer } from "./di-base";
import { Implement, InjectScope, InjectToken, DIContainerEntry } from "./declares";
import { getDependencies } from "./reflect";
import { ScopeID } from "@bonbons/contracts/dist/src/private-api";

export type Scope = InjectScope;

export class DIContainer extends BaseDIContainer {

  public register<K, V>(token: InjectToken<K>, imp: Implement<V>, scope: InjectScope) {
    this.set(token, {
      token,
      imp,
      scope,
      depts: getDependencies(imp)
    });
  }

  public createFactory<T>(item: DIContainerEntry<T>) {
    const { imp, depts } = item;
    if (!item.fac) {
      item.fac = (scopeId?: ScopeID) => new (imp)(...this.getDepedencies(depts, scopeId));
    }
    return item.fac;
  }

}