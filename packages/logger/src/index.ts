export function logger(...msg: string[]) {
  console.log("LOGGING FROM @monorepo/logger");
  console.log(...msg);
}
