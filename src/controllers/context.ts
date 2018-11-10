import { IBonbonsContext, KOARequest, KOAResponse, KOAContext } from "@bonbons/contracts/dist/src/private-api";

export class Context implements IBonbonsContext {

  public get request(): KOARequest { return this.source.request; }
  public get response(): KOAResponse { return this.source.response; }

  public get query(): { [prop: string]: any; } { return this.source.query || {}; }
  public get params(): { [prop: string]: any; } { return (<any>this.source).params || {}; }
  public get form(): { [prop: string]: any; } { return this.source.body || {}; }

  public readonly views: { [prop: string]: any; } = {};

  constructor(private source: KOAContext) { }

  get(name: string, type: StringConstructor): string | null;
  get(name: string, type: BooleanConstructor): boolean | null;
  get(name: string, type: NumberConstructor): number | null;
  get(name: string): string | null;
  get(name: string, type?: any): any {
    switch (<any>type) {
      case Number: return this.getNumber(name);
      case Boolean: return this.getBoolean(name);
      default: return this.query[name] || this.params[name] || this.form[name];
    }
  }

  getNumber(name: string): number | null {
    const value = Number(this.query[name] || this.params[name] || this.form[name]);
    return Number.isNaN(value) ? null : value;
  }

  getBoolean(name: string): boolean | null {
    const value = this.query[name] || this.params[name] || this.form[name];
    return value === "true" ? true : value === "false" ? false : null;
  }

  setStatus(status: number): Context {
    this.source.status = status;
    return this;
  }

  setType(type: string): Context {
    this.source.type = type;
    return this;
  }

}