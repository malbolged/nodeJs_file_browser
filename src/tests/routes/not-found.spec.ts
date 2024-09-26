import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";

import { routes } from "../../routes";
import { ExpressServerApp } from "../../express_server_app";

describe("Test /404", () => {
  const app = ExpressServerApp.fromConfig({
    router: routes,
  }).getApp();

  it("404 should return message `Error 404: Resource Not Found`", async () => {
    const actualResult = await supertest(app)
      .get("/404")
      .expect("Content-Type", /json/)
      .expect(404)
      .then((res) => res.body);

    expect(actualResult).to.have.property("success").that.eq(false);
    expect(actualResult)
      .to.have.property("message")
      .that.eq("Error 404: Resource Not Found");
  });

  it("randomUrl should return message `Error 404: Resource Not Found`", async () => {
    const randomResult = await supertest(app)
      .get(`/${Math.floor(Math.random())}`)
      .expect("Content-Type", /json/)
      .expect(404)
      .then((res) => res.body);

    expect(randomResult).to.have.property("success").that.eq(false);
    expect(randomResult)
      .to.have.property("message")
      .that.eq("Error 404: Resource Not Found");
  });
});
