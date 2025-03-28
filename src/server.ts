import { server } from "./app"
import { env } from "./env"

server
  .listen({
    host: ("RENDER" in process.env) ? '0.0.0.0' : 'localhost',
    port: env.PORT,
  })
  .then(() => {
    console.log('HTPP Server Running!')
  })