import { BonbonsToken, ConfigsCollection } from "../../di";

export abstract class ConfigService implements ConfigsCollection {
  abstract get<T>(token: BonbonsToken<T>): T;
}