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

const server = Fastify().withTypeProvider<TypeBoxTypeProvider>()

await server.register(fastifyCors, {
  origin: '*',
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
  routePrefix: '/docs',
})

await server.register(fastifyAutoload, {
  dir: join(__dirname, 'routes'),
})

try {
  server.listen({ port: 3000 }).then(() => {
    console.log('Server is running on http://localhost:3000')
  })
} catch (err) {
  console.error('Error starting server:', err)
  process.exit(1)
}
