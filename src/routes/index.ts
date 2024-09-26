import express from "express";

import config from "../configs";
import { apiRoutes } from "./api";
import { notFound } from "./not-found";
import { getServerHeartbeat } from "./heartbeat";

const routes = express
  .Router({ mergeParams: true })
  .use(
    config.api.path + (config.api.version ? `/v${config.api.version}` : ""),
    apiRoutes,
  )
  .use("/heartbeat", getServerHeartbeat)
  .use("/404", notFound)
  .use("/", notFound);

export { routes };
