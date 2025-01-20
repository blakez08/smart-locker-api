import { Router } from 'express'
import db, { schema } from '../../../database'
import { eq, inArray } from 'drizzle-orm'

const router = Router()

router.put('/:spaceId', async (req, res, next) => {
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
})

router.post('/:spaceId/rent', async (req, res, next) => {
  try {
    const space = await db.query.spaces.findFirst({
      where: eq(schema.spaces.id, parseInt(req.params.spaceId))
    })

    if (!space) return next(new Error('Space not found'))
    if (!space.available) return next(new Error('Space is not available'))

    const rentedSpace = await db
      .update(schema.spaces)
      .set({
        available: false
      })
      .where(eq(schema.spaces.id, parseInt(req.params.spaceId)))
      .returning()

    res.status(200).json(rentedSpace)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.post('/:spaceId/return', async (req, res, next) => {
  try {
    const space = await db.query.spaces.findFirst({
      where: eq(schema.spaces.id, parseInt(req.params.spaceId))
    })

    if (!space) return next(new Error('Space not found'))
    if (space.available) return next(new Error('Space is already available'))

    const returnedSpace = await db
      .update(schema.spaces)
      .set({
        available: true
      })
      .where(eq(schema.spaces.id, parseInt(req.params.spaceId)))
      .returning()

    res.status(200).json(returnedSpace)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.get('/available', async (req, res, next) => {
  try {
    const spaces = await db.query.spaces.findMany({
      where: eq(schema.spaces.available, true),
      with: {
        locker: true
      }
    })

    res.status(200).json(spaces)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.get('/unavailable', async (req, res, next) => {
  try {
    const spaces = await db.query.spaces.findMany({
      where: eq(schema.spaces.available, false)
    })

    const lockers = await db.query.lockers.findMany({
      where: inArray(
        schema.lockers.id,
        spaces.map((space) => space.lockerId)
      )
    })

    const spacesWithLockers = spaces.map((space) => {
      const locker = lockers.find((locker) => locker.id === space.lockerId)
      return {
        ...space,
        locker
      }
    })

    res.status(200).json(spacesWithLockers)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

export default router
