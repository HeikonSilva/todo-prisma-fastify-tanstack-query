import { createClient } from '@hey-api/openapi-ts'

try {
  await createClient({
    plugins: ['@hey-api/client-fetch', '@tanstack/react-query'],
    input: 'http://localhost:3000/docs/json',
    output: './src/api',
  })
} catch (error) {
  console.error('Error generating API client:', error)
}
