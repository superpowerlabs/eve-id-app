require("dotenv").config();
const { validator, localValidator } = require("./env");
const ethers = require("ethers");
const [, , hash, nodeEnv] = process.argv;
const signingKey = new ethers.utils.SigningKey(
  nodeEnv === "development" ? localValidator : validator
);
const signedDigest = signingKey.signDigest(hash);
console.info(ethers.utils.joinSignature(signedDigest));
