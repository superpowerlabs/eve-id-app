const { toChecksumAddress } = require("ethereumjs-util");

class Address {
  static equal(addr1, addr2) {
    try {
      return toChecksumAddress(addr1) === toChecksumAddress(addr2);
    } catch (e) {
      return false;
    }
  }

  static isOperator(chainId, operator) {
    if (chainId === 1337) {
      return Address.equal(
        operator,
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
      );
    } else {
      return (
        Address.equal(operator, "0x16244cdFb0D364ac5c4B42Aa530497AA762E7bb3") ||
        Address.equal(operator, "0x75543056D9cA56B29FfcCF873d5C2Cfc91f412b4")
      );
    }
  }
}

module.exports = Address;
