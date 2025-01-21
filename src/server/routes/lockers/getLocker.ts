import db, { schema } from '../../../database'
import { eq } from 'drizzle-orm'
import { RequestHandler } from 'express'

const getLocker: RequestHandler = async (req, res, next) => {
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
}

export default getLocker
