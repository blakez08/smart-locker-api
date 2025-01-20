import { Router } from 'express'
import db, { schema } from '../../../database'
import { sql, eq, inArray } from 'drizzle-orm'

const router = Router()

router.get('/', async (req, res, next) => {
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
})

router.get('/:lockerId', async (req, res, next) => {
  try {
    const lockerId = req.params.lockerId

    if (!lockerId) return next(new Error('Locker ID is required'))

    const locker = await db.query.lockers.findFirst({
      where: eq(schema.lockers.id, parseInt(lockerId)),
      with: {
        spaces: {
          with: {
            items: true
          }
        }
      }
    })

    res.status(200).json(locker)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.put('/:lockerId', async (req, res, next) => {
  try {
    const lockerId = req.params.lockerId

    if (!lockerId) return next(new Error('Locker ID is required'))

    const updatedLocker = await db
      .update(schema.lockers)
      .set(req.body)
      .where(eq(schema.lockers.id, parseInt(lockerId)))
      .returning()

    res.status(200).json(updatedLocker)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const trxLocker = await db.transaction(async (trx) => {
      const [newLocker] = await trx
        .insert(schema.lockers)
        .values({
          ...req.body,
          location: sql`ST_SetSRID(ST_MakePoint(${req.body.location[0]}, ${req.body.location[1]}), 4326)`
        })
        .returning()

      if (req.body.spaces?.length) {
        for (const space of req.body.spaces) {
          const [newSpace] = await trx
            .insert(schema.spaces)
            .values({
              ...space,
              lockerId: newLocker.id
            })
            .returning()

          if (space.items?.length) {
            for (const item of space.items) {
              await trx.insert(schema.items).values({
                ...item,
                spaceId: newSpace.id
              })
            }
          }
        }
      }
      return newLocker
    })

    const locker = await db.query.lockers.findFirst({
      where: eq(schema.lockers.id, trxLocker.id),
      with: {
        spaces: {
          with: {
            items: true
          }
        }
      }
    })

    res.status(200).json(locker)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

export default router
