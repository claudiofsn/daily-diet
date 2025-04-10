import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (table) => {
        table.uuid("id").primary();
        table.string("username").notNullable().unique()
        table.string("password").notNullable()
        table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}

