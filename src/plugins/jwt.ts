import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { env } from "../env";

export default fp(async (fastify: FastifyInstance) => {
    fastify.register(fastifyJwt, {
        secret: env.JWT_SECRET || "supersecret",
    });

    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.status(401).send({ error: "Unauthorized" });
        }
    });
});
