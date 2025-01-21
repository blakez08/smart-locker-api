import db, { schema } from '../../../database'
import { eq } from 'drizzle-orm'
import { RequestHandler } from 'express'

const rentSpace: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user

    const trxResult = db.transaction(async (trx) => {
      const space = await trx.query.spaces.findFirst({
        where: eq(schema.spaces.id, parseInt(req.params.spaceId))
      })

      if (!space) return next(new Error('Space not found'))
      if (!space.available) return next(new Error('Space is not available'))

      const rentedSpace = await trx
        .update(schema.spaces)
        .set({
          available: false
        })
        .where(eq(schema.spaces.id, parseInt(req.params.spaceId)))
        .returning()

      await trx.insert(schema.rentals).values({
        userId: parseInt(user.id),
        spaceId: parseInt(req.params.spaceId),
        startTime: new Date()
      })

      return rentedSpace
    })

    res.status(200).json(trxResult)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export default rentSpace
