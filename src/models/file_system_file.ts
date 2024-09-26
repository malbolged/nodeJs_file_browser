import { FileSystemItem, IFileSystemItem } from "./file_system_item";

class FileSystemFile extends FileSystemItem {
  private constructor(args: IFileSystemItem) {
    super(args);
  }

  static fromJson(file: IFileSystemItem): FileSystemFile {
    return new FileSystemFile(file);
  }
}

export { FileSystemFile };
