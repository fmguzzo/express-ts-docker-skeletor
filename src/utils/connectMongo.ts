import mongoose, { ConnectOptions } from "mongoose";
import AppConfig from "../config/appConfig";
import log from "../utils/logger";

// from v6+ does not exist in ConnectOptions (useUnifiedTopology y useNewUrlParser)
// these options are NO longer required, as they have been included as defaults.

/**
 * for other options admited we will use:
 * const mongodb: {
 *   url: string;
 *   options: ConnectOptions;
 * } = "mongodb";
 **/

/**
 * At the moment we leave those options in config
 * and cast (config.mongodb.options as ConnectOptions)
 * to avoid type error.
 * In future we will eliminate this options and connect
 * only with uri. We will define others options available
 * if it's necesary
 **/

const config = AppConfig.getInstance().config;

// mongoose.connection.once("open", () => {
//   console.log("MongoDB connection ready!");
// });

mongoose.connection.on("error", (err) => {
  log.error(`Could not connect to Database: ${err.message}`);
});

export async function mongoConnect() {
  //await mongoose.connect(MONGO_URL);
  try {
    const db = await mongoose.connect(
      config.mongodb.uri as string,
      config.mongodb.options as ConnectOptions
    );
    log.info(
      `MongoDB Connected on [Host: ${db.connection.host}] [DB: ${db.connection.name}]`
    );
  } catch (err: any) {
    log.error(`Could not connect to Database: ${err.message}`);
    // TODO: log error but not stop server
    process.exit(1);
  }
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
