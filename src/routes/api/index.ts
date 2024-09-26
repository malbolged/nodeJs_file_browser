import express from "express";

import { getPath } from "./files";

const apiRoutes = express.Router({ mergeParams: true }).use("/files", getPath);

export { apiRoutes };
