import { loadEnvConfig } from '@next/env'
import { z } from 'zod'

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const envSchema = z.object({
  DB_FILE_NAME: z.string(),
})

let env: z.infer<typeof envSchema>

try {
  env = envSchema.parse(process.env)
} catch (error) {
  console.error('Environment Variables failed validation.')
  throw new Error(error?.toString()) // wrap zod error so it's formatted when the app crashes
}

export { env }
