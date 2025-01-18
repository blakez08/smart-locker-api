import { Router } from 'express'
import db, { schema } from '../../../database'
import { getTableColumns, sql } from 'drizzle-orm'

const router = Router()

router.get('/', async (req, res, next) => {
  const locationStr: string = req.query.location?.toString() || '[]'
  const location = JSON.parse(locationStr)

  const sqlLocation = sql`
    ST_SetSRID(ST_MakePoint(${location[0]}, ${location[1]}), 4326)
  `

  const lockers = await db
    .select({
      ...getTableColumns(schema.lockers),
      distance: sql`ST_Distance(${schema.lockers.location}, ${sqlLocation})`
    })
    .from(schema.lockers)
    .orderBy(sql`${schema.lockers.location} <-> ${sqlLocation} asc`)
    .limit(10)

  res.status(200).json(lockers)
})

export default router
