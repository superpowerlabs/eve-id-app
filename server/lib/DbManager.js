const Sql = require("../db/Sql");
const ethers = require("ethers");

class DbManager extends Sql {
  generateRandomCode(len = 16) {
    return ethers.utils
      .id("code" + Math.random())
      .substring(2, len + 2)
      .toUpperCase();
  }

  async getData(where) {
    const rows = await (await this.sql())
      .select("*")
      .from("codes")
      .where(where);
    return rows[0];
  }

  async showQuery(query) {
    return query.toSQL().toNative();
  }

  async createCode() {
    const sql = await this.sql();
    return sql
      .insert({
        access_token: this.generateRandomCode(),
      })
      .returning("*")
      .into("codes");
  }

  async saveHashAndSignature(
    access_token,
    redeemer,
    auth_code,
    hash,
    signature
  ) {
    const sql = await this.sql();
    return sql("codes")
      .where({
        access_token,
      })
      .update({
        redeemer,
        auth_code,
        hash,
        signature,
        signature_set_at: sql.fn.now(),
      });
  }

  async setCodeAsUsed(access_token, auth_code, token_id) {
    const code = await this.getData({
      access_token,
      auth_code,
    });
    if (code && code.auth_code) {
      const sql = await this.sql();
      const data = {
        redeemed_at: sql.fn.now(),
        token_id,
      };
      return sql("codes")
        .where({
          access_token,
        })
        .update(data);
    } else {
      return false;
    }
  }
}

let dbManager;
if (!dbManager) {
  dbManager = new DbManager();
}
module.exports = dbManager;
