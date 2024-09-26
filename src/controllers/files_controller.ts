import fs from "fs";
import path from "path";

import {
  ApiError,
  ErrorStatusCode,
  FileSystemFile,
  FileSystemFolder,
} from "../models";

export const getPathContent = (selectedPath: string = "/") => {
  try {
    const resolvedPath = path.resolve(selectedPath);
    const isFile = fs.lstatSync(resolvedPath).isFile();

    if (isFile) {
      return getFile(selectedPath);
    } else {
      return getFolder(selectedPath);
    }
  } catch (err) {
    console.error("FilesController(getPathContent) error: ", err);
    return null;
  }
};

const getFolder = (folderPath: string) => {
  try {
    const resolvedPath = path.resolve(folderPath);

    try {
      const files = fs.readdirSync(resolvedPath, { withFileTypes: true });

      const content = files.map((file) => {
        return {
          name: file.name,
          path: path.join(folderPath, file.name),
          ...(file.isDirectory() && { content: [] }),
        };
      });

      return FileSystemFolder.fromJson({
        name: path.basename(folderPath),
        path: folderPath,
        content: content,
      });
    } catch (folderError) {
      console.error("Could not access folder", folderError);

      throw new ApiError(
        "Error 404: Could not access folder",
        ErrorStatusCode.NOT_FOUND,
      );
    }
  } catch (err) {
    console.error("FilesController(getFolder) error: ", err);
    throw err;
  }
};

const getFile = (filePath: string) => {
  try {
    const resolvedPath = path.resolve(filePath);

    try {
      fs.accessSync(resolvedPath, fs.constants.F_OK);

      return FileSystemFile.fromJson({
        name: path.basename(resolvedPath),
        path: resolvedPath,
      });
    } catch (fileError) {
      console.error("File not found", fileError);

      throw new ApiError(
        "Error 404: File not found",
        ErrorStatusCode.NOT_FOUND,
      );
    }
  } catch (err) {
    console.error("FilesController(getFile) error: ", err);
    throw err;
  }

  // Check if the file exists
};
