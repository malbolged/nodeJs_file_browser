import { JSONObject } from "./json_object";
import { FileSystemFile } from "./file_system_file";
import { FileSystemItem, IFileSystemItem } from "./file_system_item";

type IFileSystemFolder = IFileSystemItem & {
  content: IFileSystemItem[] | IFileSystemFolder[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isFolder = (item: any): item is IFileSystemFolder =>
  item["content"] != null;

class FileSystemFolder extends FileSystemItem {
  private content: FileSystemItem[];

  private constructor(args: IFileSystemFolder) {
    try {
      super(args);

      if (Array.isArray(args.content)) {
        this.content = args.content.map((item) => {
          return isFolder(item)
            ? FileSystemFolder.fromJson(item)
            : FileSystemFile.fromJson(item);
        });
      } else {
        this.content = [];
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static fromJson(item: IFileSystemFolder): FileSystemFolder {
    return new FileSystemFolder(item);
  }

  getContent(): FileSystemItem[] {
    return this.content;
  }

  toJson(): JSONObject {
    return {
      ...super.toJson(),
      content: this.content.map((item) => item.toJson()),
    };
  }
}

export type { IFileSystemFolder };
export { FileSystemFolder, isFolder };
