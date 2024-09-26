import { RequestHandler } from "express";

import { ApiError, ErrorStatusCode } from "../models";

const notFound: RequestHandler = (req, res, next) => {
  return next(
    new ApiError("Error 404: Resource Not Found", ErrorStatusCode.NOT_FOUND),
  );
};

export { notFound };
