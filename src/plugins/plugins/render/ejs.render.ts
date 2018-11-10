import * as ejs from "ejs";

export function ejsViewTplRender(tpl: string, data?: any, options?: any) {
  if (!data) return tpl;
  try {
    return ejs.compile(tpl, { ...options, _with: true })(Object.assign({}, data, { global }));
  } catch (error) {
    throw error;
  }
}