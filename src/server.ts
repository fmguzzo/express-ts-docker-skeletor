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
  const user = await prisma.user.create({
    data: {
      email: "email",
      firstName: "firstName",
    },
  });
  console.log(user);
  const users = await prisma.user.findMany({
    where: {
      id: { gte: 0 },
    },
  });
  console.log(users);

  server.listen(port, () => {
    log.info(`App started at [http://localhost:${port}]`);
  });
}

startServer();
