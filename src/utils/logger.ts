import logger from "pino";
import dayjs from "dayjs";
import AppConfig from "../config/appConfig";
const config = AppConfig.getInstance().config;

const level = config.logLevel;

const log = logger({
  transport: {
    target: "pino-pretty",
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
