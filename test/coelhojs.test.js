import { expect } from "chai";
import { CoelhoJs } from "../src/CoelhoJs.js";

describe("CoelhoJs", () => {
  let app;

  beforeEach(() => {
    app = new CoelhoJs();
  });

  it("should initialize with default properties", () => {
    expect(app).to.have.property("app");
    expect(app).to.have.property("models").that.is.an("object");
    expect(app).to.have.property("routes").that.is.an("object");
    expect(app).to.have.property("controllers").that.is.an("object");
    expect(app).to.have.property("services").that.is.an("object");
    expect(app).to.have.property("middlewares").that.is.an("object");
  });

  it("should initialize middlewares", () => {
    expect(app.app._router.stack).to.be.an("array").that.is.not.empty;
  });
});
