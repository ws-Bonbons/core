import { BonbonsToken, ConfigsCollection } from "../../di";
export declare abstract class ConfigService implements ConfigsCollection {
    abstract get<T>(token: BonbonsToken<T>): T;
}
