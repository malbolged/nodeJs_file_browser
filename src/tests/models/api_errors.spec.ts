import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";

import { ApiError, ErrorStatusCode } from "../../models";

describe("ApiError", () => {
  describe("ErrorStatusCode Enum", () => {
    it("should have the correct value for NOT_FOUND", () => {
      expect(ErrorStatusCode.NOT_FOUND).to.equal(404);
    });

    it("should have the correct value for INTERNAL_SERVER_ERROR", () => {
      expect(ErrorStatusCode.INTERNAL_SERVER_ERROR).to.equal(500);
    });
  });

  describe("ApiError Class", () => {
    const errorMessage = "Resource not found";
    const errorStatus = ErrorStatusCode.NOT_FOUND;
    let apiError: ApiError;

    beforeEach(() => {
      apiError = new ApiError(errorMessage, errorStatus);
    });

    it("should inherit from the Error class", () => {
      expect(apiError).to.be.an.instanceOf(Error);
    });

    it("should set the message property correctly", () => {
      expect(apiError.message).to.equal(errorMessage);
    });

    it("should set the status property correctly", () => {
      expect(apiError.status).to.equal(errorStatus);
    });

    it('should have a name property set to "Error"', () => {
      expect(apiError.name).to.equal("Error");
    });

    it("should include the error message when converted to string", () => {
      expect(apiError.toString()).to.include(errorMessage);
    });
  });
});
