import isBrowser from "#is-browser";

import { browserLogger } from "./browserLogger.ts";
import { nodeLogger } from "./nodeLogger.ts";

export const logger = isBrowser ? browserLogger : nodeLogger;
