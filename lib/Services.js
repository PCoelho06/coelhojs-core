const { access } = require("fs");
const { getFileNames } = require("./Utils");

const Services = {};

async function loadServices() {
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

module.exports = { Services, loadServices };
