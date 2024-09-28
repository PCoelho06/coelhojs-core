import { access } from "fs";
import { getFileNames } from "./Utils.js";

export const Services = {};

export async function loadServices() {
  access(process.cwd() + "/services", (error) => {
    if (error) {
      return;
    }
    getFileNames("services").forEach((service) => {
      const serviceClass = require(process.cwd() +
        "/services/" +
        service +
        ".service.js");
      Services[capitalize(service)] = new serviceClass[capitalize(service)]();
    });
  });
}
