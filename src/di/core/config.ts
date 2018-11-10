import { BonbonsConfigCollection, BonbonsToken, BonbonsEntry } from "@bonbons/contracts/dist/src/private-api";

type Configs = BonbonsConfigCollection;
type Token<T> = BonbonsToken<T>;

export class ConfigCollection implements Configs {

  protected _pool = new Map<symbol, { value: any }>();

  public set<T>(token: Token<T>, entry: T): void {
    this._pool.set(token.key, { value: entry });
  }

  public get<T>(token: Token<T>): T {
    const entry = this._pool.get(token.key);
    return entry && entry.value;
  }

  public toArray(): BonbonsEntry<any>[] {
    return Array.from(this._pool.entries()).map(([sb, { value }]) => ({ token: { key: sb }, value }));
  }

}