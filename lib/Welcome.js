module.exports = {
  showWelcomeMessage: (clc) => {
    console.log("        /\\ /|");
    console.log("       |" + clc.xterm(218)("||") + "| |");
    console.log(
      "        \\ | \\       a88888b.                   dP dP                       dP .d88888b"
    );
    console.log(
      "    _ _ /  " +
        clc.red("@ @") +
        "     d8'   `88                   88 88                       88 88.    '' "
    );
    console.log(
      "  /    \\   =>" +
        clc.xterm(218)("X") +
        "<=   88        .d8888b. .d8888b. 88 88d888b. .d8888b.        88 `Y88888b. "
    );
    console.log(
      "/|      |   /      88        88'  `88 88ooood8 88 88'  `88 88'  `88        88       `8b "
    );
    console.log(
      "\\|     /__| |      Y8.   .88 88.  .88 88.  ... 88 88    88 88.  .88 88.  .d8P d8'   .8P "
    );
    console.log(
      "  \\_____\\ \\__\\      Y88888P' `88888P' `88888P' dP dP    dP `88888P'  `Y8888'   Y88888P  "
    );
  },
};
