import { ReadonlyDIContainer, InjectDIToken } from "@bonbons/contracts/dist/src/private-api";
export declare abstract class InjectService implements ReadonlyDIContainer {
    abstract get<T>(token: InjectDIToken): T;
}
