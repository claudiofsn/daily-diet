import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("meals", (table) => {
        table.uuid("id").primary();
        table.string("name").notNullable();
        table.text("description").notNullable();
        table.timestamp("datetime").notNullable();
        table.boolean("is_on_diet").notNullable();
        table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("meals");
}

