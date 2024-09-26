import { expect } from "chai";
import express from "express";
import supertest from "supertest";
import { describe, it } from "mocha";

import { ApiError, ErrorStatusCode } from "../../models";
import { ExpressServerApp } from "../../express_server_app";

describe("Test ErrorHandling Middleware", () => {
  const app = ExpressServerApp.fromConfig({
    router: express
      .Router({ mergeParams: true })
      .get("/test1", () => {
        throw Error();
      })
      .get("/test2", (_, __, next) => {
        return next(new ApiError("Not found!", ErrorStatusCode.NOT_FOUND));
      }),
  }).getApp();

  it("should return default Error response", async () => {
    const actualResult = await supertest(app)
      .get("/test1")
      .expect("Content-Type", /json/)
      .expect(ErrorStatusCode.INTERNAL_SERVER_ERROR)
      .then((res) => res.body);

    expect(actualResult).to.deep.equal({
      success: false,
      message:
        "Something went wrong! The server encountered an error and was unable to complete your request.",
    });
  });

  it("should return defined ApiError response", async () => {
    const actualResult = await supertest(app)
      .get("/test2")
      .expect("Content-Type", /json/)
      .expect(ErrorStatusCode.NOT_FOUND)
      .then((res) => res.body);

    expect(actualResult).to.deep.equal({
      success: false,
      message: "Not found!",
    });
  });
});
