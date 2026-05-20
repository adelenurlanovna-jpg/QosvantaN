import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Client } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set.')
  console.error('Example: export DATABASE_URL="postgresql://postgres:<password>@db.<project>.supabase.co:5432/postgres"')
  process.exit(1)
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
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
    const sql = fs.readFileSync(path.join(__dirname, 'migrations', file), 'utf8')
    console.log(`Running ${file}...`)
    try {
      await client.query(sql)
      console.log(`  ✓ ${file}`)
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`)
      process.exit(1)
    }
  }

  await client.end()
  console.log('\nAll migrations complete.')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
