import db, { schema } from '../../../database'
import { eq } from 'drizzle-orm'
import { RequestHandler } from 'express'

const getRentals: RequestHandler = async (req, res, next) => {
  try {
    const user = res.locals.user

    const rentals = await db.query.rentals.findMany({
      where: user ? eq(schema.rentals.userId, user.id) : undefined,
      with: {
        space: {
          with: {
            locker: true
          }
        }
      }
    })

    res.status(200).json(rentals)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export default getRentals
