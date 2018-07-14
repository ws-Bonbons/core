import { Constructor, Contracts as c } from "@bonbons/contracts";
import { BonbonsServer, BaseApp } from "./server";
import { GlobalLogger } from "@bonbons/plugins";
import { DI_CONTAINER } from "@bonbons/di";

/**
 * Create a Bonbons.koa App server
 * ---
 * @description
 * @author Big Mogician
 * @export
 * @param {BonbonsServerConfig} config
 * @returns
 */
export function BonbonsApp(config: c.BonbonsServerConfig) {
  return function <T extends BaseApp>(target: Constructor<T>) {
    const theStartup = target.prototype.start;
    target.prototype.start = function () {
      const app = new BonbonsServer(config);
      app.start();
      const conf = app.getConfigs();
      this._configs = { get: conf.get.bind(conf) };
      const di = this._configs.get(DI_CONTAINER);
      this.logger = di.get(GlobalLogger);
      theStartup && theStartup.bind(this)();
    };
  };
}

/** Create a Bonbons.koa App server */
export const BKoa = BonbonsApp;