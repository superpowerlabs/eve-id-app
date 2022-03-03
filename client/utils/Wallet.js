class Wallet {
  // check if it is on mainnet before adding it
  async addToken(
    address = "0xbc6E06778708177a18210181b073DA747C88490a",
    symbol = "SYNR",
    image = "https://data.syn.city/assets/SynCityLogo97x97Black.png",
    decimals = 18
  ) {
    if (typeof window.ethereum !== "undefined") {
      try {
        return window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address,
              symbol,
              decimals,
              image,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}

module.exports = new Wallet();
