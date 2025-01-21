import db, { schema } from '../../../database'
import { eq } from 'drizzle-orm'
import { RequestHandler } from 'express'

const updateLocker: RequestHandler = async (req, res, next) => {
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
}

export default updateLocker
