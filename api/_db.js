import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  console.warn('[analytics] DATABASE_URL is not set — tracking will fail.')
}

export const sql = neon(process.env.DATABASE_URL)