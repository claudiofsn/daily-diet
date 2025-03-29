import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { knex } from '../db/knex';
import { registerSchema } from "../schemas/authSchema";

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post("/register", async (request, reply) => {
        const parsedBody = registerSchema.safeParse(request.body);
        if (!parsedBody.success) {
            return reply.status(400).send({ error: parsedBody.error.format() });
        }

        const { username, password } = parsedBody.data;

        const existingUser = await knex('users').where({ username }).first();
        if (existingUser) {
            return reply.status(400).send({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await knex("users").insert({
            id: randomUUID(), username, password: hashedPassword
        })

        return reply.status(201).send({ message: "User registered" });
    });

    fastify.post("/login", async (request, reply) => {
        const { username, password } = request.body as { username: string; password: string };

        const user = await knex("users").where({ username }).first();
        if (!user) {
            return reply.status(400).send({ error: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return reply.status(400).send({ error: "Invalid credentials" });
        }

        const token = fastify.jwt.sign({ id: user.id, username: user.username });
        return reply.send({ token });
    });
}