import type { FastifyTypedInstance } from '../types'

export default function (server: FastifyTypedInstance) {
  server.get(
    '/',
    {
      schema: {
        description: 'Hello World',
      },
    },
    () => {
      return { message: 'Hello, world!' }
    }
  )
}
