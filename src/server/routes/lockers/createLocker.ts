import db, { schema } from '../../../database'
import { eq, sql } from 'drizzle-orm'
import { RequestHandler } from 'express'

const createLocker: RequestHandler = async (req, res, next) => {
  try {
    if (Array.isArray(req.body))
      return next(new Error('Unable to create multiple lockers'))

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
}

export default createLocker
