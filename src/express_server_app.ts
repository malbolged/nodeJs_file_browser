import cors from "cors";
import { ListenOptions } from "net";
import responseTime from "response-time";
import http, { Server as HttpServer } from "http";
import express, { Express, Router } from "express";

import { errorHandlingMiddleware } from "./middlewares";

interface IExpressServerAppConfig {
  router?: Router;
}

class ExpressServerApp {
  private app: Express;
  private server: HttpServer;

  constructor(config: IExpressServerAppConfig) {
    this.app = express();

    this.app.use(
      cors({
        origin: "*",
        methods: ["GET"],
        allowedHeaders: ["X-Requested-With", " content-type"],
        exposedHeaders: "Content-Disposition",
        optionsSuccessStatus: 200,
      }),
    );
    this.app.use(express.json());
    this.app.use(responseTime());

    if (config.router) {
      this.app.use(config.router);
    }

    this.app.use(errorHandlingMiddleware);

    this.server = http.createServer(this.app);

    /* istanbul ignore next */
    this.server.addListener("listening", () => {
      console.info("The server is running!");
    });
    /* istanbul ignore next */
    this.server.addListener("error", (error) => {
      console.error("Critical server error: ", error);
    });
    /* istanbul ignore next */
    this.server.addListener("close", () => {
      console.info(`The server is closed !`);
    });
  }

  static fromConfig(config: IExpressServerAppConfig): ExpressServerApp {
    return new ExpressServerApp(config);
  }

  start(startArgs: ListenOptions = { port: 3000 }): HttpServer {
    return this.server.listen(startArgs);
  }

  stop(): HttpServer {
    return this.server.close();
  }

  getApp(): Express {
    return this.app;
  }
}

export type { IExpressServerAppConfig };

export { ExpressServerApp };
