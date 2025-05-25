import pino from "pino";

export function browserLogger(...msg: string[]) {
  console.log("LOGGING FROM @monorepo/logger");
  console.log(...msg);
}

const pinoLogger = pino();
export function nodeLogger(...msg: string[]) {
  console.log("LOGGING FROM @monorepo/logger");
  pinoLogger.info({ msg });
}
