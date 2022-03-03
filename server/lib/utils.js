const ethers = require("ethers");
const { Contract } = require("@ethersproject/contracts");
const config = require("../../client/config");
const path = require("path");
const { execSync } = require("child_process");
const _ = require("lodash");
const requireOrMock = require("require-or-mock");

const { infuraApiKey } = requireOrMock("env.js");

const contracts = {};

const utils = {
  sleep: async (millis) => {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setTimeout(resolve, millis));
  },

  getProvider(chainId) {
    chainId = chainId.toString();
    let provider;
    if (chainId === "1337") {
      provider = new ethers.providers.JsonRpcProvider();
      // } else if (chainId === "137") {
      //   provider = new ethers.providers.AlchemyProvider("matic", alchemyKey);
    } else {
      const network =
        chainId === "42"
          ? "kovan"
          : chainId === "137"
          ? "matic"
          : chainId === "80001"
          ? "maticmum"
          : "homestead";
      provider = new ethers.providers.InfuraProvider(network, infuraApiKey);
    }
    return provider;
  },

  getContract(chainId, contractName) {
    chainId = chainId.toString();
    if (config.supportedId[chainId]) {
      if (!contracts[chainId]) {
        contracts[chainId] = {};
      }
      if (!contracts[chainId][contractName]) {
        contracts[chainId][contractName] = new Contract(
          config.contracts[chainId][contractName],
          config.abi[contractName],
          utils.getProvider(chainId)
        );
      }
      return contracts[chainId][contractName];
    }
    return false;
  },

  signPackedData(hash) {
    const scriptPath = path.resolve(__dirname, "../../sign.js");
    return _.trim(
      execSync(`node ${scriptPath} ${hash} ${process.env.NODE_ENV}`).toString()
    );
  },

  async getPackedHash(chainId, recipient, authCode) {
    const EveIDNft = utils.getContract(chainId, "EveIDNft");
    return await EveIDNft.encodeForSignature(recipient, authCode);
  },
};

module.exports = utils;
