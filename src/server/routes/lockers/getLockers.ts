import db, { schema } from '../../../database'
import { sql, inArray } from 'drizzle-orm'
import { RequestHandler } from 'express'

const getLockers: RequestHandler = async (req, res, next) => {
  try {
    const locationStr: string = req.query.location?.toString() || '[0, 0]'
    const location = JSON.parse(locationStr)

    const sqlLocation = sql`
      ST_SetSRID(ST_MakePoint(${location[0]}, ${location[1]}), 4326)
    `

    const lockersByDistance = await db
      .select({
        id: schema.lockers.id,
        distance: sql`ST_Distance(${schema.lockers.location}, ${sqlLocation})`
      })
      .from(schema.lockers)
      .orderBy(sql`${schema.lockers.location} <-> ${sqlLocation} asc`)
      .limit(10)

    const lockers = await db.query.lockers.findMany({
      where: inArray(
        schema.lockers.id,
        lockersByDistance.map((locker) => locker.id)
      ),
      with: {
        spaces: {
          with: {
            items: true
          }
        }
      }
    })

    const lockersWithDistance = lockers.map((locker) => {
      const lockerWithDistance = lockersByDistance.find(
        (l) => l.id === locker.id
      )
      return {
        ...locker,
        distance: lockerWithDistance?.distance
      }
    })

    res.status(200).json(lockersWithDistance)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export default getLockers
