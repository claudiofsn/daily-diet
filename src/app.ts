import fastifyCookie from '@fastify/cookie';
import fastify from 'fastify';
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/auth";

export const server = fastify()

server.register(fastifyCookie)
server.register(jwtPlugin)
server.register(authRoutes);
