import fastifyCookie from '@fastify/cookie'
import fastify from 'fastify'

export const server = fastify()

server.register(fastifyCookie)