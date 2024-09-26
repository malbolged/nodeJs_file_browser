import { expect } from "chai";
import { describe, it } from "mocha";

import {
  isFolder,
  FileSystemFile,
  FileSystemFolder,
  IFileSystemFolder,
} from "../../models";
import { IFileSystemItem } from "../../models/file_system_item";

describe("FileSystemFolder", () => {
  const mockFile: IFileSystemItem = {
    name: "file1.txt",
    path: "/folder/file1.txt",
  };

  const mockSubFolder: IFileSystemFolder = {
    name: "subFolder",
    path: "/folder/subFolder",
    content: [],
  };

  const mockFolder: IFileSystemFolder = {
    name: "folder",
    path: "/folder",
    content: [mockFile, mockSubFolder],
  };

  describe("fromJson()", () => {
    it("should create a FileSystemFolder instance from a JSON object", () => {
      const folder = FileSystemFolder.fromJson(mockFolder);

      expect(folder).to.be.an.instanceOf(FileSystemFolder);
      expect(folder.getName()).to.equal("folder");
      expect(folder.getPath()).to.equal("/folder");
    });

    it("should correctly parse content with both files and folders", () => {
      const folder = FileSystemFolder.fromJson(mockFolder);
      const content = folder.getContent();

      expect(content).to.have.lengthOf(2);
      expect(content[0]).to.be.an.instanceOf(FileSystemFile);
      expect(content[1]).to.be.an.instanceOf(FileSystemFolder);
    });
  });

  describe("getContent()", () => {
    it("should return the correct content of files and folders", () => {
      const folder = FileSystemFolder.fromJson(mockFolder);
      const content = folder.getContent();

      expect(content).to.be.an("array").with.length(2);
      expect(content[0].getName()).to.equal("file1.txt");
      expect(content[1].getName()).to.equal("subFolder");
    });
  });

  describe("toJson()", () => {
    it("should return the correct JSON representation of the folder and its content", () => {
      const folder = FileSystemFolder.fromJson(mockFolder);
      const expectedJson = {
        name: "folder",
        path: "/folder",
        content: [
          {
            name: "file1.txt",
            path: "/folder/file1.txt",
          },
          {
            name: "subFolder",
            path: "/folder/subFolder",
            content: [],
          },
        ],
      };

      expect(folder.toJson()).to.deep.equal(expectedJson);
    });
  });

  describe("isFolder()", () => {
    it('should return true for an object with a "content" property', () => {
      expect(isFolder(mockFolder)).to.be.eq(true);
    });

    it('should return false for an object without a "content" property', () => {
      expect(isFolder(mockFile)).to.be.eq(false);
    });
  });
});
