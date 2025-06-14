import isDev from "#is-development";

export function browserLogger(...msg: string[]) {
  if (isDev) {
    console.log("LOGGING FROM @monorepo/logger");
  }
  console.log(...msg);
}
