import Fastify from 'fastify'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

import fastifyCors from '@fastify/cors'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import fastifyAutoload from '@fastify/autoload'

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const BACK_HOST = process.env.VITE_BACKEND_HOST
const BACK_PORT = Number(process.env.VITE_BACKEND_PORT)
const FRONT_HOST = process.env.FRONTEND_HOST
const FRONT_PORT = Number(process.env.FRONTEND_PORT)
const BACK_SWAGGER = process.env.BACKEND_SWAGGER

const server = Fastify().withTypeProvider<TypeBoxTypeProvider>()

await server.register(fastifyCors, {
  origin: `http://${FRONT_HOST}:${FRONT_PORT}`,
  methods: ['*'],
})

await server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'TPFTQ API',
      version: '1.0.0',
    },
  },
})

await server.register(fastifySwaggerUi, {
  routePrefix: BACK_SWAGGER,
})

await server.register(fastifyAutoload, {
  dir: join(__dirname, 'routes'),
})

server.listen({ port: BACK_PORT, host: BACK_HOST }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`🦊 Fastify is running at ${address}`)
})
