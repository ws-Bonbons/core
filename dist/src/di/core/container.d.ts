import { BaseDIContainer } from "./di-base";
import { Implement, InjectScope, InjectToken, DIContainerEntry } from "./declares";
export declare type Scope = InjectScope;
export declare class DIContainer extends BaseDIContainer {
    register<K, V>(token: InjectToken<K>, imp: Implement<V>, scope: InjectScope): void;
    createFactory<T>(item: DIContainerEntry<T>): import("@bonbons/contracts/dist/src/contracts/injectable").ImplementFactory<any>;
}
