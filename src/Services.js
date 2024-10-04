import { access } from "fs";
import { getFileNames, getServicePath } from "./Utils.js";

export const Services = {};

export async function loadServices() {
  access(process.cwd() + "/services", (error) => {
    if (error) {
      return;
    }
    getFileNames("services").forEach((service) => {
      const serviceClass = require(getServicePath(service));
      Services[capitalize(service)] = new serviceClass[capitalize(service)]();
    });
  });
}
