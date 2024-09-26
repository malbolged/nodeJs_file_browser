import fs from "fs";
import path from "path";
import sinon from "sinon";
import { expect } from "chai";
import { describe, it, beforeEach, afterEach } from "mocha";

import { FilesController } from "../../controllers";
import {
  ApiError,
  FileSystemFile,
  FileSystemFolder,
  ErrorStatusCode,
} from "../../models";

describe("FileController Tests", function () {
  let fsStatSyncStub: sinon.SinonStub;
  let fsReaddirSyncStub: sinon.SinonStub;
  let fsAccessSyncStub: sinon.SinonStub;

  beforeEach(() => {
    sinon.stub(path, "resolve").callsFake((p) => p);
    sinon.stub(console, "error").callsFake((p) => p);
    fsStatSyncStub = sinon.stub(fs, "lstatSync");
    fsReaddirSyncStub = sinon.stub(fs, "readdirSync");
    fsAccessSyncStub = sinon.stub(fs, "accessSync");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("FilesController.getPathContent()", () => {
    it("should return file content if the path is a file", () => {
      fsStatSyncStub.returns({ isFile: () => true });

      const fileMock = { name: "testFile.txt", path: "/testFile.txt" };
      const expectedFile = FileSystemFile.fromJson(fileMock);

      const result = FilesController.getPathContent(fileMock.path);

      expect(result).to.be.instanceOf(FileSystemFile);
      expect(result?.toString()).to.equal(expectedFile.toString());
    });

    it("should return folder content if the path is a folder", () => {
      fsStatSyncStub.returns({ isFile: () => false });
      fsReaddirSyncStub.returns([]);

      const folderMock = {
        name: "testFolder",
        path: "/testFolder",
        content: [],
      };
      const expectedFolder = FileSystemFolder.fromJson(folderMock);

      const result = FilesController.getPathContent(folderMock.path);

      expect(result).to.be.instanceOf(FileSystemFolder);
      expect(result?.toString()).to.equal(expectedFolder.toString());
    });

    it("should return null if an error occurs", () => {
      fsStatSyncStub.throws(new Error("File not found"));

      const result = FilesController.getPathContent("/nonexistent");
      expect(result).to.be.eql(null);
    });
  });

  describe("getFile()", () => {
    it("should return file information if the file exists", () => {
      fsAccessSyncStub.returns(true);
      fsStatSyncStub.returns({ isFile: () => true });

      const fileMock = { name: "testFile.txt", path: "/testFile.txt" };
      const expectedFile = FileSystemFile.fromJson(fileMock);

      const result = FilesController.getPathContent(fileMock.path);
      expect(result?.toString()).to.equal(expectedFile.toString());
    });

    it("should throw ApiError when file does not exist", () => {
      fsAccessSyncStub.throws(new Error("File not found"));

      try {
        FilesController.getPathContent("/nonexistentFile.txt");
      } catch (error) {
        expect(error).to.be.instanceOf(ApiError);
        expect((error as ApiError).message).to.equal(
          "Error 404: File not found",
        );
        expect((error as ApiError).status).to.equal(ErrorStatusCode.NOT_FOUND);
      }
    });
  });

  describe("getFolder()", () => {
    it("should return folder content if the folder exists", () => {
      fsStatSyncStub.returns({ isFile: () => false });
      fsReaddirSyncStub.returns([
        {
          name: "file1.txt",
          path: "testFolder\\file1.txt",
          isDirectory: () => false,
        },
        {
          name: "subfolder",
          path: "testFolder\\subfolder",
          isDirectory: () => true,
        },
      ]);

      const folderMock = {
        name: "testFolder",
        path: "\\testFolder",
        content: [
          { name: "file1.txt", path: "\\testFolder\\file1.txt" },
          { name: "subfolder", path: "\\testFolder\\subfolder", content: [] },
        ],
      };
      const expectedFolder = FileSystemFolder.fromJson(folderMock);

      const result = FilesController.getPathContent(folderMock.path);
      expect(result?.toString()).to.equal(expectedFolder.toString());
    });

    it("should throw ApiError when folder cannot be accessed", () => {
      fsReaddirSyncStub.throws(new Error("Folder not found"));

      try {
        FilesController.getPathContent("/nonexistentFolder");
      } catch (error) {
        expect(error).to.be.instanceOf(ApiError);
        expect((error as ApiError).message).to.equal(
          "Error 404: Could not access folder",
        );
        expect((error as ApiError).status).to.equal(ErrorStatusCode.NOT_FOUND);
      }
    });
  });
});
