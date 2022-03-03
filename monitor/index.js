require("dotenv").config();
const monitor = require("./monitor");
const queryService = require("./blockchainQueryService");

function main() {
  console.log("starting monitor");
  //queryService.getactualEvents();
  queryService.gettheGraph();
}

main();
