import { RequestHandler } from "express";

import { FilesController } from "../../../controllers";
import { ApiError, ErrorStatusCode } from "../../../models";

const getPath: RequestHandler = async (
  request,
  response,
  next,
): Promise<void> => {
  const folderPath =
    typeof request.query.path === "string" ? request.query.path : null;

  if (folderPath) {
    const pathContent = FilesController.getPathContent(folderPath);

    if (pathContent) {
      if (pathContent.isFolder()) {
        response.json({
          success: true,
          result: pathContent.toJson(),
        });

        return;
      } else {
        response.setHeader(
          "Content-disposition",
          `attachment; filename=${pathContent.getName()}`,
        );

        response.download(pathContent.getPath(), (err) => {
          if (err) {
            return next(
              new ApiError(
                "Error downloading the file",
                ErrorStatusCode.NOT_FOUND,
              ),
            );
          }
        });

        return;
      }
    }
  }

  return next(new ApiError("Could not access path", ErrorStatusCode.NOT_FOUND));
};

export default getPath;
