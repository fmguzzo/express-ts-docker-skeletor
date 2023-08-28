import http from "http";
// import { mongoConnect } from "./utils/connectMongo";
import { prisma } from "./utils/prismaClient";

import log from "./utils/logger";
import AppConfig from "./config/appConfig";
import app from "./app";

const { port } = AppConfig.getInstance().config;

const server = http.createServer(app);

async function startServer() {
  // others
  
  server.listen(port, () => {
    log.info(`App started at [http://localhost:${port}]`);
  });
}

startServer();
