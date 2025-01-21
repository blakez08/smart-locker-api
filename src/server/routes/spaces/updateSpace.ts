import db, { schema } from '../../../database'
import { eq } from 'drizzle-orm'
import { RequestHandler } from 'express'

const updateSpace: RequestHandler = async (req, res, next) => {
  try {
    const { spaceId } = req.params

    const space = await db
      .update(schema.spaces)
      .set(req.body)
      .where(eq(schema.spaces.id, parseInt(spaceId)))
      .returning()

    res.status(200).json(space)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

export default updateSpace
