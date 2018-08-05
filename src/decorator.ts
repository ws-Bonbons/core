import { Constructor } from "@bonbons/contracts";
import { BonbonsServerConfig } from "@bonbons/contracts/dist/src/private-api";
import { BonbonsServer, BaseApp } from "./server";
import { DI_CONTAINER } from "@bonbons/di";
import { Logger } from "@bonbons/plugins/dist/src/public-api";

/**
 * Create a Bonbons.koa App server
 * ---
 * @description
 * @author Big Mogician
 * @export
 * @param {BonbonsServerConfig} config
 * @returns
 */
export function BonbonsApp(config: BonbonsServerConfig) {
  return function <T extends BaseApp>(target: Constructor<T>) {
    const theStartup = target.prototype.start;
    target.prototype.start = function () {
      const app = new BonbonsServer(config);
      app.start();
      const conf = app.getConfigs();
      const instance: any = this;
      instance._configs = { get: conf.get.bind(conf) };
      const di = instance._configs.get(DI_CONTAINER);
      instance.logger = di.get(Logger);
      theStartup && theStartup.bind(instance)();
    };
  };
}

/** Create a Bonbons.koa App server */
export const BKoa = BonbonsApp;