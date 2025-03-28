import { Knex, knex as setupKnex } from "knex";
import path from "node:path";
import { env } from "../env/index";

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_CLIENT === 'sqlite' ? { filename: env.DATABASE_URL } : env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: path.resolve(__dirname, "migrations")
    }
}

export const knex = setupKnex(config)