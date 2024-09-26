import fs from "fs";
import sinon from "sinon";
import { expect } from "chai";
import supertest from "supertest";
import { describe, beforeEach, afterEach, it } from "mocha";

import config from "../../../configs";
import { routes } from "../../../routes";
import { FilesController } from "../../../controllers";
import { ExpressServerApp } from "../../../express_server_app";
import { FileSystemFile, FileSystemFolder } from "../../../models";

const route =
  config.api.path +
  (config.api.version ? `/v${config.api.version}` : "") +
  "/files";

describe(`GET ${route}`, () => {
  const app = ExpressServerApp.fromConfig({
    router: routes,
  }).getApp();

  beforeEach(() => {
    sinon.stub(console, "error").callsFake((p) => p);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return JSON if the path is a folder", async () => {
    const folderPath = "/folder";
    const mockPathContent = FileSystemFolder.fromJson({
      name: "folder",
      path: folderPath,
      content: [],
    });

    sinon.stub(FilesController, "getPathContent").returns(mockPathContent);

    const actualResult = await supertest(app)
      .get(route)
      .expect("Content-Type", /json/)
      .expect(200)
      .query({ path: folderPath })
      .then((res) => res.body);

    expect(actualResult).to.deep.equal({
      success: true,
      result: mockPathContent.toJson(),
    });
  });

  it("should download a file if the path is a file", async () => {
    const filePath = "/file.txt";
    const mockPathContent = FileSystemFile.fromJson({
      name: "file.txt",
      path: "/",
    });

    sinon.stub(FilesController, "getPathContent").returns(mockPathContent);

    const response = await supertest(app).get(route).query({ path: filePath });

    expect(response.headers)
      .to.have.property("content-disposition")
      .that.eq(`attachment; filename=${mockPathContent.getName()}`);
  });

  it("should call next with an error if the path does not exist (Folder)", async () => {
    const folderPath = "/invalid/path";

    const fsStatSyncStub: sinon.SinonStub = sinon.stub(fs, "lstatSync");

    fsStatSyncStub.returns({ isFile: () => false });

    const response = await supertest(app)
      .get(route)
      .query({ path: folderPath })
      .expect("Content-Type", /json/)
      .expect(404)
      .then((res) => res.body);

    expect(response).to.have.property("success").that.eq(false);
    expect(response)
      .to.have.property("message")
      .that.eq("Could not access path");
  });

  it("should call next with an error if the path does not exist (File)", async () => {
    const folderPath = "/invalid/path/file.txt";

    const fsStatSyncStub: sinon.SinonStub = sinon.stub(fs, "lstatSync");

    fsStatSyncStub.returns({ isFile: () => true });

    const response = await supertest(app)
      .get(route)
      .query({ path: folderPath })
      .expect("Content-Type", /json/)
      .expect(404)
      .then((res) => res.body);

    expect(response).to.have.property("success").that.eq(false);
    expect(response)
      .to.have.property("message")
      .that.eq("Could not access path");
  });

  it("should handle download errors correctly", async () => {
    const filePath = "/some/file.txt";

    const response = await supertest(app)
      .get(route)
      .query({ path: filePath })
      .expect("Content-Type", /json/)
      .expect(404)
      .then((res) => res.body);

    expect(response).to.have.property("success").that.eq(false);
    expect(response)
      .to.have.property("message")
      .that.eq("Could not access path");
  });
});
