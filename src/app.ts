import * as dotenv from "dotenv";
dotenv.config();

// App.js
import express, { Response, Request, NextFunction } from "express";
import path from "path";
import logger from "morgan";
import helmet from "helmet";
import { router as indexRouter } from "./routes/index";
import { router as apiRouter } from "./routes/api.js";
import { router as healthRouter } from "./routes/health.js";
import { HTTP_STATUS_ERROR_CODES } from "./utils/constants";

type CustomError = Error & { status?: number };

let port: string;

/**
 * Start the express App and configures it. Everything is done in an async function now so we can
 * use async/await
 *
 */
export async function startAsyncApp(): Promise<express.Application> {

  port = String('3000');

  // start the app
  const app = express();

  // adding helmet
  app.use(helmet());


  // view engine setup
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "pug");

  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Setup the routes
  app.use("/", indexRouter);
  app.use("/health", healthRouter);
  app.use("/api/", apiRouter);

  // catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: NextFunction): void => {
    // TODO: create or use an actual http error object creater.
    const err: CustomError = new Error(
      `404 Not Found. The originalUrl ${req.originalUrl} was not found. Host = ${req.hostname}.`,
    );
    err.status = 404;
    next(err);
  });

  // TODO: verify positional params are proper
  // error handler
  (app).use((err: CustomError, req: Request, res: Response): void => {
    // set locals, only providing error in development

    res.locals.message = err.message;

    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || HTTP_STATUS_ERROR_CODES.INTERNAL_SERVER_ERROR).json({error: 'general error'});
  });

  // Initialize Services

  return(app);
};

export { port };
