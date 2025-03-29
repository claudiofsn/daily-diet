import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { env } from "../../env";

export default fp(async (fastify: FastifyInstance) => {
    fastify.register(fastifyJwt, {
        secret: env.JWT_SECRET || "supersecret",
    });

    fastify.decorate("authenticate", async function (request, reply) {
        try {
            const token = request.cookies.token;

            if (!token) {
                throw new Error("No token provided");
            }

            request.user = fastify.jwt.verify(token);
        } catch (err) {
            return reply.status(401).send({ error: "Unauthorized" });
        }

    });
});
