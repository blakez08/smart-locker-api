import db, { schema } from '../../../database'
import { and, eq, isNull } from 'drizzle-orm'
import { RequestHandler } from 'express'

const returnSpace: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user

    const trxResult = await db.transaction(async (trx) => {
      const space = await trx.query.spaces.findFirst({
        where: eq(schema.spaces.id, parseInt(req.params.spaceId))
      })

      const rental = await trx.query.rentals.findFirst({
        where: and(
          eq(schema.rentals.userId, parseInt(user.id)),
          eq(schema.rentals.spaceId, parseInt(req.params.spaceId)),
          isNull(schema.rentals.endTime)
        )
      })

      if (!space) return next(new Error('Space not found'))
      if (space.available) return next(new Error('Space is already available'))
      if (!rental) return next(new Error('Rental not found'))

      const returnedSpace = await trx
        .update(schema.spaces)
        .set({
          available: true
        })
        .where(eq(schema.spaces.id, parseInt(req.params.spaceId)))
        .returning()

      await trx
        .update(schema.rentals)
        .set({
          endTime: new Date()
        })
        .where(eq(schema.rentals.id, rental.id))
        .returning()

      return returnedSpace
    })

    res.status(200).json(trxResult)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export default returnSpace
