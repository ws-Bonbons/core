
export function defaultViewTplRender(tpl: string, data?: any) {
  const reg = /{{([^}{]+)}}/g;
  if (!data) return tpl;
  return tpl.replace(reg, ($match: string, $1: string) => {
    try {
      const ps = ($1 || "").split(".");
      let value = data;
      ps.forEach(key => {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          value = value[key];
        }
      });
      return value;
    } catch (error) {
      return $match;
    }
  });
}