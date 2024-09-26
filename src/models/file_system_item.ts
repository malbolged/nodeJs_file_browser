import { FileSystemFolder } from "./file_system_folder";
import { JSONObject } from "./json_object";

type IFileSystemItem = {
  name: string;
  path: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _isFolder = (item: any): item is FileSystemFolder =>
  item["content"] != null;

abstract class FileSystemItem {
  private name: string;
  private path: string;

  constructor(args: IFileSystemItem) {
    try {
      Object.assign(this, args);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getName(): string {
    return this.name;
  }

  getPath(): string {
    return this.path;
  }

  isFolder() {
    return _isFolder(this);
  }

  toJson(): JSONObject {
    return {
      name: this.name,
      path: this.path,
    };
  }

  toString(): string {
    return JSON.stringify(this.toJson());
  }
}

export { FileSystemItem };
export type { IFileSystemItem };
