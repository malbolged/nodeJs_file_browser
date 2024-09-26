import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";

import { FileSystemFile } from "../../models";
import { IFileSystemItem } from "../../models/file_system_item";

describe("FileSystemFile", () => {
  const mockFile: IFileSystemItem = {
    name: "testFile.txt",
    path: "/path/to/testFile.txt",
  };

  describe("fromJson()", () => {
    it("should create a FileSystemFile instance from a JSON object", () => {
      const file = FileSystemFile.fromJson(mockFile);
      expect(file).to.be.an.instanceOf(FileSystemFile);
      expect(file.getName()).to.equal("testFile.txt");
      expect(file.getPath()).to.equal("/path/to/testFile.txt");
    });
  });

  describe("Inherited methods", () => {
    let file: FileSystemFile;

    beforeEach(() => {
      file = FileSystemFile.fromJson(mockFile);
    });

    it("should return the correct name using getName()", () => {
      expect(file.getName()).to.equal("testFile.txt");
    });

    it("should return the correct path using getPath()", () => {
      expect(file.getPath()).to.equal("/path/to/testFile.txt");
    });

    it("should return the correct JSON object using toJson()", () => {
      const expectedJson = {
        name: "testFile.txt",
        path: "/path/to/testFile.txt",
      };
      expect(file.toJson()).to.deep.equal(expectedJson);
    });

    it("should return the correct JSON string using toString()", () => {
      const expectedString =
        '{"name":"testFile.txt","path":"/path/to/testFile.txt"}';
      expect(file.toString()).to.equal(expectedString);
    });

    it("isFolder() should return false for a file", () => {
      expect(file.isFolder()).to.eq(false);
    });
  });
});
