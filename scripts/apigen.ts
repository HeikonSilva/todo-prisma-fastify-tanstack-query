import 'dotenv/config'

import { createClient } from '@hey-api/openapi-ts'

const BACK_HOST = process.env.VITE_BACKEND_HOST
const BACK_PORT = Number(process.env.VITE_BACKEND_PORT)
const BACK_SWAGGER = process.env.BACKEND_SWAGGER

try {
  await createClient({
    plugins: ['@hey-api/client-fetch', '@tanstack/react-query'],
    input: `http://${BACK_HOST}:${BACK_PORT}${BACK_SWAGGER}/json`,
    output: './src/api',
  })
} catch (error) {
  console.error('Error generating API client:', error)
}
