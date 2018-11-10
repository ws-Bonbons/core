export const Colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m\x1b[1m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  white: "\x1b[37m"
};

export function setColor(name: string, value: any): string {
  return `${Colors[name]}${value}${Colors.reset}`;
}
