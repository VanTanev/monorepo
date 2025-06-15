import express from "express";

import { logger } from "@monorepo/logger";

export function createServer(): express.Express {
  const app = express();
  app.get("/", (_, res) => {
    return res.json({ status: "running" });
  });

  return app;
}

function main() {
  const port = process.env.PORT || 5001;
  const server = createServer();

  server.listen(port, () => {
    logger(
      `${process.env.MY_APP_ID}: server-express is running on http://localhost:${port}`,
    );
  });
}

main();
