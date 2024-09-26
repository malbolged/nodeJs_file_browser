import dotenv from "dotenv";
import { ConfigInterface } from "./types";

dotenv.config();

/* istanbul ignore next */
const config: ConfigInterface = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 5471,
  api: {
    path: "/api",
    version: process.env.API_VERSION
      ? parseInt(process.env.API_VERSION)
      : undefined,
  },
};

export default config;
