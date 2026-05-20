import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Client } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.error('ERROR: DB_USER and DB_PASSWORD environment variables must be set.')
  console.error('Example: export DB_USER="postgres.<project-ref>" DB_PASSWORD="<your-db-password>"')
  process.exit(1)
}

const client = new Client({
  host: process.env.DB_HOST || 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  family: 4,
})

const migrations = [
  '001_schema.sql',
  '002_seed_segments.sql',
  '003_seed_countries.sql',
  '004_seed_verticals.sql',
  '005_seed_processors.sql',
  '006_rls.sql',
  '007_search_function.sql',
]

async function run() {
  await client.connect()
  console.log('Connected to Supabase')

  for (const file of migrations) {
    const sql = fs.readFileSync(path.join(__dirname, "../supabase/migrations", file), 'utf8')
    console.log(`Running ${file}...`)
    try {
      await client.query(sql)
      console.log(`  ✓ ${file}`)
    } catch (err) {
      // skip "already exists" errors — migration partially ran before
      const skip = ['42P07','42710','42701','23505']
      if (skip.includes(err.code)) {
        console.log(`  ~ ${file} (skipped: ${err.message.split('\n')[0]})`)
      } else {
        console.error(`  ✗ ${file}: ${err.message}`)
        process.exit(1)
      }
    }
  }

  await client.end()
  console.log('\nAll migrations complete.')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
