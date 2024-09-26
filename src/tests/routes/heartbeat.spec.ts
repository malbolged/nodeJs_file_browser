import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";

import { routes } from "../../routes";
import { ExpressServerApp } from "../../express_server_app";

describe("Test /heartbeat", () => {
  const app = ExpressServerApp.fromConfig({
    router: routes,
  }).getApp();

  it("heartbeat should be current date", async () => {
    const currentDate = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const actualResult = await supertest(app)
      .get("/heartbeat")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => res.body);

    expect(actualResult)
      .to.have.property("date")
      .that.match(new RegExp("^" + currentDate.toString() + "_.*", "g"));
  });
});
