import { expect } from "chai";
import { capitalize, getFileNames } from "../src/Utils.js";

describe("Utils", () => {
  describe("capitalize", () => {
    it("should capitalize the first letter of a string", () => {
      const result = capitalize("hello");
      expect(result).to.equal("Hello");
    });

    it("should return an empty string if input is empty", () => {
      const result = capitalize("");
      expect(result).to.equal("");
    });

    it("should handle non-string inputs gracefully", () => {
      const result = capitalize(null);
      expect(result).to.equal("");
    });
  });
  // describe("getFileNames", () => {
  //   it("should return an array of file names", () => {
  //     const result = getFileNames("middlewares");
  //     expect(result).to.be.an("array").that.is.not.empty;
  //   });
  // });
});
