const { utils } = require("ethers");

class Auth {
  async getSignedAuthToken(chainId, signer, data = {}, name) {
    if (typeof data !== "string") {
      data = JSON.stringify(data, null, 2);
    }

    const timestamp = Date.now();
    const msgParams = JSON.stringify({
      domain: {
        chainId: chainId,
        name,
        version: "1",
      },
      message: {
        timestamp,
        data,
      },
      primaryType: "Auth",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
        ],
        Auth: [
          { name: "timestamp", type: "uint256" },
          { name: "data", type: "string" },
        ],
      },
    });
    const params = [signer, msgParams];
    const method = "eth_signTypedData_v4";

    const signature = await window.ethereum.request({
      method,
      params,
      from: signer,
    });
    return { msgParams, signature };
  }

  async getPersonalSign(clover, message, address) {
    const request = { method: "personal_sign", params: [message, address] };
    return await clover.request(request);
  }
}

export default new Auth();
