import isBrowser from "#is-browser";

import { browserLogger } from "./browserLogger";
import { nodeLogger } from "./nodeLogger";

export const logger = isBrowser ? browserLogger : nodeLogger;
