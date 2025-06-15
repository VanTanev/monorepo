import isDev from "#is-development";
import { pino } from "pino";

const pinoLogger = pino();
export function nodeLogger(...msg: string[]) {
  if (isDev) {
    console.log("LOGGING FROM @monorepo/logger");
  }
  pinoLogger.info({ msg });
}
