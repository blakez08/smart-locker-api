import db, { schema } from '../../../database'
import { eq, inArray, isNull, and } from 'drizzle-orm'
import { RequestHandler } from 'express'

const getRentals: RequestHandler = async (req, res, next) => {
  try {
    const status = req.query.status
    const user = res.locals.user

    const rentals = await db.query.rentals.findMany({
      where: user
        ? and(
            eq(schema.rentals.userId, user.id),
            isNull(schema.rentals.endTime)
          ) 
        : undefined,
      with: {
        space: true
      }
    })

    const lockers = await db.query.lockers.findMany({
      where: inArray(
        schema.lockers.id,
        rentals.map((rental) => rental.space.lockerId)
      )
    })

    const rentalsWithLockers = rentals.map((rental) => {
      const locker = lockers.find(
        (locker) => locker.id === rental.space.lockerId
      )
      return {
        ...rental,
        space: {
          ...rental.space,
          locker
        }
      }
    })

    res.status(200).json(rentalsWithLockers)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export default getRentals
