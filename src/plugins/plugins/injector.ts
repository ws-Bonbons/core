import { ReadonlyDIContainer, InjectDIToken } from "@bonbons/contracts/dist/src/private-api";

export abstract class InjectService implements ReadonlyDIContainer {
  abstract get<T>(token: InjectDIToken): T;
}
