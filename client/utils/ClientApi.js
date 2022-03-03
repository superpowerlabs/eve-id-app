import superagent from "superagent";

class ClientApi {
  setConnectedWallet(wallet, chainId) {
    this.connectedWallet = wallet;
    this.chainId = chainId;
  }

  async request(
    api,
    method = "get",
    params = {},
    query = {},
    multipart,
    extraHeaders
  ) {
    let headers = {
      Accept: "application/json",
      "Connected-wallet": this.connectedWallet || "",
      "Chain-id": this.chainId,
    };
    if (multipart) {
      headers["Content-Type"] = "multipart/form-data";
    }
    if (extraHeaders) {
      headers = Object.assign(headers, extraHeaders);
    }
    const res = await superagent[method](
      `${window.location.origin}/api/v1/${api}`
    )
      .set(headers)
      .query(query)
      .send(params);
    return res.body;
  }
}

let instance;
if (!instance) instance = new ClientApi();

export default instance;
