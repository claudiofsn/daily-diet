// eslint-disable-next-line @typescript-eslint/no-unused-vars

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string
            username: string
            password: string
            created_at: string
        };
        meals: {
            id: string
            name: string
            description: string
            datetime: string
            is_on_diet: boolean
            user_id: string
        }
    }
}