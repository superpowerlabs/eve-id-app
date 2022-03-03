const express = require("express");
const router = express.Router();
const requireOrMock = require("require-or-mock");
const ethers = require("ethers");
const sigUtil = require("eth-sig-util");
// const DiscordOauth2 = require("discord-oauth2");
const dbManager = require("../lib/DbManager");
const Address = require("../../client/utils/Address");
const { signPackedData, getPackedHash } = require("../lib/utils");

router.get("/new-access-token", async (req, res) => {
  // Called by the Maze app, server side.

  // It returns an access_token. The user should be
  // redirected to hostname/access_token
  // where the app will verify the code and allow
  // the user to mint the token

  // This app and the Maze app must share a secret
  // to be put in the "Auth-token" header to authorize
  // the request
  const { hostname } = req;
  if (
    hostname !== "localhost" &&
    process.env.AUTH_TOKEN // < in testing the variable will be empty
  ) {
    if (req.get("Auth-token") !== process.env.AUTH_TOKEN) {
      return res.json({
        error: 403,
        message: "Forbidden",
      });
    }
  }
  const { access_token } = (await dbManager.createCode())[0];
  res.json({
    success: true,
    access_token,
  });
});

function signatureIsValid(req, res) {
  const connectedWallet = req.get("Connected-wallet");
  const msgParams = JSON.parse(req.body.msgParams);
  let recovered = ethers.constants.AddressZero;
  if (connectedWallet === recovered) {
    res.json({
      success: false,
      error: "Invalid wallet",
    });
    return false;
  }
  try {
    recovered = sigUtil.recoverTypedSignature_v4({
      data: msgParams,
      sig: req.body.signature,
    });
  } catch (e) {}
  if (!Address.equal(recovered, connectedWallet)) {
    res.json({
      success: false,
      error: "Wrong signature",
    });
    return false;
  }
  req.msgData = JSON.parse(msgParams.message.data);
  return true;
}

router.post("/give-me-an-auth-code", async (req, res) => {
  const connectedWallet = req.get("Connected-wallet");
  const chainId = req.get("Chain-id");
  const msgParams = JSON.parse(req.body.msgParams);
  if (signatureIsValid(req, res)) {
    const data = JSON.parse(msgParams.message.data);
    const { accessToken } = data;
    const row = await dbManager.getData({
      access_token: accessToken,
    });
    if (row) {
      if (row.redeemed_at) {
        return res.json({
          success: false,
          error: "Redeem code already used",
        });
      } else {
        if (row.hash) {
          return res.json({
            success: true,
            signature: row.signature,
            authCode: row.auth_code,
          });
        }
        if (row.redeemer && connectedWallet !== row.redeemer) {
          return res.json({
            success: false,
            error: "Forbidden",
          });
        }
        let authCode = ethers.utils.id(accessToken);
        let hash = await getPackedHash(chainId, connectedWallet, authCode);
        if (hash) {
          let signature = await signPackedData(hash);
          await dbManager.saveHashAndSignature(
            accessToken,
            connectedWallet,
            authCode,
            hash,
            signature
          );
          return res.json({
            success: true,
            signature,
            authCode,
          });
        } else {
          return res.json({
            success: false,
            error: "Cannot connect to blockchain",
          });
        }
      }
    }
    return res.json({
      success: false,
      error: "Redeem code not found",
    });
  } else {
    return res.json({
      success: false,
      error: "Wrong signature",
    });
  }
});

router.post("/complete-minting", async (req, res) => {
  const { accessToken, authCode, tokenId } = req.body;
  res.json({
    success: await dbManager.setCodeAsUsed(accessToken, authCode, tokenId),
  });
});

module.exports = router;
