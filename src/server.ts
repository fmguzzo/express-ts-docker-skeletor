import http from "http";
import { mongoConnect } from "./utils/connectMongo";
import log from "./utils/logger";
import AppConfig from "./config/appConfig";
import app from "./app";

const { port } = AppConfig.getInstance().config;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  // other

  server.listen(port, () => {
    log.info(`App started at [http://localhost:${port}]`);
  });
}

startServer();
