import express from "express";
import helmet from "helmet";
import router from "./routes/v1";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middlewares/error";
import deserializeUser from "./middlewares/deserializeUser";

const app = express();

// set security HTTP headers
app.use(helmet());

// logger
app.use(morgan("dev"));

// TODO: Implement CORS

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// get user by access token
app.use(deserializeUser);

// TODO: sanitize request data
//app.use(xss());
//app.use(mongoSanitize());

// v1 api routes
app.use("/api/v1", router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
