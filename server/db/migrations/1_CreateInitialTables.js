class CreateInitialTables extends require("../Migration") {
  async body(index, database) {
    let done = false;
    let sql = await this.sql();

    // await sql.schema.dropTableIfExists("codes");

    if (!(await sql.schema.hasTable("codes"))) {
      await sql.schema.createTable("codes", (t) => {
        t.increments("id").primary();
        t.string("access_token").notNullable().index();
        t.string("redeemer").index();
        t.string("auth_code");
        t.text("hash");
        t.text("signature");
        t.timestamp("created_at").defaultTo(sql.fn.now());
        t.timestamp("signature_set_at");
        t.timestamp("redeemed_at");
        t.integer("token_id");
      });
      done = true;
      console.info('Table "codes" created.');
    }

    if (!done) {
      console.info("No change required for this migration");
    }
  }
}

module.exports = CreateInitialTables;
