const fs = require("fs");

module.exports = {
  capitalize: (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  },
  getFileNames: (folder) => {
    const fileNames = [];
    const extension = "." + folder.substring(0, folder.length - 1) + ".js";
    const files = fs.readdirSync("./" + folder);
    files.forEach((file) => {
      if (file.includes(extension)) {
        const name = file.replace(extension, "");
        fileNames.push(name);
      }
    });
    return fileNames;
  },
};
