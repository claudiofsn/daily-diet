import fastifyCookie from '@fastify/cookie';
import fastify from 'fastify';
import { env } from './env';
import jwtPlugin from "./http/plugins/jwt";
import authRoutes from "./http/routes/auth";
import mealRoutes from "./http/routes/meals";

export const server = fastify()

server.register(fastifyCookie, {
    secret: env.COOKIE_SECRET, // Assina os cookies
    parseOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
        sameSite: "strict",
    },
})
server.register(jwtPlugin)
server.register(authRoutes);
server.register(mealRoutes, { prefix: "/meals" });