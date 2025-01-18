import 'dotenv/config'
import db, { schema } from '../../src/database/index'
import { sql } from 'drizzle-orm';

;(async () => {
  try {
    const insertedLockers = await db.insert(schema.lockers).values([
      { name: 'Home Depot', location: sql`ST_SetSRID(ST_MakePoint(-82.593731, 28.499420), 4326)` },
      { name: 'Walmart', location: sql`ST_SetSRID(ST_MakePoint(-82.505538, 28.531934), 4326)` },
      { name: 'Target', location: sql`ST_SetSRID(ST_MakePoint(-82.664927, 28.201052), 4326)` },
      { name: 'Largo Pizza', location: sql`ST_SetSRID(ST_MakePoint(-82.785042, 27.891164), 4326)` },
      { name: 'Chrysler Jeep Dodge', location: sql`ST_SetSRID(ST_MakePoint(-82.563653, 27.476098), 4326)` }
    ])

    process.exit()
  } catch (err) {
    console.error(err)
    process.exit()
  }
})()

// Home: 28.650035, -82.510137
