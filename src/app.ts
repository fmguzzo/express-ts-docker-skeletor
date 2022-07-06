import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import AppConfig from "./config/appConfig";
import createServer from "./utils/server";

const { port } = AppConfig.getInstance().config;

const app = createServer();

app.listen(port, async () => {
  log.info(`App started at [http://localhost:${port}]`);
  await connectToDb();
});
