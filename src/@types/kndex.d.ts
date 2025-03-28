// eslint-disable-next-line @typescript-eslint/no-unused-vars

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string
            username: string
            password: string
            created_at: string
        }
    }
}