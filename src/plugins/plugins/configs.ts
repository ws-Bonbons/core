import { BonbonsToken, ConfigsCollection } from "@bonbons/di";

export abstract class ConfigService implements ConfigsCollection {
  abstract get<T>(token: BonbonsToken<T>): T;
}